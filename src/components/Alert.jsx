import React from 'react';

export default function Alert({ type, message }) {
  const bgColor = type === 'error' ? 'bg-red-100' : 'bg-yellow-100';
  const textColor = type === 'error' ? 'text-red-700' : 'text-yellow-700';

  // Asegurarse de que el mensaje sea una cadena
  const safeMessage = typeof message === 'string' ? message : JSON.stringify(message);

  return (
    <div className={`p-4 mb-4 rounded-lg ${bgColor} ${textColor}`} role="alert">
      <p>{safeMessage}</p>
    </div>
  );
}