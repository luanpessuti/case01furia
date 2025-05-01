// Tipos de dados
export interface MatchEvent {
    id: number;
    text: string;
    timestamp: string;
  }
  
  export interface Match {
    matchId: string;
    teams: {
      team1: {
        name: string;
        logo: string;
        score: number;
      };
      team2: {
        name: string;
        logo: string;
        score: number;
      };
    };
    map: string;
    status: 'upcoming' | 'live' | 'finished';
    currentRound?: number;
    totalRounds?: number;
    timeRemaining?: string;
    lastEvents?: MatchEvent[];
  }
  
  // Dados de exemplo
  const dummyMatches: Match[] = [
    {
      matchId: "1",
      teams: {
        team1: {
          name: "FURIA",
          logo: "/images/furiaLogo.png",
          score: 9
        },
        team2: {
          name: "NAVI",
          logo: "/images/naviLogo.png",
          score: 7
        }
      },
      map: "Mirage",
      status: "live",
      currentRound: 17,
      totalRounds: 30,
      timeRemaining: "1:45",
      lastEvents: [
        { id: 1, text: "FalleN eliminou s1mple com AWP", timestamp: "0:15" },
        { id: 2, text: "KSCERATO planta a bomba no B", timestamp: "0:35" },
        { id: 3, text: "FURIA vence o round", timestamp: "1:20" }
      ]
    },
    {
      matchId: "2",
      teams: {
        team1: {
          name: "FURIA",
          logo: "/images/furiaLogo.png",
          score: 0
        },
        team2: {
          name: "LIQUID",
          logo: "/images/liquidLogo.png",
          score: 0
        }
      },
      map: "Inferno",
      status: "upcoming",
    },
    {
      matchId: "3",
      teams: {
        team1: {
          name: "FURIA",
          logo: "/images/furiaLogo.png",
          score: 16
        },
        team2: {
          name: "MIBR",
          logo: "/images/mibrLogo.png",
          score: 14
        }
      },
      map: "Nuke",
      status: "finished",
    }
  ];
  
  // Eventos que podem ocorrer durante uma partida ao vivo
  const possibleEvents = [
    "FalleN eliminou {opponent} com AWP",
    "KSCERATO eliminou {opponent} com AK-47",
    "yuurih realiza um clutch 1v2!",
    "chelo defende o bomb site B com 3 kills",
    "drop planta a bomba no bomb site A",
    "FURIA vence o round com estratégia rápida",
    "Time CT realiza retake bem sucedido",
    "Bomba explodiu! Ponto para os Terroristas",
    "Time TR executa estratégia no bomb site A",
    "Timeout tático solicitado pela FURIA"
  ];
  
  const opponents = ["s1mple", "electronic", "b1t", "perfecto", "Boombl4", "nitr0", "EliGE", "NAF", "Stewie2K", "Grim"];
  
  // Funções para gerar eventos aleatórios
  function getRandomEvent(): string {
    const event = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
    return event.replace("{opponent}", opponents[Math.floor(Math.random() * opponents.length)]);
  }
  
  function getRandomTime(): string {
    const minutes = Math.floor(Math.random() * 2);
    const seconds = Math.floor(Math.random() * 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  }
  
  // Função para atualizar uma partida ao vivo
  function updateLiveMatch(match: Match): Match {
    if (match.status !== 'live') return match;
  
    const updatedMatch = { ...match };
    
    // Atualizar tempo restante (simulado)
    const currentTime = match.timeRemaining ? match.timeRemaining.split(':') : ['1', '45'];
    let minutes = parseInt(currentTime[0]);
    let seconds = parseInt(currentTime[1]) - 15;
    
    if (seconds < 0) {
      seconds = 45;
      minutes = Math.max(0, minutes - 1);
    }
    
    updatedMatch.timeRemaining = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    
    // Adicionar novo evento aleatoriamente
    if (Math.random() > 0.7) {
      const newEvent = {
        id: Date.now(),
        text: getRandomEvent(),
        timestamp: updatedMatch.timeRemaining
      };
      
      updatedMatch.lastEvents = [newEvent, ...(updatedMatch.lastEvents || [])].slice(0, 5);
    }
    
    // Atualizar placar aleatoriamente (com baixa probabilidade)
    if (Math.random() > 0.9) {
      if (Math.random() > 0.5) {
        updatedMatch.teams.team1.score += 1;
        if (updatedMatch.currentRound !== undefined) {
          updatedMatch.currentRound += 1;
        }
      } else {
        updatedMatch.teams.team2.score += 1;
        if (updatedMatch.currentRound !== undefined) {
          updatedMatch.currentRound += 1;
        }
      }
    }
    
    return updatedMatch;
  }
  
  // Serviço para obter partidas
  export const matchService = {
    // Obter todas as partidas
    getMatches: () => {
      return [...dummyMatches];
    },
    
    // Obter uma partida pelo ID
    getMatchById: (id: string) => {
      return dummyMatches.find(match => match.matchId === id);
    },
    
    // Obter partidas ao vivo
    getLiveMatches: () => {
      return dummyMatches.filter(match => match.status === 'live');
    },
    
    // Simular atualização das partidas ao vivo
    subscribeToLiveUpdates: (callback: (matches: Match[]) => void) => {
      // Simular atualizações a cada 5 segundos
      const interval = setInterval(() => {
        const updatedMatches = dummyMatches.map(match => {
          if (match.status === 'live') {
            return updateLiveMatch(match);
          }
          return match;
        });
        
        callback([...updatedMatches]);
      }, 5000);
      
      // Retornar função para cancelar a assinatura
      return () => clearInterval(interval);
    }
  };