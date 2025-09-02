
import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const Counter: React.FC<CounterProps> = ({ 
  end, 
  duration = 2000,
  suffix = '',
  prefix = ''
}) => {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(countRef, { once: true });
  const countStarted = useRef(false);
  
  useEffect(() => {
    if (isInView && !countStarted.current) {
      countStarted.current = true;
      
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const updateCount = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const progress = 1 - remaining / duration;
        
        setCount(Math.floor(end * Math.min(1, progress)));
        
        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };
      
      requestAnimationFrame(updateCount);
    }
  }, [isInView, duration, end]);
  
  return (
    <div ref={countRef} className="text-3xl md:text-4xl font-bold">
      {prefix}{count.toLocaleString()}{suffix}
    </div>
  );
};
