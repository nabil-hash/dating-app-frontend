// src/components/feedback/FeedbackModal.jsx
import React, { useState } from 'react';
import { FaTimes, FaStar, FaPaperPlane } from 'react-icons/fa';

const FeedbackModal = ({ onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, tu enverrais le feedback à ton backend
    console.log({ rating, feedback });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Merci !</h3>
          <p className="text-gray-600">Votre feedback a été envoyé avec succès.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
        {/* En-tête */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Votre Feedback</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit}>
          {/* Évaluation par étoiles */}
          <div className="mb-6">
            <p className="text-gray-700 mb-3">Comment évaluez-vous notre application ?</p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>

          {/* Commentaire */}
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="feedback">
              Vos suggestions ou problèmes
            </label>
            <textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Dites-nous ce que vous pensez..."
              required
            />
          </div>

          {/* Bouton d'envoi */}
          <button
            type="submit"
            className="w-full bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center font-semibold"
          >
            <FaPaperPlane className="mr-2" />
            Envoyer le Feedback
          </button>
        </form>

        {/* Note */}
        <p className="text-gray-500 text-sm mt-4 text-center">
          Vos retours nous aident à améliorer l'application !
        </p>
      </div>
    </div>
  );
};

export default FeedbackModal;