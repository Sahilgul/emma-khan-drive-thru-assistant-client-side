import React, { useState } from "react";
import {
  Trash2,
  Package,
  Clock,
  CheckCircle2,
  UtensilsCrossed,
  AlertTriangle,
  Check,
} from "lucide-react";
import "./Notification.css";

interface Notification {
  id: number;
  type:
    | "orderPlaced"
    | "paymentPending"
    | "paymentReceived"
    | "preparingOrder"
    | "lowStock"
    | "orderCompleted";
  message: string;
  time: string;
  read: boolean;
}

const Notification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(
    Array.from({ length: 20 }).map((_, i) => ({
      id: i + 1,
      type:
        i % 6 === 0
          ? "orderPlaced"
          : i % 6 === 1
          ? "paymentPending"
          : i % 6 === 2
          ? "paymentReceived"
          : i % 6 === 3
          ? "preparingOrder"
          : i % 6 === 4
          ? "lowStock"
          : "orderCompleted",
      message: `Notification ${i + 1} — ${
        ["Cheeseburger", "Wrap", "Fries", "Latte", "Salad"][i % 5]
      } Update`,
      time: `${10 + i} minutes ago`,
      read: i % 3 === 0 ? false : true, // some unread
    }))
  );

  const handleDelete = (id: number) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const handleMarkAll = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const toggleRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "orderPlaced":
        return <Package className="icon order" />;
      case "paymentPending":
        return <Clock className="icon pending" />;
      case "paymentReceived":
        return <CheckCircle2 className="icon received" />;
      case "preparingOrder":
        return <UtensilsCrossed className="icon preparing" />;
      case "lowStock":
        return <AlertTriangle className="icon alert" />;
      case "orderCompleted":
        return <Check className="icon completed" />;
      default:
        return <Package className="icon default" />;
    }
  };

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <h1 className="title">Notifications</h1>
        <button className="mark-read-btn" onClick={handleMarkAll}>
          Mark All as Read
        </button>
      </div>

      <p className="subtitle">
        You’ve got {notifications.filter((n) => !n.read).length} unread
        notifications today!
      </p>

      <div className="notifications-section">
        <h2 className="section-title">Today</h2>

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-card ${n.read ? "read" : "unread"}`}
            onClick={() => toggleRead(n.id)}
          >
            <div className="notification-left">
              <div className="icon-box">{getIcon(n.type)}</div>
              <div className="notification-content">
                <p className="message">{n.message}</p>
                <p className="time">{n.time}</p>
              </div>
            </div>
            <button
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation(); // prevent marking read when deleting
                handleDelete(n.id);
              }}
              title="Delete notification"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notification;
