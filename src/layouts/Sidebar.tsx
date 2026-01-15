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
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Drive-Thru-Assistant", icon: <Bot size={20} />, path: "/drive-thru-assistant" },
    {
      name: "Menu",
      icon: <UtensilsCrossed size={20} />,
      submenu: [
        { name: "Categories", path: "/menu/categories", icon: <FolderOpen size={16} /> },
        { name: "Add Ons", path: "/menu/add-ons", icon: <Plus size={16} /> },
        { name: "Sides", path: "/menu/add-sides", icon: <UtensilsCrossed size={16} /> },
        { name: "Drinks", path: "/menu/add-drinks", icon: <GlassWater size={16} /> },
      ],
    },
    { name: "Promotions", icon: <Megaphone size={20} />, path: "/promotions" },
    { name: "Settings", icon: <Settings size={20} />, path: "/settings" },
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
        <div className="fixed inset-0 bg-black/40 z-50 transition-opacity" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={{ x: isMobile ? -320 : 0 }}
            animate={{ x: isMobile && !isOpen ? -320 : 0 }}
            exit={{ x: isMobile ? -320 : 0 }}
            transition={{ duration: 0.1, ease: "easeInOut" }}
            className={`h-screen bg-slate-900 text-slate-300 shadow-2xl z-50 flex flex-col transition-all duration-300 flex-shrink-0
              ${isMobile ? "fixed left-0 top-0 w-72" : "sticky top-0 " + (isCollapsed ? "w-20" : "w-72")}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-slate-800 h-20">
              <img src={logo} alt="Brand Logo" className="h-8 w-auto object-contain" />
              {!isCollapsed && <span className="font-bold text-lg text-white tracking-wide">Emma</span>}
            </div>

            {/* Menu */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => isCollapsed && setHoveredMenu(item.name)}
                  onMouseLeave={() => isCollapsed && setHoveredMenu(null)}
                >
                  {item.submenu ? (
                    <>
                      <button
                        onClick={(e) => handleMenuClick(e, item)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                          ${activeMenu === item.name
                            ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/20"
                            : "hover:bg-slate-800 hover:text-white"}`}
                        title={item.name}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`${activeMenu === item.name ? "text-white" : "text-slate-400 group-hover:text-white"}`}>
                            {item.icon}
                          </span>
                          {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                        </div>
                        {!isCollapsed && (
                          activeMenu === item.name ?
                            <ChevronUp size={16} /> :
                            <ChevronDown size={16} className="text-slate-500 group-hover:text-slate-300" />
                        )}
                      </button>

                      {/* Submenu normal */}
                      {!isCollapsed && activeMenu === item.name && (
                        <AnimatePresence>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="ml-4 pl-4 border-l border-slate-700 mt-1 space-y-1 overflow-hidden"
                          >
                            {item.submenu.map(sub => (
                              <NavLink
                                key={sub.name}
                                to={sub.path}
                                className={({ isActive }) =>
                                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors
                                  ${isActive ? "bg-teal-500/10 text-teal-400 font-medium" : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`
                                }
                                onClick={handleSubmenuClick}
                              >
                                {sub.icon}
                                <span>{sub.name}</span>
                              </NavLink>
                            ))}
                          </motion.div>
                        </AnimatePresence>
                      )}

                      {/* Submenu hover (collapsed) */}
                      {isCollapsed && hoveredMenu === item.name && (
                        <div className="absolute left-full top-0 ml-2 w-56 bg-slate-800 rounded-xl shadow-xl border border-slate-700 p-2 z-50">
                          <div className="px-3 py-2 border-b border-slate-700 mb-2">
                            <span className="font-semibold text-white">{item.name}</span>
                          </div>
                          {item.submenu.map(sub => (
                            <NavLink
                              key={sub.name}
                              to={sub.path}
                              className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                                ${isActive ? "bg-teal-600 text-white shadow-md" : "text-slate-300 hover:bg-slate-700 hover:text-white"}`
                              }
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
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                        ${isActive
                          ? "bg-gradient-to-r from-teal-600 to-cyan-600 text-white shadow-lg shadow-teal-900/20"
                          : "hover:bg-slate-800 hover:text-white"}`
                      }
                      onClick={(e) => handleMenuClick(e, item)}
                      title={item.name}
                    >
                      <span className="group-hover:scale-110 transition-transform duration-200">
                        {item.icon}
                      </span>
                      {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                    </NavLink>
                  )}
                </div>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-900/50">
              {/* Language selector */}
              <div className={`flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors ${isCollapsed ? "justify-center" : ""}`}>
                <Globe size={18} />
                {!isCollapsed ? (
                  <div className="flex items-center justify-between flex-1">
                    <select className="bg-transparent border-none outline-none text-sm appearance-none flex-1 cursor-pointer text-slate-400 hover:text-white focus:text-white">
                      <option>🇺🇸 English</option>
                      <option>🇵🇰 Urdu</option>
                      <option>🇸🇦 Arabic</option>
                      <option>🇪🇸 Spanish</option>
                    </select>
                    <ChevronDown size={14} />
                  </div>
                ) : (
                  <span className="text-xs font-bold">EN</span>
                )}
              </div>

              {/* Logout */}
              <button
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors ${isCollapsed ? "justify-center" : ""}`}
                title="Logout"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
