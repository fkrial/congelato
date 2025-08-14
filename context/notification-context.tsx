"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Solo creamos la instancia de Audio en el lado del cliente
    setAudio(new Audio('/sounds/notification.mp3'));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    // Reproducir sonido
    audio?.play().catch(e => console.error("Error playing notification sound:", e));
  }, [audio]);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Simulación de notificación entrante para probar
  useEffect(() => {
    const interval = setInterval(() => {
      addNotification({
        title: 'Nueva Venta',
        message: 'Se ha registrado una nueva venta en efectivo.',
      });
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};