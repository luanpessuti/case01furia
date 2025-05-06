import { useState, useEffect } from 'react';

interface Emoji {
  id: string;
  symbol: string;
  name: string;
  count: number;
}

interface EmojiReactionsProps {
  onReaction: (emoji: string) => void;
}

export function EmojiReactions({ onReaction }: EmojiReactionsProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<Emoji[]>([]);

  // Emojis pré-definidos com tema FURIA (agora mais temáticos)
  const popularEmojis: Emoji[] = [
    { id: 'furia', symbol: '🐯', name: 'Tigre FURIA', count: 420 },
    { id: 'fire', symbol: '🔥', name: 'Fogo Neon', count: 369 },
    { id: 'cyber', symbol: '👾', name: 'Cyberpunk', count: 255 },
    { id: 'clap', symbol: '👏', name: 'Aplausos Digitais', count: 198 },
    { id: 'heart', symbol: '💜', name: 'Coração Cyber', count: 156 },
    { id: 'rocket', symbol: '🚀', name: 'Foguete', count: 123 },
    { id: 'boom', symbol: '💥', name: 'Explosão', count: 111 },
    { id: 'hacker', symbol: '👨‍💻', name: 'Hacker', count: 98 },
    { id: 'muscle', symbol: '💪', name: 'Força', count: 87 },
    { id: 'tada', symbol: '🎉', name: 'Festa Neon', count: 76 },
    { id: 'star', symbol: '🌟', name: 'Estrela', count: 65 },
    { id: 'skull', symbol: '💀', name: 'Skull', count: 54 },
  ];

  // Animação de emojis aleatórios com estilo neon
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.5) {
        const randomIndex = Math.floor(Math.random() * popularEmojis.length);
        createFloatingEmoji(popularEmojis[randomIndex].symbol);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Cria animação de emoji flutuante com efeito neon
  const createFloatingEmoji = (emoji: string) => {
    const emojiElement = document.createElement('div');
    emojiElement.textContent = emoji;
    emojiElement.className = 'emoji-float text-xl';

    // Posição horizontal mais controlada (0% a 100% dentro da área segura)
    emojiElement.style.left = `${Math.random() * 100}%`;

    // Efeito neon
    emojiElement.style.textShadow = `0 0 10px rgba(34, 211, 238, 0.8)`;

    const container = document.getElementById('emoji-container');
    container?.appendChild(emojiElement);

    setTimeout(() => {
      container?.removeChild(emojiElement);
    }, 2000);
  };

  const sendReaction = (emoji: Emoji) => {
    createFloatingEmoji(emoji.symbol);

    setRecentEmojis(prev => {
      const exists = prev.find(e => e.id === emoji.id);
      return exists ? prev : [emoji, ...prev].slice(0, 5);
    });

    setShowPicker(false);
    onReaction?.(emoji.symbol);
  };

  return (
    <div className="relative">
      {/* Botão principal compacto */}
      <button
        className="px-3 py-1.5 text-sm bg-gradient-to-r from-purple-500 to-pink-400 rounded hover:shadow-[0_0_8px_rgba(0,240,255,0.3)] transition-all"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span className="bg-clip-text text-base text-transparent bg-cyan-400">
          💜
        </span>
      </button>

      {/* Picker de emojis - estilo dark/neon */}
      {showPicker && (
        <div className="absolute bottom-12 left-0 transform bg-stone-900 border border-cyan-400/20 rounded-lg shadow-[0_0_20px_rgba(34,211,238,0.2)] p-3 w-80 z-20 backdrop-blur-md">
          {/* Seção de recentes */}
          {recentEmojis.length > 0 && (
            <>
              <div className="text-xs text-purple-400 mb-2 font-mono tracking-wider">
                RECENTES
              </div>
              <div className="flex flex-wrap gap-1 mb-3">
                {recentEmojis.map(emoji => (
                  <button
                    key={`recent-${emoji.id}`}
                    className="w-10 h-10 text-xl hover:bg-stone-800 rounded-md flex items-center justify-center transition-all border border-transparent hover:border-cyan-400/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                    title={emoji.name}
                    onClick={() => sendReaction(emoji)}
                  >
                    {emoji.symbol}
                  </button>
                ))}
              </div>
              <div className="border-t border-stone-800 mb-3"></div>
            </>
          )}

          {/* Seção de populares */}
          <div className="text-xs text-purple-400 mb-2 font-mono tracking-wider">
            POPULARES
          </div>
          <div className="flex flex-wrap gap-1">
            {popularEmojis.map(emoji => (
              <button
                key={emoji.id}
                className="w-10 h-10 text-xl hover:bg-stone-800 rounded-md flex items-center justify-center relative transition-all group border border-transparent hover:border-cyan-400/30 hover:shadow-[0_0_10px_rgba(34,211,238,0.1)]"
                title={`${emoji.name} (${emoji.count})`}
                onClick={() => sendReaction(emoji)}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {emoji.symbol}
                </span>
                <span className="absolute -bottom-1 -right-1 text-xs bg-gradient-to-br from-cyan-400 to-purple-500 text-stone-900 rounded-full h-5 w-5 flex items-center justify-center font-bold opacity-0 group-hover:opacity-100 transition-opacity border border-white/20">
                  {emoji.count > 999 ? '∞' : emoji.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Container para animações */}
      <div
        id="emoji-container"
        className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-[300%] h-48 pointer-events-none overflow-hidden"
        style={{ marginLeft: '-100%' }}
      />

      {/* Estilos de animação atualizados */}
      <style jsx global>{`
  .emoji-float {
    position: absolute;
    bottom: 0;
    animation: float 1.8s ease-out forwards;
    opacity: 1;
    pointer-events: none;
    filter: drop-shadow(0 0 8px rgba(34,211,238,0.9));
    z-index: 10;
    transform: translateX(-50%); /* Centraliza o emoji na posição left */
  }
  
  @keyframes float {
    0% { 
      transform: translateY(0) translateX(-50%) scale(0.5); 
      opacity: 0; 
    }
    20% { 
      opacity: 1; 
      transform: translateY(-15px) translateX(-50%) scale(1.1); 
    }
    100% { 
      transform: translateY(-120px) translateX(-50%) scale(1.3); 
      opacity: 0; 
    }
  }
`}</style>
    </div>
  );
}