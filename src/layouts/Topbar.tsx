import { Bell, Search, ChevronDown, LogOut, CalendarIcon, Menu, X, Sun, Moon } from "lucide-react";
import { useState } from "react";
import DatePicker from 'react-datepicker';
import avatar from "/images/user.jpg";
import { useNavigate } from "react-router-dom";
import "./Topbar.css";
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

  const notifications = [
    { id: 1, text: "New order received #1234", time: "5 min ago", unread: true },
    { id: 2, text: "Payment received from John Doe", time: "1 hour ago", unread: true },
    { id: 3, text: "Inventory low for Cheese Burger", time: "2 hours ago", unread: false },
    { id: 4, text: "New customer registered", time: "5 hours ago", unread: false },
  ];

  const handleLogout = () => {
    logout(false); // not silent — shows toast
  };

  const handleNotification = () => {
    navigate("/notification");
  };

  const userData = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <header className="topbar">
      {/* LEFT SECTION */}
      <div className="topbar-left">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg mobile-toggle"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Search */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search orders, customers, menu items..."
            className="search-input"
          />
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="topbar-right">
        {/* Calendar Picker */}
        <div className="calendar-picker">
          <CalendarIcon size={18} className="calendar-icon" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="EEE, dd MMM yyyy"
            dropdownMode="select"
            className="calendar-input"
            popperPlacement="bottom-end"
          />
        </div>

        {/* Theme Toggle */}
        <button
          className="icon-btn theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          title="Toggle Theme"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <div className="dropdown-wrapper">
          <button
            className="icon-btn"
            onClick={handleNotification}
          // onClick={() => {
          //   setShowNotifications(!showNotifications);
          //   setShowUserMenu(false);
          // }}
          >
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>

          {showNotifications && (
            <div className="dropdown notifications-dropdown">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <p>{notifications.filter(n => n.unread).length} unread</p>
              </div>
              <div className="dropdown-content">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`notification-item ${n.unread ? "unread" : ""}`}
                  >
                    <p>{n.text}</p>
                    <span>{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="dropdown-footer">
                <button onClick={handleNotification}>Show all</button>
              </div>
            </div>
          )}
        </div>

        {/* User Dropdown */}
        <div className="dropdown-wrapper">
          <button
            className="user-btn"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <img src={avatar} alt="User" className="avatar" />
            <div className="user-info">
              <span className="username">{userData.firstName}</span>
              <span className="role">
                {userData.companyName} <ChevronDown size={12} />
              </span>
            </div>
          </button>

          {showUserMenu && (
            <div className="dropdown user-dropdown">
              <div className="user-header">
                <img src={avatar} alt="User" className="avatar-large" />
                <div>
                  <p className="username">{userData.firstName}</p>
                  <p className="email">{userData.email}</p>
                </div>
              </div>
              <div className="dropdown-content my-profile">
                <button>🏠 My Profile</button>
              </div>
              <div className="dropdown-footer logout-footer">
                <button className="logout" onClick={handleLogout}>
                  <LogOut size={18} className="logout-icon" />
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
          className="overlay"
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
