import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LiveCounter = () => {
  const [count, setCount] = useState(0);
  const targetCount = 12847;

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = targetCount / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetCount) {
        setCount(targetCount);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-12"
    >
      <div className="inline-block">
        <p className="text-sm font-medium text-muted-foreground mb-2">Lives assisted</p>
        <div className="text-5xl md:text-6xl font-bold text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
          {count.toLocaleString()}+
        </div>
      </div>
    </motion.div>
  );
};

export default LiveCounter;