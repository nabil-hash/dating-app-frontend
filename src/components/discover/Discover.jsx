import React, { useEffect, useState } from 'react';
import MainLayout from '../layout/MainLayout';
import { useMatchStore } from '../../store/matchStore';
import ProfileCard from './ProfileCard';
import MatchModal from './MatchModal';
import LoadingSpinner from '../common/LoadingSpinner';
import Button from '../common/Button';
import toast from 'react-hot-toast';
import { FaRedo } from 'react-icons/fa';

const Discover = () => {
  const { 
    isLoading, 
    fetchProfiles, 
    swipe, 
    getCurrentProfile,
    hasMoreProfiles 
  } = useMatchStore();

  const [matchData, setMatchData] = useState(null);
  const [showMatchModal, setShowMatchModal] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSwipe = async (direction) => {
    const result = await swipe(direction);

    if (result.success) {
      if (result.matched) {
        setMatchData(result.match);
        setShowMatchModal(true);
        toast.success('🎉 Match !');
      } else {
        if (direction === 'like') {
          toast.success('Like envoyé !');
        }
      }

      if (!hasMoreProfiles()) {
        setTimeout(() => {
          fetchProfiles();
        }, 500);
      }
    } else {
      toast.error(result.error || 'Erreur lors du swipe');
    }
  };

  const currentProfile = getCurrentProfile();

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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Découvrir</h1>
          <p className="text-gray-600">
            Swipez à gauche pour passer, à droite pour liker
          </p>
        </div>

        {currentProfile ? (
          <div className="flex justify-center">
            <ProfileCard
              profile={currentProfile}
              onSwipe={handleSwipe}
            />
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-6">
              <svg
                className="mx-auto h-24 w-24 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              Plus de profils disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Revenez plus tard pour découvrir de nouvelles personnes !
            </p>
            <Button
              onClick={fetchProfiles}
              variant="primary"
              className="inline-flex items-center space-x-2"
            >
              <FaRedo />
              <span>Recharger</span>
            </Button>
          </div>
        )}

        {showMatchModal && matchData && (
          <MatchModal
            match={matchData}
            onClose={() => {
              setShowMatchModal(false);
              setMatchData(null);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default Discover;