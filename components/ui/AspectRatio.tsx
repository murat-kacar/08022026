import React from 'react';

export function AspectRatio({ ratio = 16 / 9, children, className = '' }: { ratio?: number; children: React.ReactNode; className?: string }) {
  const padding = `${100 / (ratio)}%`;
  return (
    <div className={`relative w-full ${className}`} style={{ paddingTop: padding }}>
      <div className="absolute inset-0">{children}</div>
    </div>
  );
}

export default AspectRatio;
