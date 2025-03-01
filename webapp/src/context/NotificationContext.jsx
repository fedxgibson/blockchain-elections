import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

const NotificationContext = createContext(null);

const NotificationComponent = ({ message, type, onClose }) => {
  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  }[type] || 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all transform animate-slide-up`}>
      <div className="flex items-center space-x-2">
        <span data-test-id="notification">{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 6000);

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      {createPortal(
        <div className="fixed z-50 flex flex-col space-y-2">
          {notifications.map(({ id, message, type }) => (
            <NotificationComponent
              key={id}
              message={message}
              type={type}
              onClose={() => removeNotification(id)}
            />
          ))}
        </div>,
        document.body
      )}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};