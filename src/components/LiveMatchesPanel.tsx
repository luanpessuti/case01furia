import { useState, useEffect } from 'react';
import { LiveMatch } from './LiveMatch';
import { matchService, Match } from '../services/matchService';

export function LiveMatchesPanel() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const initialMatches = await matchService.getMatches();
        setMatches(initialMatches);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error instanceof Error ? error.message : error);
        setLoading(false);
      }
    };

    fetchMatches();

    const unsubscribe = matchService.subscribeToLiveUpdates((updatedMatches) => {
      setMatches(updatedMatches);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="rounded-lg p-4 text-center border border-pink-400/30 bg-gradient-to-br from-purple-500/10 to-stone-900/50">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gradient-to-r from-pink-400/20 to-cyan-400/20 rounded w-3/4 mx-auto"></div>
          <div className="h-20 bg-gradient-to-br from-stone-800/50 to-stone-900/30 rounded border border-stone-700/50"></div>
        </div>
      </div>
    );
  }

  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const finishedMatches = matches.filter(match => match.status === 'finished');

  return (
    <div className="flex-1 rounded-lg overflow-y-auto border border-pink-400/50 bg-gradient-to-br from-stone-900/80 to-stone-950/90 backdrop-blur-sm shadow-[0_0_20px_-5px_rgba(156,39,255,0.2)]">
      {/* Cabeçalho com efeito neon */}
      <div className="p-4 bg-gradient-to-r from-purple-500/15 to-cyan-400/15 border-b border-cyan-400/20 relative">
        <div className="absolute inset-0 bg-black opacity-5" />
        <h3 className="font-title text-lg font-bold flex items-center gap-2 relative">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-400 shadow-[0_0_6px_#ff4ecd]"></span>
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-cyan-400">
            PARTIDAS AO VIVO
          </span>
        </h3>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        {/* Partidas ao vivo */}
        {liveMatches.length === 0 ? (
          <div className="text-center text-stone-300 py-6 rounded-lg border-2 border-dashed border-cyan-400/20 bg-gradient-to-br from-stone-900/50 to-stone-800/30">
            <div className="text-cyan-300/70 mb-2">⚡</div>
            <p className="text-sm font-medium">Nenhuma partida ao vivo</p>
            <p className="text-xs text-stone-400 mt-1">Verifique as próximas partidas abaixo</p>
          </div>
        ) : (
          liveMatches.map((match) => (
            <LiveMatch key={match.matchId} {...match} />
          ))
        )}

        {/* Próximas partidas */}
        {upcomingMatches.length > 0 && (
          <div className="mt-6">
            <div className="font-title text-sm font-medium mb-3 pb-2 border-b border-cyan-400/20 flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-lime-400">
                PRÓXIMAS PARTIDAS
              </span>
              <span className="ml-auto text-xs text-cyan-300/50 bg-cyan-400/10 px-2 py-1 rounded">
                {upcomingMatches.length}
              </span>
            </div>
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <LiveMatch key={match.matchId} {...match} />
              ))}
            </div>
          </div>
        )}

        {/* Partidas finalizadas */}
        {finishedMatches.length > 0 && (
          <div className="mt-6">
            <div className="font-title text-sm font-medium mb-3 pb-2 border-b border-purple-400/20 flex items-center">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                HISTÓRICO
              </span>
              <span className="ml-auto text-xs text-purple-300/50 bg-purple-400/10 px-2 py-1 rounded">
                {finishedMatches.length}
              </span>
            </div>
            <div className="space-y-3">
              {finishedMatches.map((match) => (
                <LiveMatch key={match.matchId} {...match} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}