import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Notification {
  id: number;
  type: 'info' | 'match' | 'goal' | 'result' | 'highlight';
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

  useEffect(() => {
    // Notificações iniciais de exemplo
    const initialNotifications: Notification[] = [
      {
        id: 1,
        type: 'match',
        title: 'PARTIDA INICIANDO!',
        message: 'FURIA vs NAVI começa agora!',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
      },
      {
        id: 2,
        type: 'highlight',
        title: 'PLAY OF THE GAME',
        message: 'KSCERATO com um ACE incrível!',
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
    const types: Notification['type'][] = ['match', 'goal', 'result', 'highlight'];
    const messages = [
      'FURIA marcou mais um ponto!',
      'FURIA vs LIQUID - próxima partida',
      'FalleN com um clutch incrível!',
      'Novo conteúdo exclusivo disponível',
      'FURIA garantiu vaga no Major!',
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const newNotification: Notification = {
          id: Date.now(),
          type: types[Math.floor(Math.random() * types.length)],
          title: ['PARTIDA!', 'DESTAQUE!', 'GOL!', 'RESULTADO!'][Math.floor(Math.random() * 4)],
          message: messages[Math.floor(Math.random() * messages.length)],
          timestamp: new Date(),
          read: false,
        };

        setNotifications(prev => [newNotification, ...prev.slice(0, 9)]);
        updateNotificationCount([newNotification, ...notifications]);
        showToast(newNotification);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [notifications]);

  const showToast = (notification: Notification) => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-3 rounded-lg shadow-lg z-50 border-l-4 ${
      notification.type === 'highlight' ? 'border-lime-400 bg-gradient-to-r from-stone-900 to-lime-400/10' :
      notification.type === 'match' ? 'border-pink-400 bg-gradient-to-r from-stone-900 to-pink-400/10' :
      'border-cyan-400 bg-gradient-to-r from-stone-900 to-cyan-400/10'
    } animate-fade-in`;
    
    toast.innerHTML = `
      <div class="font-bold ${
        notification.type === 'highlight' ? 'text-lime-400' :
        notification.type === 'match' ? 'text-pink-400' :
        'text-cyan-400'
      }">${notification.title}</div>
      <div class="text-sm text-stone-200">${notification.message}</div>
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
    setShowDropdown(false);

    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'match': return '🏆';
      case 'goal': return '🎯';
      case 'result': return '📊';
      case 'highlight': return '⚡';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'match': return 'bg-pink-400/20 text-pink-400';
      case 'goal': return 'bg-cyan-400/20 text-cyan-400';
      case 'result': return 'bg-purple-400/20 text-purple-400';
      case 'highlight': return 'bg-lime-400/20 text-lime-400';
      default: return 'bg-stone-400/20 text-stone-400';
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin}m`;
    if (diffHrs < 24) return `${diffHrs}h`;
    return `${diffDays}d`;
  };

  return (
    <div className="relative">
      {/* Botão de notificações */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        className="relative p-2 rounded-full hover:bg-stone-800/50 transition-colors"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          
          {notificationCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 bg-pink-400 text-stone-900 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-[0_0_8px_rgba(255,78,205,0.5)]"
            >
              {notificationCount}
            </motion.span>
          )}
        </div>
      </motion.button>

      {/* Dropdown de notificações */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute right-0 mt-2 w-80 bg-stone-900/95 backdrop-blur-lg border border-cyan-400/30 rounded-lg shadow-[0_0_30px_rgba(0,240,255,0.1)] z-50 overflow-hidden"
          >
            <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-400/10 to-pink-400/10 border-b border-cyan-400/20">
              <h3 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
                NOTIFICAÇÕES
              </h3>
              {notificationCount > 0 && (
                <button
                  className="text-xs text-cyan-300 hover:text-lime-300 transition-colors"
                  onClick={markAllAsRead}
                >
                  MARCAR TODAS COMO LIDAS
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto divide-y divide-stone-800">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-stone-400 text-sm">
                  Nenhuma notificação no momento
                </div>
              ) : (
                notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`p-3 hover:bg-stone-800/60 cursor-pointer transition-colors ${
                      notification.read ? 'opacity-70' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        <span className="text-sm">{getNotificationIcon(notification.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className={`text-sm font-bold truncate ${
                            notification.read ? 'text-stone-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          <span className="text-xs text-cyan-400/70 whitespace-nowrap ml-2">
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-xs mt-1 truncate ${
                          notification.read ? 'text-stone-400' : 'text-stone-200'
                        }`}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-pink-400 rounded-full mt-3 flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 text-center border-t border-stone-800 bg-stone-900/50">
                <button 
                  className="text-xs text-cyan-300 hover:text-pink-300 transition-colors"
                  onClick={() => setNotifications([])}
                >
                  LIMPAR TODAS
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}