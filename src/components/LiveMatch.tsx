interface Team {
  name: string;
  logo: string; // Agora esperamos uma URL para a logo
  score: number;
}

interface LiveMatchProps {
  matchId: string;
  teams: {
    team1: Team;
    team2: Team;
  };
  map: string;
  status: 'upcoming' | 'live' | 'finished';
  currentRound?: number;
  totalRounds?: number;
  timeRemaining?: string;
  lastEvents?: Array<{
    id: number;
    text: string;
    timestamp: string;
  }>;
}

export function LiveMatch({
  matchId,
  teams,
  map,
  status,
  currentRound,
  totalRounds,
  timeRemaining,
  lastEvents
}: LiveMatchProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'upcoming':
        return 'bg-amber-400/80 text-stone-900';
      case 'live':
        return 'bg-red-500 text-white animate-pulse';
      case 'finished':
        return 'bg-stone-600 text-white';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'upcoming':
        return 'EM BREVE';
      case 'live':
        return 'AO VIVO';
      case 'finished':
        return 'FINALIZADO';
    }
  };

  return (
    <div className="bg-stone-800 rounded-lg overflow-hidden border border-amber-400/30 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-stone-750 to-stone-800 border-b border-amber-400/20">
        <div className="text-xs font-title text-amber-400">PARTIDA #{matchId}</div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor()}`}>
          {getStatusText()}
        </div>
      </div>

      {/* Placar */}
      <div className="p-4 bg-stone-800/50">
        {/* Time 1 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {teams.team1.logo ? (
              <img 
                src={teams.team1.logo} 
                alt={teams.team1.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-team-logo.png';
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center border border-amber-400/20">
                <span className="text-xs">{teams.team1.name.charAt(0)}</span>
              </div>
            )}
            <span className="font-title text-white">{teams.team1.name}</span>
          </div>
          <span className="text-2xl font-bold text-amber-400">{teams.team1.score}</span>
        </div>

        {/* Time 2 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {teams.team2.logo ? (
              <img 
                src={teams.team2.logo} 
                alt={teams.team2.name}
                className="w-10 h-10 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-team-logo.png';
                }}
              />
            ) : (
              <div className="w-10 h-10 bg-stone-700 rounded-full flex items-center justify-center border border-amber-400/20">
                <span className="text-xs">{teams.team2.name.charAt(0)}</span>
              </div>
            )}
            <span className="font-title text-white">{teams.team2.name}</span>
          </div>
          <span className="text-2xl font-bold text-white">{teams.team2.score}</span>
        </div>

      {/* Detalhes da partida */}
      <div className="p-3 bg-stone-750 flex items-center justify-between text-sm border-t border-amber-400/10">
        <div className="text-amber-400 font-title">
          <span className="text-white">{map}</span>
        </div>
        {status === 'live' && (
          <div className="text-stone-400">
            Round: <span className="text-amber-400 font-bold">{currentRound}/{totalRounds}</span>
          </div>
        )}
        {status === 'live' && timeRemaining && (
          <div className="text-amber-400 font-mono bg-stone-700 px-2 py-1 rounded">
            {timeRemaining}
          </div>
        )}
      </div>

      {/* Últimos eventos */}
      {lastEvents && lastEvents.length > 0 && (
        <div className="max-h-40 overflow-y-auto border-t border-amber-400/10">
          <div className="p-3 bg-stone-750 text-xs font-title text-amber-400">
            ÚLTIMOS LANCES
          </div>
          <ul className="divide-y divide-stone-700/50">
            {lastEvents.map((event) => (
              <li key={event.id} className="p-3 text-sm hover:bg-stone-700/30 transition-colors">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400/80 text-xs font-mono mt-0.5">{event.timestamp}</span>
                  <span className="text-white/90">{event.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </div>
  );
}