import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import React, { useState, useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const toggleCollapse = () => setSidebarCollapsed((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (!mobile) {
        setSidebarOpen(true);       // always open on desktop
      } else {
        setSidebarOpen(false);      // closed by default on mobile
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex bg-[#F7F8FC] min-h-screen text-gray-800">
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        isMobile={isMobile}          // ✅ pass this
        toggleSidebar={toggleSidebar}
        toggleCollapse={toggleCollapse}
      />

      <div className={`flex flex-col flex-1 transition-all duration-300 ${
          isMobile
            ? 'ml-0'
            : (sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-80')
        }`}
      >
        <Topbar onMenuClick={toggleSidebar} sidebarOpen={sidebarOpen} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;
