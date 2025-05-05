import { useEffect, useState } from "react";
import { useViewportSize } from "@mantine/hooks";
import JRSideBar from "./AdSideBar";
import Header from "../../Header";
import React from "react";

function JRTLayout({ children }) {
  const [opened, setOpened] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const { width } = useViewportSize();

  // Update sidebar width when window resizes
  useEffect(() => {
    const handleResize = () => {
      if (width < 768) {
        setSidebarWidth(opened ? 250 : 70);
      } else {
        setSidebarWidth(250);
      }
    };

    handleResize(); // Initial check
  }, [opened, width]);

  return (
    <>
      <Header />
      <div className="flex bg-gray-50 overflow-x-hidden">
        <JRSideBar
          width={sidebarWidth}
          opened={opened}
          setOpened={setOpened}
        />
        <div
          className="transition-all duration-300 ease-in-out min-h-screen w-full p-6"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          {children}
        </div>
      </div>
    </>
  );
}

export default JRTLayout;
