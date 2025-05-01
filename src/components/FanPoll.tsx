import { useState, useEffect } from 'react';

interface PollOption {
  id: number;
  text: string;
  votes: number;
}

interface PollProps {
  id: string;
  question: string;
  options: PollOption[];
  duration?: number; // Duration in seconds
  onVote?: (pollId: string, optionId: number) => void;
}

export function FanPoll({ id, question, options: initialOptions, duration = 120, onVote }: PollProps) {
  const [options, setOptions] = useState<PollOption[]>(initialOptions);
  const [voted, setVoted] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [totalVotes, setTotalVotes] = useState<number>(
    initialOptions.reduce((sum, option) => sum + option.votes, 0)
  );

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Format time remaining
  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Handle vote
  const handleVote = (optionId: number) => {
    if (voted) return;

    // Update votes locally
    const updatedOptions = options.map(option => 
      option.id === optionId 
        ? { ...option, votes: option.votes + 1 } 
        : option
    );
    setOptions(updatedOptions);
    setVoted(true);
    setTotalVotes(prev => prev + 1);

    // Call callback if provided
    if (onVote) {
      onVote(id, optionId);
    }
  };

  // Calculate percentage for each option
  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  // Randomly update votes (for simulation)
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const randomOptionIndex = Math.floor(Math.random() * options.length);
        const updatedOptions = [...options];
        updatedOptions[randomOptionIndex].votes += 1;
        setOptions(updatedOptions);
        setTotalVotes(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [options]);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 mb-4">
      <div className="p-3 bg-gray-900 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-white text-sm">ENQUETE</h3>
        {timeLeft > 0 && (
          <div className="text-xs bg-furia-red/20 text-furia-red px-2 py-1 rounded-full">
            Encerra em {formatTimeLeft()}
          </div>
        )}
        {timeLeft <= 0 && (
          <div className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
            Encerrada
          </div>
        )}
      </div>

      <div className="p-4">
        <h4 className="text-white font-bold mb-3">{question}</h4>

        <div className="space-y-3">
          {options.map((option) => (
            <div key={option.id} className="relative">
              <button
                className={`w-full text-left p-3 rounded-lg border relative z-10 transition-all ${
                  voted
                    ? 'bg-gray-700 border-gray-600 cursor-default'
                    : 'bg-gray-700/50 border-gray-700 hover:bg-gray-700 cursor-pointer'
                }`}
                onClick={() => !voted && handleVote(option.id)}
                disabled={voted || timeLeft <= 0}
              >
                <div className="flex justify-between items-center">
                  <span>{option.text}</span>
                  {voted && <span className="font-bold">{getPercentage(option.votes)}%</span>}
                </div>
              </button>

              {/* Progress bar */}
              {voted && (
                <div 
                  className="absolute top-0 left-0 h-full bg-furia-red/30 rounded-lg transition-all duration-1000 ease-out"
                  style={{ width: `${getPercentage(option.votes)}%`, zIndex: 5 }}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-3 text-center text-sm text-gray-400">
          {voted ? `Seu voto foi registrado • ${totalVotes} votos` : 'Clique para votar'}
        </div>
      </div>
    </div>
  );
}

export default FanPoll;