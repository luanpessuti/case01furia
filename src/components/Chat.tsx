'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { FuriaLogo } from './FuriaLogo';
import { LiveMatchesPanel } from './LiveMatchesPanel';
import { NotificationSystem, Notification } from './NotificationSystem';
import { EmojiReactions } from './EmojiReactions';
import { VideoPlayer } from './VideoPlayer';

interface Message {
  id: number;
  sender: 'fan' | 'bot' | 'system';
  text: string | React.ReactNode;
  timestamp?: Date;
}

export function Chat() {
  const [currentMode, setCurrentMode] = useState<'chatbot' | 'live'>('chatbot');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 1, 
      sender: 'bot', 
      text: <>Olá, Fera! Bem-vindo(a) ao chat da FURIA 🐾</>, 
      timestamp: new Date() 
    },
    { 
      id: 2, 
      sender: 'bot', 
      text: <>Escolha uma das opções abaixo.</>, 
      timestamp: new Date() 
    }
  ]);
  
  const [input, setInput] = useState('');
  const [showLiveMatches, setShowLiveMatches] = useState(false);
  const [fanCount, setFanCount] = useState(1253);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (currentMode !== 'live') return;
    
    const reactionMessage: Message = {
      id: Date.now(),
      sender: 'fan',
      text: emoji,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, reactionMessage]);
  };

  useEffect(() => {
    if (currentMode !== 'live') return;
    
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
  }, [currentMode]);

  const handleSend = () => {
    if (input.trim() === '' || currentMode !== 'live') return;
  
    const newMessage: Message = {
      id: Date.now(),
      sender: 'fan',
      text: input.trim(),
      timestamp: new Date(),
    };
  
    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  const handleOpenLive = () => {
    setCurrentMode('live');
    setMessages([
      { 
        id: Date.now(), 
        sender: 'system', 
        text: '📺 Bem-vindo(a) ao chat da LIVE! Interaja com outros fãs da FURIA.', 
        timestamp: new Date() 
      }
    ]);
  };

  const handleOpenLiveMatches = () => {
    setShowLiveMatches(true);
  };

  const handleCloseLiveMatches = () => {
    setShowLiveMatches(false);
  };

  const handleOpenStore = () => {
    window.open('https://www.furia.gg/collections', '_blank');
  };

  if (currentMode === 'live') {
    return (
      <div className="flex flex-col lg:flex-row w-full max-w-6xl mx-auto gap-4 h-[85vh] font-sans">
        {/* Coluna Esquerda */}
        <div className="w-full lg:w-[60%] flex flex-col gap-4">
          {/* Vídeo */}
          <div className="border-2 border-amber-400 rounded-lg bg-stone-900 overflow-hidden h-[50%]">
            <VideoPlayer />
          </div>
          
          {/* Painel Fixo */}
          <div className="flex-1 border-2 border-amber-400 rounded-lg bg-stone-800 shadow-lg overflow-y-auto">
            <div>
            </div>
            <LiveMatchesPanel />
          </div>
        </div>
        
        {/* Chat */}
        <div className="w-full lg:w-[40%] flex flex-col h-full border-2 border-amber-400 rounded-lg bg-stone-800">
          <div className="flex items-center justify-between p-4 border-b  rounded-lg border-amber-400/30 bg-stone-700">
            <div className="flex items-center gap-2">
              <FuriaLogo className="h-8 text-amber-400" />
              <h2 className="text-xl text-white font-title">Chat da LIVE</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-amber-400">
                <span className="inline-block w-2 h-2 bg-lime-400 rounded-full mr-1"></span>
                {fanCount} fãs online
              </div>
              <NotificationSystem onNotificationClick={handleNotificationClick} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-900/50">
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.id} 
                sender={msg.sender} 
                text={msg.text} 
                timestamp={msg.timestamp}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-amber-400/30 rounded-lg bg-stone-700">
            <div className="flex justify-end mb-3">
              <EmojiReactions onReactionSent={handleReactionSent} />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 border border-stone-600 rounded-lg px-4 py-2 bg-stone-800 text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                placeholder="Digite uma mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                className="bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-2 rounded-lg font-bold transition-colors"
                onClick={handleSend}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col lg:flex-row gap-4 w-full max-w-6xl mx-auto font-sans">
      {/* Chat principal */}
      <div className={`flex flex-col h-[80vh] border-2 border-amber-400 rounded-lg bg-stone-800 shadow-lg ${showLiveMatches ? 'w-full lg:w-1/2' : 'w-full'}`}>
        <div className="flex items-center justify-between p-4 border-b rounded-lg border-amber-400/30 bg-stone-700">
          <div className="flex items-center gap-2">
            <FuriaLogo className="h-8 text-amber-400" />
            <h2 className="text-xl text-white font-title">Fur.IA</h2>
          </div>
          <div className="text-sm text-amber-400">
            <span className="inline-block w-2 h-2 bg-lime-400 rounded-full mr-1"></span>
            {fanCount} fãs online
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-900/50">
          {messages.map((msg) => (
            <MessageBubble 
              key={msg.id} 
              sender={msg.sender} 
              text={msg.text} 
              timestamp={msg.timestamp}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="grid grid-cols-1 gap-3 p-4 rounded-lg bg-stone-700">
          <button
            onClick={handleOpenLive}
            className="w-full bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            LIVE
          </button>
          <button
            onClick={handleOpenLiveMatches}
            className="w-full bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            PAINEL DE JOGOS
          </button>
          <button
            onClick={handleOpenStore}
            className="w-full bg-amber-400 hover:bg-amber-500 text-stone-900 px-4 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-2 transition-colors"
          >
            LOJA OFICIAL
          </button>
        </div>
      </div>

      {/* Painel de partidas */}
      {showLiveMatches && (
        <div className="w-full lg:w-1/2 h-[80vh] border-2 border-amber-400 rounded-lg bg-stone-800 overflow-y-auto">
          <div className="relative h-full">
            <button 
              onClick={handleCloseLiveMatches}
              className="absolute top-2 right-2 bg-amber-400 hover:bg-amber-500 text-stone-900 rounded-full w-6 h-6 flex items-center justify-center transition-colors"
            >
              ✕
            </button>
            <LiveMatchesPanel />
          </div>
        </div>
      )}
    </div>
  );
}

export default Chat;