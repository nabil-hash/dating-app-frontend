import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';
import { useMatchStore } from '../../store/matchStore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FaComments, FaHeart } from 'react-icons/fa';

const Matches = () => {
  const navigate = useNavigate();
  const { matches, fetchMatches, isLoading } = useMatchStore();

  useEffect(() => {
    fetchMatches();
  }, []);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-96">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Mes Matches</h1>
          <p className="text-gray-600">
            {matches.length} {matches.length > 1 ? 'personnes' : 'personne'} avec qui vous avez matché
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="mb-6">
              <FaHeart className="mx-auto text-6xl text-gray-300" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Aucun match pour le moment
            </h3>
            <p className="text-gray-600 mb-6">
              Continuez à liker des profils pour trouver votre match !
            </p>
            <button
              onClick={() => navigate('/discover')}
              className="btn-primary"
            >
              Découvrir des profils
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((match) => {
              const photoUrl = match.user.photos?.[0]
                ? `http://127.0.0.1:8000${match.user.photos[0].url}`
                : 'https://via.placeholder.com/300x400';

              return (
                <div
                  key={match.match_id}
                  className="card hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => navigate('/messages')}
                >
                  {/* Photo */}
                  <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-4">
                    <img
                      src={photoUrl}
                      alt={match.user.first_name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Badge vérifié */}
                    {match.user.is_verified && (
                      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ✓ Vérifié
                      </div>
                    )}
                  </div>

                  {/* Infos */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {match.user.first_name}, {match.user.age}
                    </h3>
                    
                    {match.user.city && (
                      <p className="text-sm text-gray-600 mb-3">
                        📍 {match.user.city}
                      </p>
                    )}

                    {match.user.bio && (
                      <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                        {match.user.bio}
                      </p>
                    )}

                    {/* Bouton message */}
                    <button className="w-full bg-primary-500 text-white py-2 rounded-lg font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center space-x-2">
                      <FaComments />
                      <span>Envoyer un message</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Matches;