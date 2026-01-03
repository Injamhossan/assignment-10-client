import { useState, useEffect } from 'react';

// Simple ID generator
const generateId = () => Math.random().toString(36).substr(2, 9);

class ToastManager {
  constructor() {
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.listeners.forEach(listener => listener(event));
  }

  // Public API mimicking react-toastify
  success(message, options = {}) {
    this.notify({ id: generateId(), type: 'success', message, ...options });
  }

  error(message, options = {}) {
    this.notify({ id: generateId(), type: 'error', message, ...options });
  }

  info(message, options = {}) {
    this.notify({ id: generateId(), type: 'info', message, ...options });
  }
  
  warning(message, options = {}) {
    this.notify({ id: generateId(), type: 'warning', message, ...options });
  }
}

export const toast = new ToastManager();

export const useToastSubscription = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    return toast.subscribe((newToast) => {
      setToasts((prev) => [...prev, newToast]);
    });
  }, []);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return { toasts, removeToast };
};
