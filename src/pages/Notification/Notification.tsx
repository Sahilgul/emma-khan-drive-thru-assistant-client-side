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
    Array.from({ length: 8 }).map((_, i) => ({
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
      message: `Order #${1000 + i} - ${["Cheeseburger Meal", "Chicken Wrap Combo", "Large Fries", "Vanilla Latte", "Caesar Salad"][i % 5]
        } has been updated.`,
      time: `${10 + i * 5} minutes ago`,
      read: i > 2,
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

  const getStepStyles = (type: Notification["type"]) => {
    switch (type) {
      case "orderPlaced":
        return { icon: Package, color: "text-blue-600", bg: "bg-blue-100" };
      case "paymentPending":
        return { icon: Clock, color: "text-amber-600", bg: "bg-amber-100" };
      case "paymentReceived":
        return { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" };
      case "preparingOrder":
        return { icon: UtensilsCrossed, color: "text-orange-600", bg: "bg-orange-100" };
      case "lowStock":
        return { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" };
      case "orderCompleted":
        return { icon: Check, color: "text-teal-600", bg: "bg-teal-100" };
      default:
        return { icon: Package, color: "text-slate-600", bg: "bg-slate-100" };
    }
  };

  return (
    <div className="p-8 pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Notifications</h1>
          <p className="text-slate-500 mt-1">
            You have {notifications.filter((n) => !n.read).length} unread notifications.
          </p>
        </div>

        <button
          onClick={handleMarkAll}
          className="px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-200 rounded-xl text-sm font-medium transition-colors shadow-sm"
        >
          Mark all as read
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Package size={48} className="mx-auto mb-4 opacity-20" />
            <p>No notifications yet.</p>
          </div>
        ) : (
          notifications.map((n) => {
            const { icon: Icon, color, bg } = getStepStyles(n.type);
            return (
              <div
                key={n.id}
                onClick={() => toggleRead(n.id)}
                className={`relative group flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer
                  ${n.read
                    ? "bg-white border-slate-100 hover:border-slate-200"
                    : "bg-white border-teal-100 shadow-sm shadow-teal-500/5 ring-1 ring-teal-500/20"
                  }
                `}
              >
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${color}`}>
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-semibold truncate pr-4 ${n.read ? "text-slate-700" : "text-slate-900"}`}>
                      {n.type.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                    </h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{n.time}</span>
                  </div>
                  <p className={`text-sm leading-relaxed ${n.read ? "text-slate-500" : "text-slate-600 font-medium"}`}>
                    {n.message}
                  </p>
                </div>

                {/* Unread Indicator */}
                {!n.read && (
                  <div className="absolute top-6 right-6 w-2 h-2 bg-teal-500 rounded-full"></div>
                )}

                {/* Delete Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                  className="absolute top-1/2 -translate-y-1/2 right-4 p-2 text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Remove notification"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Notification;
