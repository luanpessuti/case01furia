interface Team {
  name: string;
  logo: string;
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
  const getStatusStyles = () => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-r from-lime-400/20 to-lime-400/10',
          text: 'text-lime-400',
          border: 'border-lime-400/30',
          label: 'EM BREVE'
        };
      case 'live':
        return {
          bg: 'bg-gradient-to-r from-pink-500/20 to-pink-500/10',
          text: 'text-pink-400',
          border: 'border-pink-400/40',
          label: 'AO VIVO',
          pulse: 'animate-pulse'
        };
      case 'finished':
        return {
          bg: 'bg-gradient-to-r from-purple-500/20 to-purple-500/10',
          text: 'text-purple-400',
          border: 'border-purple-400/30',
          label: 'FINALIZADO'
        };
    }
  };

  const statusStyles = getStatusStyles();

  return (
    <div className={`rounded-xl border ${statusStyles.border} bg-gradient-to-br from-stone-900/50 to-stone-950/80 backdrop-blur-sm overflow-hidden shadow-[0_0_15px_-5px_var(--tw-shadow-color)] ${status === 'live' ? 'shadow-pink-400/20' : 'shadow-cyan-400/10'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b ${statusStyles.border} ${statusStyles.bg}`}>
        <span className="text-xs font-title tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400">
          PARTIDA #{matchId}
        </span>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyles.text} ${statusStyles.pulse || ''} border ${statusStyles.border}`}>
          {statusStyles.label}
        </span>
      </div>

      {/* Teams and Scores */}
      <div className="px-4 py-5 flex flex-col gap-4">
        {[teams.team1, teams.team2].map((team, idx) => (
          <div key={team.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {team.logo ? (
                <div className="relative">
                  <img
                    src={team.logo}
                    alt={team.name}
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-team-logo.png';
                    }}
                  />
                  <div className="absolute inset-0 rounded-full border border-cyan-400/20 pointer-events-none" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-800 to-stone-700 flex items-center justify-center text-white font-bold border border-stone-600">
                  {team.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-stone-200 to-stone-100">
                {team.name}
              </span>
            </div>
            <span
              className={`text-2xl font-bold ${
                idx === 0 ? 'text-pink-400' : 'text-cyan-400'
              }`}
            >
              {team.score}
            </span>
          </div>
        ))}
      </div>

      {/* Match Info */}
      <div className="px-4 pb-4 text-xs flex flex-col gap-2">
        <div className="flex justify-between items-center">
        <span className="text-stone-400">Mapa: <span className="text-cyan-300 font-medium">{map}</span></span>
        </div>
        
        {status === 'live' && currentRound && totalRounds && (
          <div className="flex justify-between items-center">
            <span className="text-stone-400">Rodada: <span className="font-medium text-pink-300">{currentRound} / {totalRounds}</span></span>
          </div>
        )}
        
        {status === 'upcoming' && timeRemaining && (
          <div className="flex justify-between items-center">
            <span className="text-stone-400">Começa em:</span>
            <span className="font-medium text-lime-300">{timeRemaining}</span>
          </div>
        )}
      </div>

      {/* Últimos eventos */}
      {lastEvents?.length ? (
        <div className={`px-4 py-3 border-t ${statusStyles.border} ${statusStyles.bg}`}>
          <div className="text-xs font-body tracking-wider text-cyan-300 mb-2">
            ÚLTIMOS EVENTOS:
          </div>
          <ul className="space-y-2">
            {lastEvents.map((event) => (
              <li key={event.id} className="flex justify-between items-center text-sm">
                <span className="text-stone-300">{event.text}</span>
                <span className="text-xs font-body text-stone-500">{event.timestamp}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}