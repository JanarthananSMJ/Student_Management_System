import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ className = '', size = 24 }) {
  return <Loader2 className={`animate-spin text-primary-600 ${className}`} style={{ width: size, height: size }} />;
}
