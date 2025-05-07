import React from "react";
import { useEffect, useState } from "react";
import { useViewportSize } from "@mantine/hooks";
import AdHeader from "./AdHeader";
import AdSideBar from "./AdSideBar";

function AdTLayout({ children, navData, user }) {
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
    <div className="flex flex-col min-h-screen bg-gray-100">
      <AdHeader />
      <div className="flex flex-1 overflow-x-hidden">
        <AdSideBar
          width={sidebarWidth}
          opened={opened}
          setOpened={setOpened}
          navData={navData}
          user={user}
        />
        <div
          className="transition-all duration-300 ease-in-out min-h-screen w-full p-6"
          style={{ marginLeft: `${sidebarWidth}px` }}
        >
          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-6rem)]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdTLayout;
