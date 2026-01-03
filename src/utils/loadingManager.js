import { useState, useEffect } from 'react';

// Simple event emitter for loading state
class LoadingManager {
  constructor() {
    this.listeners = new Set();
    this.loadingCount = 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    const isLoading = this.loadingCount > 0;
    this.listeners.forEach(listener => listener(isLoading));
  }

  startLoading() {
    this.loadingCount++;
    this.notify();
  }

  stopLoading() {
    this.loadingCount = Math.max(0, this.loadingCount - 1);
    this.notify();
  }
}

export const loadingManager = new LoadingManager();

export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return loadingManager.subscribe(setIsLoading);
  }, []);

  return isLoading;
};
