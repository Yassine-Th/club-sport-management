// src/hooks/useLocalStorage.js
import { useSyncExternalStore } from 'react';

function useLocalStorage(key, defaultValue) {
  // Reads the value from localStorage, returns defaultValue if not found or on server
  const getSnapshot = () => {
    // Prevent ReferenceError: localStorage is not defined during SSR
    if (typeof window === 'undefined') {
      return defaultValue;
    }
    try {
      const item = localStorage.getItem(key);
      return item !== null ? item : defaultValue; // Return stored item or default
    } catch (error) {
      console.error(`Error reading localStorage key “${key}”:`, error);
      return defaultValue;
    }
  };

  // Subscribes to storage events (for other tabs) and custom 'local-storage' events (for same tab)
  const subscribe = (notify) => {
    // Prevent adding listeners during SSR
    if (typeof window === 'undefined') {
      return () => {}; // Return an empty unsubscribe function
    }

    const handler = (e) => {
      if ((e.type === 'storage' && e.key === key) || (e.type === 'local-storage' && e.detail?.key === key)) {
        console.log(`useLocalStorage (${key}): Notified by ${e.type} event.`);
        notify(); // Notify React that the store value might have changed
      }
    };

    window.addEventListener('storage', handler); // Listen for changes in other tabs/windows
    window.addEventListener('local-storage', handler); // Listen for manual dispatches in the same tab
    console.log(`useLocalStorage (${key}): Added storage listeners.`);

    // Cleanup function to remove listeners
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('local-storage', handler);
      console.log(`useLocalStorage (${key}): Removed storage listeners.`);
    };
  };

  // Server snapshot should usually match the client default for localStorage
  const getServerSnapshot = () => defaultValue;

  const storedValue = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot // Use the dedicated server snapshot function
  );

  // --- Setter Function ---
  const setValue = (newValue) => {
    // Prevent setting localStorage during SSR
    if (typeof window === 'undefined') {
      console.warn(`Attempted to set localStorage key “${key}” during SSR. Operation skipped.`);
      return;
    }
    try {
      const valueToStore = newValue instanceof Function ? newValue(storedValue) : newValue;
      const currentValue = localStorage.getItem(key); // Get current value before setting

      if (valueToStore === null || valueToStore === undefined) {
        if (currentValue !== null) { // Only remove and dispatch if it existed
           localStorage.removeItem(key);
           console.log(`useLocalStorage (${key}): Removed item from localStorage.`);
           window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }));
        }
      } else {
        const stringValue = String(valueToStore); // Ensure value is a string
        if (stringValue !== currentValue) { // Only set and dispatch if the value actually changes
          localStorage.setItem(key, stringValue);
          console.log(`useLocalStorage (${key}): Set item in localStorage to "${stringValue}".`);
          // Dispatch custom event for same-tab updates
          window.dispatchEvent(new CustomEvent('local-storage', { detail: { key } }));
        } else {
            console.log(`useLocalStorage (${key}): Value is the same ("${stringValue}"), no update needed.`);
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;