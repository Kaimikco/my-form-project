'use client'

import React, { useState, useEffect } from 'react';

export const TypewriterDialogue = ({ 
  text = "", 
  letterDelay = 50,
  wordDelay = 100,
  punctuationDelay = 400,
  speedUpMultiplier = 0.2,
  onComplete = () => {}
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpeedUp, setIsSpeedUp] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
    setIsSpeedUp(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const currentChar = text[currentIndex];
      let delay = letterDelay;

      // Determine delay based on character type
      if (currentChar === ' ') {
        delay = wordDelay;
      } else if (currentChar === '.' || currentChar === '!' || currentChar === '?') {
        delay = punctuationDelay;
      } else if (currentChar === ',') {
        delay = punctuationDelay / 2;
      }

      // Apply speed up multiplier if active
      if (isSpeedUp) {
        delay *= speedUpMultiplier;
      }

      const timer = setTimeout(() => {
        setDisplayText(prev => prev + currentChar);
        setCurrentIndex(prev => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (currentIndex === text.length && text.length > 0) {
      // Animation complete
      onComplete();
    }
  }, [currentIndex, text, letterDelay, wordDelay, punctuationDelay, speedUpMultiplier, isSpeedUp, onComplete]);

  const handleClick = () => {
    if (currentIndex < text.length) {
      setIsSpeedUp(!isSpeedUp);
    }
  };

  return (
    <div 
      className={`${currentIndex < text.length ? 'cursor-pointer' : ''}`}
      onClick={handleClick}
    >
      {displayText}
      {currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </div>
  );
};