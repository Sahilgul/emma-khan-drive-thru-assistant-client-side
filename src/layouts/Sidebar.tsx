import {
  LayoutDashboard,
  UtensilsCrossed,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  Globe,
  FolderOpen,
  Plus,
  GlassWater,
  Megaphone,
  Bot,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Sidebar.css";
import type { JSX } from "react/jsx-runtime";
import logo from "/images/brand-logo.png";
import { useAuth } from "../hooks/useAuth";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  path?: string;
  submenu?: { name: string; path: string; icon: JSX.Element }[];
}

interface SidebarProps {
  isOpen: boolean;
  isCollapsed: boolean;
  isMobile: boolean; // new flag for mobile
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

const Sidebar = ({ isOpen, isCollapsed, isMobile, toggleSidebar }: SidebarProps) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems: MenuItem[] = [
    { name: "Dashboard", icon: <LayoutDashboard size={22} />, path: "/dashboard" },
    { name: "Drive-Thru-Assistant", icon: <Bot size={22} />, path: "/drive-thru-assistant" },
    {
      name: "Menu",
      icon: <UtensilsCrossed size={22} />,
      submenu: [
        { name: "Categories", path: "/menu/categories", icon: <FolderOpen size={16} /> },
        { name: "Add Ons", path: "/menu/add-ons", icon: <Plus size={16} /> },
        { name: "Sides", path: "/menu/add-sides", icon: <UtensilsCrossed size={16} /> },
        { name: "Drinks", path: "/menu/add-drinks", icon: <GlassWater size={16} /> },
      ],
    },
    { name: "Promotions", icon: <Megaphone size={22} />, path: "/promotions" },
    { name: "Settings", icon: <Settings size={22} />, path: "/settings" },
  ];

  // Open/close submenu
  const toggleSubmenu = (menuName: string) => {
    setActiveMenu((prev) => (prev === menuName ? null : menuName));
  };

  // Close submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Set active menu based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    menuItems.forEach(item => {
      if (item.submenu) {
        if (item.submenu.some(sub => sub.path === currentPath)) setActiveMenu(item.name);
      } else if (item.path === currentPath) setActiveMenu(item.name);
    });
  }, [location.pathname]);

  const handleMenuClick = (e: React.MouseEvent, item: MenuItem) => {
    e.stopPropagation();
    if (item.submenu) {
      toggleSubmenu(item.name);
    } else {
      setActiveMenu(item.name);
      if (isMobile) toggleSidebar();
    }
  };

  const handleSubmenuClick = () => {
    if (isMobile) toggleSidebar();
  };

  const handleLogout = () => {
    logout(false); // not silent — shows toast
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50" onClick={toggleSidebar} />
      )}


      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -320 : 0 }}
            animate={{ x: isMobile && !isOpen ? -320 : 0 }}
            exit={{ x: isMobile ? -320 : 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className={`sidebar ${isCollapsed ? "sidebar-collapsed" : ""} ${isMobile ? "mobile-sidebar" : ""
              } ${isMobile && isOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-content">
              {/* Header */}
              <div className="sidebar-header">
                <div className="flex items-center gap-3 pb-1">
                  <img src={logo} alt="Brand Logo" className="h-8 w-auto" />
                  {!isCollapsed && <span className="font-bold text-lg"></span>}
                </div>
              </div>

              {/* Menu */}
              <nav className="sidebar-menu">
                {menuItems.map((item) => (
                  <div
                    key={item.name}
                    className="menu-item-wrapper"
                    onMouseEnter={() => isCollapsed && setHoveredMenu(item.name)}
                    onMouseLeave={() => isCollapsed && setHoveredMenu(null)}
                  >
                    {item.submenu ? (
                      <>
                        <button
                          onClick={(e) => handleMenuClick(e, item)}
                          className={`menu-item ${activeMenu === item.name ? "active" : ""}`}
                          title={item.name}
                        >
                          <div className="menu-icon-wrap">
                            <div className={`menu-icon ${activeMenu === item.name ? "active" : ""}`}>
                              {item.icon}
                            </div>
                            {!isCollapsed && <span className="font-medium">{item.name}</span>}
                          </div>
                          {!isCollapsed && (
                            activeMenu === item.name ?
                              <ChevronUp size={18} className="text-white" /> :
                              <ChevronDown size={18} className="text-gray-400" />
                          )}
                        </button>

                        {/* Submenu normal */}
                        {!isCollapsed && activeMenu === item.name && (
                          <AnimatePresence>
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="submenu"
                            >
                              {item.submenu.map(sub => (
                                <NavLink
                                  key={sub.name}
                                  to={sub.path}
                                  className={({ isActive }) => `submenu-item ${isActive ? "active" : ""}`}
                                  onClick={handleSubmenuClick}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={location.pathname === sub.path ? "text-[#76B900]" : "text-[#475569]"}>
                                      {sub.icon}
                                    </div>
                                    <span>{sub.name}</span>
                                  </div>
                                </NavLink>
                              ))}
                            </motion.div>
                          </AnimatePresence>
                        )}

                        {/* Submenu hover (collapsed) */}
                        {isCollapsed && hoveredMenu === item.name && (
                          <div className="submenu-hover">
                            <div className="submenu-hover-header">
                              <span className="font-semibold">{item.name}</span>
                            </div>
                            {item.submenu.map(sub => (
                              <NavLink
                                key={sub.name}
                                to={sub.path}
                                className={({ isActive }) => `submenu-hover-item ${isActive ? "active" : ""}`}
                                onClick={handleSubmenuClick}
                              >
                                <div className="flex items-center gap-3">{sub.icon}<span>{sub.name}</span></div>
                              </NavLink>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.path!}
                        className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
                        onClick={(e) => handleMenuClick(e, item)}
                        title={item.name}
                      >
                        <div className="menu-icon-wrap">
                          <div className={`menu-icon ${activeMenu === item.name ? "active" : ""}`}>{item.icon}</div>
                          {!isCollapsed && <span className="font-medium">{item.name}</span>}
                        </div>
                      </NavLink>
                    )}
                  </div>
                ))}
              </nav>
            </div>

            {/* Footer */}
            <div className="sidebar-footer">
              {/* Language selector */}
              <div className={`footer-item language-selector ${isCollapsed ? "collapsed" : ""}`}>
                <div className="footer-icon"><Globe size={18} /></div>
                {!isCollapsed ? (
                  <div className="footer-content">
                    <select className="footer-dropdown">
                      <option>🇺🇸 English</option>
                      <option>🇵🇰 Urdu</option>
                      <option>🇸🇦 Arabic</option>
                      <option>🇪🇸 Spanish</option>
                    </select>
                    <ChevronDown size={14} className="dropdown-arrow" />
                  </div>
                ) : (
                  <select className="footer-dropdown-collapsed">
                    <option>EN</option>
                    <option>UR</option>
                    <option>AR</option>
                    <option>ES</option>
                  </select>
                )}
              </div>

              {/* Logout */}
              <button className={`footer-item logout-btn ${isCollapsed ? "collapsed" : ""}`} title="Logout" onClick={handleLogout}>
                <div className="footer-icon"><LogOut size={18} /></div>
                {!isCollapsed && <div className="footer-content"><span className="footer-label">Logout</span></div>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
