'use client';

import { motion } from 'framer-motion';
import React from 'react';

interface MessageBubbleProps {
  sender: 'fan' | 'bot' | 'system' | 'command-help';
  text: string | React.ReactNode;
  timestamp?: Date;
}

export function MessageBubble({ sender, text, timestamp }: MessageBubbleProps) {
  const getBubbleStyle = () => {
    switch (sender) {
      case 'fan':
        return 'bg-amber-400/20 text-white border border-amber-400/30 rounded-tr-none';
      case 'bot':
        return 'bg-stone-700/80 text-white border border-stone-600 rounded-tl-none';
      case 'system':
        return 'bg-stone-800 text-amber-300 border border-stone-600 text-center text-sm py-1 px-3';
      default:
        return 'bg-stone-700 text-white';
    }
  };

  const getTimestampStyle = () => {
    return `text-xs mt-1 ${
      sender === 'fan' 
        ? 'text-amber-300/80' 
        : sender === 'bot' 
          ? 'text-stone-400' 
          : 'text-amber-400/70'
    }`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex flex-col ${sender === 'fan' ? 'items-end' : 'items-start'} mb-2`}
    >
      <div className={`px-4 py-2 rounded-lg max-w-[85%] ${getBubbleStyle()}`}>
        <div className="text-white/90">{text}</div>
        {timestamp && (
          <div className={getTimestampStyle()}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </motion.div>
  );
}