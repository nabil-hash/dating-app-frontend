import React from 'react';
import {  formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const ConversationList = ({ conversations, activeMatchId, onSelectConversation }) => {
  if (conversations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Aucune conversation</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {conversations.map((conv) => {
        const photoUrl = conv.user.photos?.[0]
          ? `http://127.0.0.1:8000${conv.user.photos[0].url}`
          : 'https://via.placeholder.com/50';

        const isActive = conv.match_id === activeMatchId;
        const lastMessageTime = conv.last_message?.sent_at
          ? formatDistanceToNow(new Date(conv.last_message.sent_at), {
              addSuffix: true,
              locale: fr,
            })
          : '';

        return (
          <div
            key={conv.match_id}
            onClick={() => onSelectConversation(conv.match_id)}
            className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              isActive ? 'bg-primary-50 border-l-4 border-primary-500' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* Photo */}
              <div className="relative">
                <img
                  src={photoUrl}
                  alt={conv.user.first_name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {conv.unread_count > 0 && (
                  <div className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {conv.unread_count}
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {conv.user.first_name}, {conv.user.age}
                  </h3>
                  {lastMessageTime && (
                    <span className="text-xs text-gray-500 ml-2">
                      {lastMessageTime}
                    </span>
                  )}
                </div>
                {conv.last_message && (
                  <p
                    className={`text-sm truncate ${
                      conv.unread_count > 0
                        ? 'text-gray-800 font-semibold'
                        : 'text-gray-500'
                    }`}
                  >
                    {conv.last_message.is_mine && 'Vous: '}
                    {conv.last_message.content}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;