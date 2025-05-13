import React, { useState, useEffect } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ShoppingCart as CartIconSvg,
} from "lucide-react";
import { Link } from "react-router-dom";
import AuthModal from "../../../helpers/AuthModal";
import isLoggedIn from "../../../Auth/CheckLoggedIn";

/**
 * Cart manager that handles all cart functionality
 */
const Cart = {
  _items: [],
  _listeners: [],
  _isOpen: false,

  init() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      if (stored) this._items = JSON.parse(stored);
      this._notify();
    }
  },

  _save() {
    if (typeof window !== "undefined") {
      localStorage.setItem("cart", JSON.stringify(this._items));
    }
  },

  _notify() {
    this._listeners.forEach((fn) => fn());
  },

  subscribe(fn) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter((l) => l !== fn);
    };
  },

  getItems() {
    return [...this._items];
  },

  getCount() {
    return this._items.reduce((c, i) => c + i.quantity, 0);
  },

  getTotal() {
    return this._items.reduce(
      (t, i) => t + Number.parseFloat(i.price) * i.quantity,
      0
    );
  },

  isOpen() {
    return this._isOpen;
  },

  toggle() {
    this._isOpen = !this._isOpen;
    this._notify();
  },
  open() {
    this._isOpen = true;
    this._notify();
  },
  close() {
    this._isOpen = false;
    this._notify();
  },

  addItem(product, quantity, selectedSize = null) {
    const idx = this._items.findIndex(
      (it) =>
        it.id === product.id &&
        ((!it.selectedSize && !selectedSize) ||
          it.selectedSize?.id === selectedSize?.id)
    );

    if (idx > -1) {
      const existing = this._items[idx];
      const maxStock =
        product.clothes && selectedSize
          ? product.clothes.sizes.find((s) => s.id === selectedSize.id)?.pivot
              .stock || 0
          : product.stock;
      const newQty = Math.min(existing.quantity + quantity, maxStock);
      this._items[idx] = { ...existing, quantity: newQty };
    } else {
      this._items.push({ ...product, quantity, selectedSize });
    }

    this._save();
    this._notify();
    this.open();
  },

  removeItem(productId, sizeId) {
    this._items = this._items.filter(
      (it) => !(it.id === productId && it.selectedSize?.id === sizeId)
    );
    this._save();
    this._notify();
  },

  updateQuantity(productId, sizeId, newQty) {
    if (newQty < 1) return;
    this._items = this._items.map((it) => {
      if (it.id === productId && it.selectedSize?.id === sizeId) {
        const maxStock = it.clothes
          ? it.clothes.sizes.find((s) => s.id === sizeId)?.pivot.stock || 0
          : it.stock;
        return { ...it, quantity: Math.min(newQty, maxStock) };
      }
      return it;
    });
    this._save();
    this._notify();
  },

  clear() {
    this._items = [];
    this._save();
    this._notify();
  },
};

// initialize from localStorage
if (typeof window !== "undefined") Cart.init();

/** Hook to use cart in components */
export function useCart() {
  const [, setTick] = useState(0);
  useEffect(() => {
    const unsub = Cart.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);
  return {
    items: Cart.getItems(),
    count: Cart.getCount(),
    total: Cart.getTotal(),
    isOpen: Cart.isOpen(),
    toggle: () => Cart.toggle(),
    open: () => Cart.open(),
    close: () => Cart.close(),
    addItem: (p, q, s) => Cart.addItem(p, q, s),
    removeItem: (id, sid) => Cart.removeItem(id, sid),
    updateQuantity: (id, sid, q) => Cart.updateQuantity(id, sid, q),
    clear: () => Cart.clear(),
  };
}

/** Sidebar that shows cart items + checkout button or AuthModal */
export function CartSidebar() {
  const { items, total, isOpen, close, removeItem, updateQuantity, clear } =
    useCart();

  // live auth state
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    isLoggedIn(setIsAuth);
  }, []);
  const [showAuthModal, setShowAuthModal] = useState(false);

  

  // block checkout if not logged in
  function handleCheckout(e) {
    if (!isAuth) {
      e.preventDefault();
       setShowAuthModal(true);
      // AuthModal will appear because isOpen && !isAuth
    }
  }

  return (
    <>
      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-lg z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-red-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingBag className="mr-2" />
            <h2 className="font-title text-xl">Votre Panier</h2>
          </div>
          <button onClick={close}>
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 flex-grow overflow-y-auto">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              <ShoppingBag className="mx-auto mb-4 opacity-30" size={48} />
              <p>Votre panier est vide</p>
            </div>
          ) : (
            items.map((item, i) => (
              <div
                key={`${item.id}-${item.selectedSize?.id}-${i}`}
                className="flex mb-4"
              >
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      No Image
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-grow">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{item.name}</h3>
                    <button
                      onClick={() => removeItem(item.id, item.selectedSize?.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                  {item.selectedSize && (
                    <p className="text-sm text-gray-500">
                      Taille: {item.selectedSize.label}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize?.id,
                            item.quantity - 1
                          )
                        }
                        className="px-2"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="px-2">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.selectedSize?.id,
                            item.quantity + 1
                          )
                        }
                        className="px-2"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <span className="font-bold text-red-600">
                      {(Number(item.price) * item.quantity).toFixed(2)} DH
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t">
          {items.length > 0 && (
            <>
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="font-bold text-red-600">
                  {total.toFixed(2)} DH
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={clear}
                  className="py-2 border border-red-600 text-red-600 rounded"
                >
                  Vider
                </button>
                <Link to="/checkout" onClick={handleCheckout}>
                  <button className="py-2 bg-red-600 text-white rounded w-full">
                    Commander
                  </button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

/** Icon for header */
export function CartIcon() {
  const { count, toggle } = useCart();
  return (
    <button onClick={toggle} className="relative text-red-700">
      <CartIconSvg size={24} />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </button>
  );
}

/** Reusable “Add to Cart” button */
export function AddToCartButton({ product, selectedSize, quantity }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const isAvailable = product.clothes
    ? selectedSize
      ? product.clothes.sizes.find((s) => s.id === selectedSize.id)?.pivot
          .stock > 0
      : product.clothes.sizes.some((s) => s.pivot.stock > 0)
    : product.stock > 0;

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => {
      addItem(product, quantity, selectedSize);
      setLoading(false);
    }, 300);
  };

  return (
    <button
      onClick={handleClick}
      disabled={!isAvailable || loading}
      className={`w-full py-3 rounded flex items-center justify-center gap-2 text-white ${
        isAvailable && !loading ? "bg-red-600 hover:bg-red-700" : "bg-gray-400"
      }`}
    >
      {loading ? (
        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <CartIconSvg size={16} />
      )}
      {loading
        ? "Ajout..."
        : isAvailable
        ? "Ajouter au panier"
        : "Indisponible"}
    </button>
  );
}
