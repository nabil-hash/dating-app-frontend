import React, { useState } from 'react';
import { FaHeart, FaTimes, FaMapMarkerAlt, FaInfo } from 'react-icons/fa';

const ProfileCard = ({ profile, onSwipe }) => {
  const [showDetails, setShowDetails] = useState(false);

  if (!profile) return null;

  const primaryPhoto = profile.photos?.find(p => p.is_primary) || profile.photos?.[0];
  const photoUrl = primaryPhoto 
    ? `http://127.0.0.1:8000${primaryPhoto.url}`
    : 'https://via.placeholder.com/400x600?text=No+Photo';

  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl">
      {/* Image de fond */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${photoUrl})` }}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Informations */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="mb-4">
          <h2 className="text-3xl font-bold mb-1">
            {profile.first_name}, {profile.age}
          </h2>
          
          {profile.city && (
            <div className="flex items-center text-sm opacity-90">
              <FaMapMarkerAlt className="mr-2" />
              <span>{profile.city}</span>
            </div>
          )}

          {/* Score de compatibilité */}
          {profile.compatibility_score && (
            <div className="mt-2 inline-block bg-green-500 px-3 py-1 rounded-full text-sm font-semibold">
              {profile.compatibility_score}% compatible
            </div>
          )}
        </div>

        {/* Bio aperçu */}
        {profile.bio && !showDetails && (
          <p className="text-sm opacity-90 line-clamp-2 mb-4">
            {profile.bio}
          </p>
        )}

        {/* Détails étendus */}
        {showDetails && (
          <div className="mb-4 bg-black bg-opacity-50 p-4 rounded-lg max-h-40 overflow-y-auto">
            <p className="text-sm mb-3">{profile.bio}</p>
            
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <p className="text-xs font-semibold mb-2">Centres d'intérêt :</p>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs"
                    >
                      {interest.icon} {interest.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bouton détails */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="absolute top-4 right-4 bg-white bg-opacity-20 backdrop-blur-sm p-3 rounded-full hover:bg-opacity-30 transition-all"
        >
          <FaInfo className="text-white" />
        </button>

        {/* Boutons d'action */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => onSwipe('pass')}
            className="bg-white text-red-500 w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <FaTimes className="text-2xl" />
          </button>

          <button
            onClick={() => onSwipe('like')}
            className="bg-primary-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
          >
            <FaHeart className="text-2xl" />
          </button>
        </div>
      </div>

      {/* Badge vérifié */}
      {profile.is_verified && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          ✓ Vérifié
        </div>
      )}
    </div>
  );
};

export default ProfileCard;