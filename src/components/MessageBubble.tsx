'use client';

import { motion } from 'framer-motion';
import React from 'react';

// Define the SenderType type
type SenderType = 'fan' | 'system' | 'other';

interface MessageBubbleProps {
  sender: SenderType;
  text: string;
  timestamp: Date;
  isCurrentUser?: boolean;
}

export function MessageBubble({ sender, text, timestamp, isCurrentUser = false }: MessageBubbleProps) {
  const getBubbleStyle = () => {
    switch (sender) {
      case 'fan':
        return 'bg-pink-900/30 border border-pink-800/50 rounded-lg p-3';
      case 'system':
        return 'bg-cyan-900/20 border border-cyan-800/50 rounded-lg p-3';
      default:
        return 'bg-stone-800/50 border border-stone-700 rounded-lg p-3';
    }
  };

  const getTextStyle = (sender: SenderType) => {
    switch (sender) {
      case 'fan':
        return 'text-xs text-pink-300';
      case 'system':
        return 'text-xs text-cyan-300';
      default:
        return 'text-xs text-stone-300';
    }
  };

  const getTimestampStyle = (sender: SenderType) => {
    return `text-xs mt-1 font-mono ${
      sender === 'fan' 
        ? 'text-pink-400/60' 
        : 'text-cyan-400/60'
    }`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut"
      }}
      className={`flex flex-col ${sender === 'fan' ? 'items-end' : 'items-start'} mb-3 px-2`}
    >
      <div className={`${getBubbleStyle()} relative overflow-hidden`}>
        {/* Efeito de brilho sutil */}
        <div className={`absolute inset-0 rounded-lg pointer-events-none ${
          sender === 'fan'
            ? 'bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-400/5 to-transparent'
            : 'bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-cyan-400/5 to-transparent'
        }`} />
        
        <div className={`relative z-10 ${getTextStyle(sender)}`}>
          {text}
        </div>
        
        {timestamp && (
          <div className={getTimestampStyle(sender)}>
            {timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}