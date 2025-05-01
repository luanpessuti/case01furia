import { useState, useEffect } from 'react';

export interface Notification {
  id: number;
  type: 'info' | 'match' | 'goal' | 'result';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationSystemProps {
  onNotificationClick?: (notification: Notification) => void;
}

export function NotificationSystem({ onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);

  // Exemplo de notificações iniciais
  useEffect(() => {
    const initialNotifications: Notification[] = [
      {
        id: 1,
        type: 'match',
        title: 'Partida começando!',
        message: 'FURIA vs NAVI começa em 5 minutos!',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
      {
        id: 2,
        type: 'info',
        title: 'Novo membro no elenco',
        message: 'Bem-vindo FalleN à família FURIA!',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
      },
    ];

    setNotifications(initialNotifications);
    updateNotificationCount(initialNotifications);
  }, []);

  const updateNotificationCount = (notifs: Notification[]) => {
    const unreadCount = notifs.filter(n => !n.read).length;
    setNotificationCount(unreadCount);
  };

  useEffect(() => {
    const types = ['match', 'goal', 'result', 'info'];
    const messages = [
      'FURIA marcou mais um ponto!',
      'FURIA vs LIQUID começa em 30 minutos',
      'KSCERATO fez um ace incrível!',
      'Novo conteúdo exclusivo na área de membros',
      'A FURIA garantiu vaga no Major!',
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)] as any,
          title: 'Nova Atualização',
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => [newNotification, ...prev]);
        updateNotificationCount([newNotification, ...notifications]);
        showToast(newNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notifications]);

  const showToast = (notification: Notification) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-stone-700 text-white p-3 rounded-lg shadow-lg z-50 border-l-4 border-amber-400 animate-fade-in';
    toast.innerHTML = `
      <div class="font-bold text-amber-400">${notification.title}</div>
      <div class="text-sm">${notification.message}</div>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('animate-fade-out');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 500);
    }, 5000);
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    updateNotificationCount(updatedNotifications);
  };

  const handleNotificationClick = (notification: Notification) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notification.id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    updateNotificationCount(updatedNotifications);

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match': return '🏆';
      case 'goal': return '🎯';
      case 'result': return '📊';
      default: return '📢';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin}m atrás`;
    if (diffHrs < 24) return `${diffHrs}h atrás`;
    return `${diffDays}d atrás`;
  };

  return (
    <div className="relative">
      {/* Botão de notificações */}
        <button
          className="relative p-2 rounded-full hover:bg-stone-700 transition-colors"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>

          {notificationCount > 0 && (
            <span className="absolute top-0 right-0 bg-amber-400 text-stone-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {notificationCount}
            </span>
          )}
        </button>
    
      {/* Dropdown de notificações */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-stone-800 border border-amber-400/20 rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="flex justify-between items-center p-3 bg-stone-750 border-b border-amber-400/20">
            <h3 className="font-title text-lg text-amber-400">Notificações</h3>
            {notificationCount > 0 && (
              <button
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors"
                onClick={markAllAsRead}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-stone-700/50">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-stone-400">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-3 hover:bg-stone-700/50 cursor-pointer transition-colors ${notification.read ? 'opacity-80' : 'bg-stone-750'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl text-amber-400 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className={`font-bold ${notification.read ? 'text-stone-300' : 'text-white'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-stone-400">
                          {formatRelativeTime(notification.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm ${notification.read ? 'text-stone-400' : 'text-stone-200'}`}>
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-amber-400 rounded-full mt-2"></span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}