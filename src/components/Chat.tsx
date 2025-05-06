// Chat.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { MessageBubble } from './MessageBubble';
import { FuriaLogo } from './FuriaLogo';
import { LiveMatchesPanel } from './LiveMatchesPanel';
import { NotificationSystem, Notification } from './NotificationSystem';
import { EmojiReactions } from './EmojiReactions';
import { VideoPlayer } from './VideoPlayer';

type SenderType = 'fan' | 'system';
interface Message {
  id: number;
  sender: SenderType;
  text: string;
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      sender: 'system',
      text: '📺 Bem-vindo(a) ao chat da LIVE! Interaja com outros fãs da FURIA.',
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [fanCount, setFanCount] = useState(1253);
  const [isPanelVisible, setIsPanelVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    const fanMessages = [
      'Vamos FURIA!!!',
      'Hoje é dia de vitória!',
      'KSCERATO tá jogando muito hoje',
      'O FalleN é lenda, quero ver AWP',
      'Alguém vai assistir no Encontro de Fãs?'
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomMessage = fanMessages[Math.floor(Math.random() * fanMessages.length)];
        const randomName = `Fã #${Math.floor(Math.random() * 9000) + 1000}`;

        const fanMessage: Message = {
          id: Date.now(),
          sender: 'system',
          text: `${randomName}: ${randomMessage}`,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, fanMessage]);
      }

      setFanCount(prev => prev + Math.floor(Math.random() * 5) - 2);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Detectar tamanho da tela para mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    // Verificar na montagem inicial
    checkIfMobile();
    
    // Adicionar listener para quando a tela for redimensionada
    window.addEventListener('resize', checkIfMobile);
    
    // Limpar listener quando componente for desmontado
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        sender: 'system',
        text: `Notificação: ${notification.message}`,
        timestamp: new Date(),
      }
    ]);
  };

  const handleReactionSent = (emoji: string) => {
    if (!user) return;

    const reactionMessage: Message = {
      id: Date.now(),
      sender: 'fan',
      text: `${user.name.split(' ')[0]}: ${emoji}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, reactionMessage]);
  };

  const handleSend = async () => {
    if (input.trim() === '' || !user) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'fan',
      text: `${user.name.split(' ')[0]}: ${input.trim()}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const togglePanel = () => {
    setIsPanelVisible(!isPanelVisible);
  };

  return (
    <div className="flex flex-col w-full max-w-screen-lg mx-auto pt-10 sm:pt-6 lg:pt-8 gap-4 px-4 pb-4">
      {/* Layout para dispositivos móveis */}
      {isMobile ? (
        <div className="flex flex-col gap-4">
          {/* Vídeo */}
          <div className="relative border border-cyan-400/50 rounded-lg bg-gradient-to-br from-cyan-400/10 to-purple-500/10 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)]">
            <VideoPlayer />
            <div className="absolute inset-0 rounded-lg pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_30px_rgba(0,240,255,0.1)]" />
          </div>
          
          {/* Botão para exibir/ocultar o painel de partidas */}
          <button 
            onClick={togglePanel}
            className="w-full py-2 text-sm z-50 font-title bg-gradient-to-r from-cyan-400 to-lime-400 text-stone-900 font-bold rounded hover:shadow-[0_0_8px_rgba(0,240,255,0.3)] transition-all"
          >
            {isPanelVisible ? 'OCULTAR' : 'PAINEL DE PARTIDAS'}
          </button>
          
          {/* Painel de Partidas Colapsável */}
          {isPanelVisible && (
            <div className="max-h-60 overflow-y-auto">
              <LiveMatchesPanel />
            </div>
          )}
          
          {/* Chat */}
          <div className="w-full flex flex-col h-[60vh] rounded-lg border border-purple-400/50 bg-gradient-to-b from-purple-500/10 to-cyan-400/10 shadow-[0_0_20px_-5px_rgba(156,39,255,0.3)]">
            <div className="flex flex-col h-full rounded-lg bg-stone-900/80 backdrop-blur-sm border border-purple-400/50 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)]">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between rounded-t-lg p-4 border-b border-stone-800 bg-gradient-to-r from-purple-500/20 to-cyan-400/20">
                <div className="flex items-center gap-3">
                  <FuriaLogo className="h-7 text-pink-400" />
                  <h2 className="text-lg font-title font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
                    CHAT DA LIVE
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-sm font-medium text-cyan-300">
                    <span className="inline-block w-2 h-2 bg-lime-400 rounded-full mr-2 animate-pulse" />
                    {fanCount.toLocaleString()} online
                  </div>
                  <NotificationSystem onNotificationClick={handleNotificationClick} />
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    sender={msg.sender}
                    text={msg.text}
                    timestamp={msg.timestamp}
                    isCurrentUser={!!(user && msg.sender === 'fan' && msg.text.startsWith(user.name.split(' ')[0]))}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Rodapé do Chat */}
              <div className="p-3 border-t border-stone-800 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                {loading ? (
                  <div className="h-10 flex items-center justify-center">
                    <div className="animate-pulse text-cyan-300 text-sm">Carregando...</div>
                  </div>
                ) : user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                      <EmojiReactions onReaction={handleReactionSent} />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 p-1.5 text-sm rounded bg-stone-800 text-stone-100 border border-stone-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                          placeholder="Digite sua mensagem..."
                        />
                        <button
                          onClick={handleSend}
                          disabled={!input.trim()}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-cyan-400 to-lime-400 text-stone-900 font-bold rounded hover:shadow-[0_0_8px_rgba(0,240,255,0.3)] transition-all"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => router.push('/login')}
                      className="relative px-4 py-1.5 text-sm font-bold rounded-md bg-gradient-to-r from-lime-400 to-cyan-400 text-stone-900 hover:shadow-[0_0_10px_rgba(204,255,0,0.5)] transition-all"
                    >
                      <span className="relative z-10">FAZER LOGIN</span>
                      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-lime-400/80 to-cyan-400/80 blur-[4px] -z-0" />
                    </button>
                    <p className="text-xs text-pink-400 text-center">
                      Faça login para participar do chat ao vivo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Layout para desktop - mantém o original */
        <div className="flex flex-row w-full gap-4 h-[85vh]">
          {/* Coluna Esquerda */}
          <div className="w-[60%] flex flex-col gap-4">
            <div className="relative border border-cyan-400/50 rounded-lg bg-gradient-to-br from-cyan-400/10 to-purple-500/10 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)]">
              <VideoPlayer />
              <div className="absolute inset-0 rounded-lg pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_30px_rgba(0,240,255,0.1)]" />
            </div>
            <LiveMatchesPanel />
          </div>

          {/* Coluna Direita */}
          <div className="w-[40%] flex flex-col h-full rounded-lg border border-purple-400/50 bg-gradient-to-b from-purple-500/10 to-cyan-400/10 shadow-[0_0_20px_-5px_rgba(156,39,255,0.3)]">
            <div className="flex flex-col h-full rounded-lg bg-stone-900/80 backdrop-blur-sm border border-purple-400/50 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)]">
              {/* Cabeçalho */}
              <div className="flex items-center justify-between rounded-t-lg p-4 border-b border-stone-800 bg-gradient-to-r from-purple-500/20 to-cyan-400/20">
                <div className="flex items-center gap-3">
                  <FuriaLogo className="h-7 text-pink-400" />
                  <h2 className="font-title text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
                    CHAT DA LIVE
                  </h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center text-sm font-medium text-cyan-300">
                    <span className="inline-block w-2 h-2 bg-lime-400 rounded-full mr-2 animate-pulse" />
                    {fanCount.toLocaleString()} online
                  </div>
                  <NotificationSystem onNotificationClick={handleNotificationClick} />
                </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    sender={msg.sender}
                    text={msg.text}
                    timestamp={msg.timestamp}
                    isCurrentUser={!!(user && msg.sender === 'fan' && msg.text.startsWith(user.name.split(' ')[0]))}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Rodapé do Chat */}
              <div className="p-3 border-t border-stone-800 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                {loading ? (
                  <div className="h-10 flex items-center justify-center">
                    <div className="animate-pulse text-cyan-300 text-sm">Carregando...</div>
                  </div>
                ) : user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row gap-2 items-stretch">
                      <EmojiReactions onReaction={handleReactionSent} />
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 p-1.5 text-sm rounded bg-stone-800 text-stone-100 border border-stone-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                          placeholder="Digite sua mensagem..."
                        />
                        <button
                          onClick={handleSend}
                          disabled={!input.trim()}
                          className="px-3 py-1.5 text-sm bg-gradient-to-r from-cyan-400 to-lime-400 text-stone-900 font-bold rounded hover:shadow-[0_0_8px_rgba(0,240,255,0.3)] transition-all"
                        >
                          Enviar
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={() => router.push('/login')}
                      className="relative px-4 py-1.5 text-sm font-bold rounded-md bg-gradient-to-r from-lime-400 to-cyan-400 text-stone-900 hover:shadow-[0_0_10px_rgba(204,255,0,0.5)] transition-all"
                    >
                      <span className="relative z-10">FAZER LOGIN</span>
                      <span className="absolute inset-0 rounded-md bg-gradient-to-r from-lime-400/80 to-cyan-400/80 blur-[4px] -z-0" />
                    </button>
                    <p className="text-xs text-pink-400 text-center">
                      Faça login para participar do chat ao vivo
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;