import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import { useAuthStore } from '../../store/authStore';
import { usePhotoStore } from '../../store/photoStore';
import { userService } from '../../api/userService';
import Button from '../common/Button';
import Input from '../common/Input';
import PhotoUpload from './PhotoUpload';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuthStore();
  const { fetchPhotos } = usePhotoStore();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    city: user?.city || '',
    bio: user?.bio || '',
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await userService.updateProfile(formData);
      updateUser(response.data);
      toast.success('Profil mis à jour !');
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Mon Profil</h1>

        <div className="space-y-6">
          {/* Carte Informations */}
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Informations</h2>
              {!isEditing && (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                >
                  Modifier
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Prénom"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Ville"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows="4"
                    maxLength="500"
                    className="input-field"
                    placeholder="Parlez-nous de vous..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.bio?.length || 0}/500 caractères
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                  >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'Enregistrer'}
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsEditing(false)}
                  >
                    Annuler
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Prénom :</span>
                  <p className="text-lg font-medium text-gray-800">{user?.first_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email :</span>
                  <p className="text-lg text-gray-800">{user?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Âge :</span>
                  <p className="text-lg text-gray-800">{user?.age} ans</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Ville :</span>
                  <p className="text-lg text-gray-800">{user?.city || 'Non renseignée'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Bio :</span>
                  <p className="text-gray-800">{user?.bio || 'Aucune bio'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Carte Photos */}
          <div className="card">
            <PhotoUpload />
          </div>

          {/* Stats */}
          <div className="card bg-gradient-to-r from-primary-500 to-pink-500 text-white">
            <h2 className="text-xl font-semibold mb-4">Statut du compte</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm opacity-90">Type de compte</p>
                <p className="text-2xl font-bold">
                  {user?.is_premium ? '⭐ Premium' : '🆓 Gratuit'}
                </p>
              </div>
              <div>
                <p className="text-sm opacity-90">Profil vérifié</p>
                <p className="text-2xl font-bold">
                  {user?.is_verified ? '✅ Oui' : '❌ Non'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;