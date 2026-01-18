import React, { useState } from 'react';
import { FaComment } from 'react-icons/fa';
import FeedbackModal from './FeedbackModal';

const FeedbackButton = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-primary-500 text-white w-14 h-14 rounded-full shadow-2xl hover:bg-primary-600 transition-all duration-300 hover:scale-110 flex items-center justify-center z-50"
        title="Envoyer un feedback"
      >
        <FaComment className="text-xl" />
      </button>

      {/* Modal */}
      {showModal && <FeedbackModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default FeedbackButton;