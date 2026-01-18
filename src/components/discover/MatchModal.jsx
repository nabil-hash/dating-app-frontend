import React from 'react';
import { FaHeart, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';

const MatchModal = ({ match, onClose }) => {
  const navigate = useNavigate();

  if (!match) return null;

  const photoUrl = match.user.photos?.[0]
    ? `http://127.0.0.1:8000${match.user.photos[0].url}`
    : 'https://via.placeholder.com/200';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 relative animate-bounce-in">
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="text-2xl" />
        </button>

        {/* Contenu */}
        <div className="text-center">
          {/* Animation coeurs */}
          <div className="mb-6">
            <FaHeart className="text-6xl text-primary-500 mx-auto animate-pulse" />
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            C'est un Match !
          </h2>
          <p className="text-gray-600 mb-6">
            Vous et {match.user.first_name} vous êtes likés mutuellement
          </p>

          {/* Photo */}
          <div className="mb-6">
            <img
              src={photoUrl}
              alt={match.user.first_name}
              className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-primary-500"
            />
            <p className="mt-3 text-lg font-semibold text-gray-800">
              {match.user.first_name}, {match.user.age}
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/messages')}
              variant="primary"
              fullWidth
            >
              Envoyer un message
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              fullWidth
            >
              Continuer à découvrir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchModal;