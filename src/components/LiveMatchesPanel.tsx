import { useState, useEffect } from 'react';
import { LiveMatch } from './LiveMatch';
import { matchService, Match } from '../services/matchService';

export function LiveMatchesPanel() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const initialMatches = await matchService.getMatches();
        setMatches(initialMatches);
        setLoading(false);
      }catch (error) {
        if (error instanceof Error) {
          console.error("Error:", error.message);
        } else {
          console.error("Error:", error);
        }
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
      <div className="bg-stone-800 rounded-lg p-4 text-center border border-amber-400/20">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-stone-700 rounded w-3/4 mx-auto"></div>
          <div className="h-20 bg-stone-700/50 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-stone-800 rounded-lg p-4 text-center text-amber-400 border border-amber-400/20">
        {error}
      </div>
    );
  }

  const liveMatches = matches.filter(match => match.status === 'live');
  const upcomingMatches = matches.filter(match => match.status === 'upcoming');
  const finishedMatches = matches.filter(match => match.status === 'finished');

  return (
    <div className="bg-stone-800 rounded-lg overflow-hidden border border-amber-400/30 shadow-lg">
      {/* Cabeçalho */}
      <div className="p-4 bg-gradient-to-r from-stone-750 to-stone-800 border-b border-amber-400/20">
        <h3 className="font-title text-lg text-amber-400 flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400"></span>
          </span>
          PARTIDAS AO VIVO
        </h3>
      </div>

      {/* Conteúdo */}
      <div className="p-4 space-y-4">
        {/* Partidas ao vivo */}
        {liveMatches.length === 0 ? (
          <div className="text-center text-stone-400 py-4 bg-stone-800/50 rounded-lg border border-dashed border-amber-400/20">
            Nenhuma partida ao vivo no momento
          </div>
        ) : (
          liveMatches.map((match) => (
            <LiveMatch
              key={match.matchId}
              {...match}
            />
          ))
        )}

        {/* Próximas partidas */}
        {upcomingMatches.length > 0 && (
          <div className="mt-6">
            <div className="font-title text-sm text-amber-400 mb-3 pb-2 border-b border-amber-400/20">
              PRÓXIMAS PARTIDAS
            </div>
            <div className="space-y-3">
              {upcomingMatches.map((match) => (
                <LiveMatch
                  key={match.matchId}
                  {...match}
                />
              ))}
            </div>
          </div>
        )}

        {/* Partidas finalizadas */}
        {finishedMatches.length > 0 && (
          <div className="mt-6">
            <div className="font-title text-sm text-stone-400 mb-3 pb-2 border-b border-stone-600">
              HISTÓRICO
            </div>
            <div className="space-y-3">
              {finishedMatches.map((match) => (
                <LiveMatch
                  key={match.matchId}
                  {...match}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}