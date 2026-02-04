import React from 'react';

export function Card({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>{children}</div>
  );
}

export function CardHeader({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-4 py-3 border-b ${className}`}>{children}</div>;
}

export function CardContent({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`px-4 py-3 border-t ${className}`}>{children}</div>;
}

export default Card;
