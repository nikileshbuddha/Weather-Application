import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="flex w-full max-w-md items-center gap-3 rounded-xl bg-red-500/20 px-6 py-4 text-red-100 backdrop-blur-md">
      <AlertCircle className="h-6 w-6 flex-shrink-0" />
      <p className="text-lg">{message}</p>
    </div>
  );
}