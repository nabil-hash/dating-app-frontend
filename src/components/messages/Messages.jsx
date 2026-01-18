import React, { useEffect, useState, useRef } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { useMessageStore } from '../../store/messageStore';
import { useAuthStore } from '../../store/authStore';
import ConversationList from '../../components/messages/ConversationList';
import MessageBubble from '../../components/messages/MessageBubble';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaPaperPlane, FaArrowLeft, FaComments } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { initializeEcho, getEcho, disconnectEcho } from '../../utils/echo';

const Messages = () => {
  const { user, token } = useAuthStore();
  const {
    conversations,
    messages,
    isLoading,
    fetchConversations,
    fetchMessages,
    sendMessage,
    addReceivedMessage,
    clearCurrentConversation,
  } = useMessageStore();

  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Charger les conversations au montage
  useEffect(() => {
    fetchConversations();

    // Initialiser Echo
     initializeEcho(token);

    return () => {
      disconnectEcho();
    };
  }, []);

  // Écouter les nouveaux messages en temps réel
  useEffect(() => {
    if (!selectedMatchId) return;

    const echo = getEcho();
    if (!echo) return;

    // S'abonner au canal privé du match
    const channel = echo.private(`match.${selectedMatchId}`);

    channel.listen('.message.new', (data) => {
      console.log('Nouveau message reçu:', data);
      
      // Ajouter le message
      const receivedMessage = {
        id: data.id,
        content: data.content,
        type: data.type,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        match_id: data.match_id,
        is_mine: data.sender_id === user.id,
        created_at: data.created_at,
        sent_at: data.created_at,
      };

      addReceivedMessage(receivedMessage);
    });

    return () => {
      channel.stopListening('.message.new');
      echo.leave(`match.${selectedMatchId}`);
    };
  }, [selectedMatchId, user]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSelectConversation = async (matchId) => {
    setSelectedMatchId(matchId);
    await fetchMessages(matchId);
  };

  const handleBackToList = () => {
    setSelectedMatchId(null);
    clearCurrentConversation();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedMatchId) return;

    setIsSending(true);
    const result = await sendMessage(selectedMatchId, newMessage.trim());

    if (result.success) {
      setNewMessage('');
    } else {
      toast.error(result.error);
    }

    setIsSending(false);
  };

  const selectedConversation = conversations.find(
    (c) => c.match_id === selectedMatchId
  );

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Liste des conversations - Desktop toujours visible, Mobile conditionnelle */}
            <div
              className={`border-r border-gray-200 overflow-y-auto ${
                selectedMatchId ? 'hidden md:block' : 'block'
              }`}
            >
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-800 flex items-center">
                  <FaComments className="mr-2 text-primary-500" />
                  Messages
                </h2>
              </div>

              {isLoading && !conversations.length ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner />
                </div>
              ) : (
                <ConversationList
                  conversations={conversations}
                  activeMatchId={selectedMatchId}
                  onSelectConversation={handleSelectConversation}
                />
              )}
            </div>

            {/* Zone de chat */}
            <div
              className={`col-span-2 flex flex-col ${
                !selectedMatchId ? 'hidden md:flex' : 'flex'
              }`}
            >
              {selectedMatchId && selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center space-x-3">
                    <button
                      onClick={handleBackToList}
                      className="md:hidden text-gray-600 hover:text-gray-800"
                    >
                      <FaArrowLeft className="text-xl" />
                    </button>
                    <img
                      src={
                        selectedConversation.user.photos?.[0]
                          ? `http://127.0.0.1:8000${selectedConversation.user.photos[0].url}`
                          : 'https://via.placeholder.com/40'
                      }
                      alt={selectedConversation.user.first_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {selectedConversation.user.first_name},{' '}
                        {selectedConversation.user.age}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {selectedConversation.user.city || 'En ligne'}
                      </p>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {isLoading && messages.length === 0 ? (
                      <div className="flex justify-center items-center h-full">
                        <LoadingSpinner />
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>Aucun message pour le moment</p>
                        <p className="text-sm mt-2">Envoyez le premier message ! 👋</p>
                      </div>
                    ) : (
                      <>
                        {messages.map((msg) => (
                          <MessageBubble
                            key={msg.id}
                            message={msg}
                            ismine={msg.is_mine || msg.sender_id === user.id}
                          />
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input */}
                  <form
                    onSubmit={handleSendMessage}
                    className="p-4 border-t border-gray-200 bg-white"
                  >
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez votre message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSending}
                      />
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="bg-primary-500 text-white p-3 rounded-full hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FaPaperPlane />
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center text-gray-500">
                    <FaComments className="mx-auto text-6xl mb-4 text-gray-300" />
                    <p className="text-lg">Sélectionnez une conversation</p>
                    <p className="text-sm mt-2">
                      Choisissez un match pour commencer à discuter
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Messages;