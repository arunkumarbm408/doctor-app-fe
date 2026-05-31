import { useEffect } from "react";

const NotificationToast = ({ notifications, onDismiss }) => {
  return (
    <div
      style={{
        position: "fixed",
        top: "80px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        maxWidth: "360px",
      }}
    >
      {notifications.map((n) => (
        <ToastItem key={n.id} notification={n} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

const ToastItem = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(notification.id), 5000);
    return () => clearTimeout(timer);
  }, [notification.id, onDismiss]);

  const bgClass = {
    success: "bg-success",
    info: "bg-info",
    warning: "bg-warning",
    danger: "bg-danger",
  }[notification.type] || "bg-info";

  return (
    <div
      className={`toast show ${bgClass} text-white`}
      role="alert"
      style={{ minWidth: "280px" }}
    >
      <div className="toast-header text-white" style={{ background: "rgba(0,0,0,0.15)" }}>
        <strong className="me-auto">{notification.title}</strong>
        <button
          type="button"
          className="btn-close btn-close-white"
          onClick={() => onDismiss(notification.id)}
        />
      </div>
      <div className="toast-body">{notification.message}</div>
    </div>
  );
};

export default NotificationToast;
