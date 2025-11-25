import { useState, useEffect } from 'react';
import { getTimeLeft } from '../utils';

interface UseTimerResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
  formatted: string;
}

export const useTimer = (expiresAt: string): UseTimerResult => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = getTimeLeft(expiresAt);
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.expired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatted = timeLeft.expired
    ? 'Expired'
    : timeLeft.days > 0
    ? `${timeLeft.days}d ${timeLeft.hours}h`
    : timeLeft.hours > 0
    ? `${timeLeft.hours}h ${timeLeft.minutes}m`
    : `${timeLeft.minutes}m ${timeLeft.seconds}s`;

  return {
    ...timeLeft,
    formatted,
  };
};
