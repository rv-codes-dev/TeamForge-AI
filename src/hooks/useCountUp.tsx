import React, { useState, useEffect, useRef } from 'react';

/**
 * Smoothly interpolates a number from its current value to a target value.
 * Uses cubic ease-out curve for natural, satisfying motion.
 * 
 * @param targetValue The numeric value to animate to
 * @param durationMs Animation duration in milliseconds (default: 750ms)
 * @param decimals Number of decimal points to preserve (default: 0)
 */
export function useCountUp(targetValue: number, durationMs: number = 750, decimals: number = 0): number {
  const [displayValue, setDisplayValue] = useState<number>(targetValue);
  const prevTargetRef = useRef<number>(targetValue);
  const currentValRef = useRef<number>(targetValue);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = currentValRef.current;
    const endValue = targetValue;
    
    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    prevTargetRef.current = endValue;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);

      // Ease-out cubic: fast start, soft landing
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;

      currentValRef.current = current;
      
      const rounded = decimals > 0 
        ? parseFloat(current.toFixed(decimals))
        : Math.round(current);

      setDisplayValue(rounded);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        currentValRef.current = endValue;
        setDisplayValue(endValue);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetValue, durationMs, decimals]);

  return displayValue;
}

export interface AnimatedNumberProps {
  value: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 750,
  decimals = 0,
  className = '',
  prefix = '',
  suffix = ''
}) => {
  const animated = useCountUp(value, duration, decimals);
  const formatted = decimals > 0 ? animated.toFixed(decimals) : String(animated);
  return (
    <span className={className}>
      {prefix}{formatted}{suffix}
    </span>
  );
};
