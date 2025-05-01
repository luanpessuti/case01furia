import { useState, useEffect } from 'react';

interface Emoji {
  id: string;
  symbol: string;
  name: string;
  count: number;
}

interface EmojiReactionsProps {
  onReactionSent?: (emoji: string) => void;
}

export function EmojiReactions({ onReactionSent }: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<Emoji[]>([]);
  
  // Emojis pré-definidos com tema FURIA
  const popularEmojis: Emoji[] = [
    { id: 'tiger', symbol: '🐯', name: 'Tigre', count: 242 },
    { id: 'fire', symbol: '🔥', name: 'Fogo', count: 215 },
    { id: 'trophy', symbol: '🏆', name: 'Troféu', count: 189 },
    { id: 'clap', symbol: '👏', name: 'Aplausos', count: 132 },
    { id: 'heart', symbol: '❤️', name: 'Coração', count: 98 },
    { id: 'rocket', symbol: '🚀', name: 'Foguete', count: 76 },
    { id: 'boom', symbol: '💥', name: 'Explosão', count: 63 },
    { id: 'eyes', symbol: '👀', name: 'Olhos', count: 54 },
    { id: 'muscle', symbol: '💪', name: 'Força', count: 42 },
    { id: 'tada', symbol: '🎉', name: 'Festa', count: 37 },
    { id: 'star', symbol: '⭐', name: 'Estrela', count: 29 },
  ];
  
  // Animação de emojis aleatórios
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const randomIndex = Math.floor(Math.random() * popularEmojis.length);
        createFloatingEmoji(popularEmojis[randomIndex].symbol);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Cria animação de emoji flutuante
  const createFloatingEmoji = (emoji: string) => {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;
    emojiElement.className = 'emoji-float text-2xl';
    emojiElement.style.left = `${Math.random() * 80 + 10}%`;
    
    const container = document.getElementById('emoji-container');
    container?.appendChild(emojiElement);
    
    setTimeout(() => {
      container?.removeChild(emojiElement);
    }, 2000);
  };
  
  // Envia reação
  const sendReaction = (emoji: Emoji) => {
    createFloatingEmoji(emoji.symbol);
    
    // Atualiza emojis recentes
    setRecentEmojis(prev => {
      const exists = prev.find(e => e.id === emoji.id);
      return exists ? prev : [emoji, ...prev].slice(0, 5);
    });
    
    setShowPicker(false);
    onReactionSent?.(emoji.symbol);
  };
  
  return (
    <div className="relative">
      {/* Botão principal */}
      <button
        className="bg-stone-700 hover:bg-stone-600 text-amber-400 py-1 px-3 rounded-full flex items-center gap-1 text-sm transition-colors border border-amber-400/30"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span>🔥</span>
        <span>Reagir</span>
      </button>
      
      {/* Picker de emojis */}
        {showPicker && (
          <div className="absolute bottom-12 left-1/10 transform -translate-x-1/2 bg-stone-800 border border-amber-400/20 rounded-lg shadow-xl p-3 w-72 z-20">
            {/* Seção de recentes */}
            {recentEmojis.length > 0 && (
          <>
            <div className="text-xs text-amber-400 mb-2 font-title">Usados recentemente</div>
            <div className="flex flex-wrap gap-1 mb-3">
              {recentEmojis.map(emoji => (
            <button
              key={`recent-${emoji.id}`}
              className="w-9 h-9 text-xl hover:bg-stone-700 rounded-full flex items-center justify-center transition-colors"
              title={emoji.name}
              onClick={() => sendReaction(emoji)}
            >
              {emoji.symbol}
            </button>
              ))}
            </div>
            <div className="border-t border-stone-700/50 mb-3"></div>
          </>
            )}
            
            {/* Seção de populares */}
          <div className="text-xs text-amber-400 mb-2 font-title">Reações populares</div>
          <div className="flex flex-wrap gap-1">
            {popularEmojis.map(emoji => (
              <button
                key={emoji.id}
                className="w-9 h-9 text-xl hover:bg-stone-700 rounded-full flex items-center justify-center relative transition-colors group"
                title={`${emoji.name} (${emoji.count})`}
                onClick={() => sendReaction(emoji)}
              >
                {emoji.symbol}
                <span className="absolute -bottom-1 -right-1 text-xs bg-amber-400 text-stone-900 rounded-full h-5 w-5 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {emoji.count > 999 ? '999+' : emoji.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Container para animações */}
      <div 
        id="emoji-container" 
        className="absolute bottom-full left-0 w-full h-64 pointer-events-none overflow-hidden"
      />
      
      {/* Estilos de animação */}
      <style jsx global>{`
        .emoji-float {
          position: absolute;
          bottom: 0;
          animation: float 2s ease-out forwards;
          opacity: 1;
          pointer-events: none;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
            transform: translateY(-20px) scale(1.2);
          }
          100% {
            transform: translateY(-120px) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}