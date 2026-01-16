import { Bell, Search, ChevronDown, LogOut, CalendarIcon, Menu, X, Sun, Moon, User, Settings } from "lucide-react";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import avatar from "/images/user.jpg";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../hooks/useTheme";

interface TopbarProps {
  onMenuClick: () => void;
  sidebarOpen: boolean;
}

const Topbar = ({ onMenuClick, sidebarOpen }: TopbarProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();



  const handleLogout = () => {
    logout(false); // not silent — shows toast
  };

  const handleNotification = () => {
    navigate("/notification");
  };

  const handleProfile = () => {
    navigate("/profile");
    setShowUserMenu(false);
  };

  const handleSettings = () => {
    navigate("/settings");
    setShowUserMenu(false);
  };

  const userData = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <header className="sticky top-0 right-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200 h-20 px-6 flex items-center justify-between transition-all duration-300">
      {/* LEFT SECTION */}
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Search */}
        <div className="relative hidden md:flex items-center">
          <Search size={18} className="absolute left-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search orders, customers..."
            className="pl-10 pr-4 py-2.5 w-72 bg-slate-100 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 text-slate-700 placeholder-slate-400 transition-all"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Calendar Picker */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
          <CalendarIcon size={16} className="text-slate-500" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="EEE, dd MMM yyyy"
            dropdownMode="select"
            className="bg-transparent border-none text-sm text-slate-600 focus:outline-none w-32 cursor-pointer"
            popperPlacement="bottom-end"
          />
        </div>

        {/* Theme Toggle */}
        <button
          className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-teal-600 transition-colors relative"
            onClick={handleNotification}
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
        </div>

        {/* User Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-50 transition-colors group"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5">
              <img src={avatar} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white" />
            </div>
            <div className="hidden md:block text-left">
              <span className="text-sm font-semibold text-slate-700 block leading-tight">{userData?.firstName || "User"}</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                {userData?.companyName || "Admin"} <ChevronDown size={10} />
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-5 py-4 border-b border-slate-100 mb-2 flex items-center gap-3 bg-slate-50/50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 p-0.5">
                  <img src={avatar} alt="User" className="w-full h-full rounded-full object-cover border-2 border-white" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold text-slate-800 truncate">{userData?.firstName || "User"}</p>
                  <p className="text-xs text-slate-500 truncate">{userData?.email || "user@example.com"}</p>
                </div>
              </div>

              <div className="px-2">
                <button
                  onClick={handleProfile}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors"
                >
                  <User size={16} />
                  My Profile
                </button>
                <button
                  onClick={handleSettings}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-teal-600 rounded-lg transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 px-2">
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {(showNotifications || showUserMenu) && (
        <div
          className="fixed inset-0 z-30 bg-transparent"
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Topbar;
