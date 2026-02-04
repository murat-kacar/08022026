"use client";
import React from 'react';
import { motion } from 'framer-motion';

export function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-shadow shadow-sm bg-primary text-white ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
