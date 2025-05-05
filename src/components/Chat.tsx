'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext'; // Importe o hook useAuth
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Use o hook useAuth para acessar o estado do usuário
  const { user, loading } = useAuth();

  useEffect(() => {
    // Configuração do chat (código existente)
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

    // Envia mensagem para o servidor (simulado)
    const newMessage: Message = {
      id: Date.now(),
      sender: 'fan',
      text: `${user.name.split(' ')[0]}: ${input.trim()}`,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Rola para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full max-w-7xl mx-auto gap-4 h-[85vh] bg-stone-950">
      {/* Coluna Esquerda - Vídeo e Partidas */}
      <div className="w-full lg:w-[60%] flex flex-col gap-4">
        {/* Player de Vídeo */}
        <div className="border border-cyan-400/50 rounded-lg bg-gradient-to-br from-cyan-400/10 to-purple-500/10 shadow-[0_0_20px_-5px_rgba(0,240,255,0.3)]">
          <VideoPlayer />
          <div className="absolute inset-0 rounded-lg pointer-events-none border border-cyan-400/20 shadow-[inset_0_0_30px_rgba(0,240,255,0.1)]" />
        </div>

        {/* Painel de Partidas */}
        <LiveMatchesPanel />
      </div>

      {/* Coluna Direita - Chat */}
      <div className="w-full lg:w-[40%] flex flex-col h-full rounded-lg border border-purple-400/50 bg-gradient-to-b from-purple-500/10 to-cyan-400/10 shadow-[0_0_20px_-5px_rgba(156,39,255,0.3)] p-1">
        <div className="flex flex-col h-full rounded-lg bg-stone-900/80 backdrop-blur-sm border border-stone-800/50">
          {/* Cabeçalho do Chat */}
          <div className="flex items-center justify-between rounded-lg p-4 border-b border-stone-800 bg-gradient-to-r from-purple-500/20 to-cyan-400/20">
            <div className="flex items-center gap-3">
              <FuriaLogo className="h-7 text-pink-400" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
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

          {/* Área de Mensagens */}
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

          {/* Rodapé do Chat - Atualizado para mostrar inputs quando logado */}
          <div className="p-4 border-t border-stone-800 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        {loading ? (
          <div className="h-12 flex items-center justify-center">
            <div className="animate-pulse text-cyan-300">Carregando...</div>
          </div>
        ) : user ? (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <EmojiReactions onReaction={handleReactionSent} />
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 p-2 rounded bg-stone-800 text-stone-100 border border-stone-700 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 transition-all"
                placeholder="Digite sua mensagem..."
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-400 to-lime-400 text-stone-900 font-bold rounded hover:shadow-[0_0_10px_rgba(0,240,255,0.3)] transition-all"
              >
                Enviar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => router.push('/login')}
              className="relative px-6 py-2 font-bold rounded-md bg-gradient-to-r from-lime-400 to-cyan-400 text-stone-900 hover:shadow-[0_0_15px_rgba(204,255,0,0.5)] transition-all"
            >
              <span className="relative z-10">FAZER LOGIN</span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-lime-400/80 to-cyan-400/80 blur-[6px] -z-0" />
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
  );
}

export default Chat;