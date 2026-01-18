import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageBubble = ({ message, ismine }) => {
  const time = message.sent_at || message.created_at;
  const formattedTime = time ? format(new Date(time), 'HH:mm', { locale: fr }) : '';

  return (
    <div className={`flex ${ismine ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
          ismine
            ? 'bg-primary-500 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm break-words">{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            ismine ? 'text-white opacity-75' : 'text-gray-500'
          }`}
        >
          {formattedTime}
        </p>
      </div>
    </div>
  );
};

export default MessageBubble;