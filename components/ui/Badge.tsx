import React from 'react';

export function Badge({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <span className={`inline-block text-xs font-semibold px-2 py-1 rounded ${className}`}>{children}</span>;
}

export default Badge;
