import React, { useRef } from 'react';
import { FaCamera, FaTrash, FaStar } from 'react-icons/fa';
import { usePhotoStore } from '../../store/photoStore';
import toast from 'react-hot-toast';

const PhotoUpload = () => {
  const { photos, uploadPhoto, deletePhoto, setPrimaryPhoto } = usePhotoStore();
  const fileInputRef = useRef(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5MB');
      return;
    }

    if (photos.length >= 6) {
      toast.error('Maximum 6 photos autorisées');
      return;
    }

    // Upload
    const loadingToast = toast.loading('Upload en cours...');
    const orderIndex = photos.length + 1;
    const isPrimary = photos.length === 0;

    const result = await uploadPhoto(file, orderIndex, isPrimary);

    toast.dismiss(loadingToast);

    if (result.success) {
      toast.success('Photo uploadée avec succès !');
    } else {
      toast.error(result.error);
    }

    // Reset input
    e.target.value = '';
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Supprimer cette photo ?')) return;

    const result = await deletePhoto(photoId);
    if (result.success) {
      toast.success('Photo supprimée');
    } else {
      toast.error(result.error);
    }
  };

  const handleSetPrimary = async (photoId) => {
    const result = await setPrimaryPhoto(photoId);
    if (result.success) {
      toast.success('Photo principale définie');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Mes Photos ({photos.length}/6)
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Photos existantes */}
        {photos.map((photo) => (
          <div key={photo.id} className="relative aspect-square group">
            <img
              src={`http://127.0.0.1:8000${photo.url}`}
              alt="Profile"
              className="w-full h-full object-cover rounded-lg"
            />

            {/* Badge photo principale */}
            {photo.is_primary && (
              <div className="absolute top-2 left-2 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                <FaStar />
                <span>Principale</span>
              </div>
            )}

            {/* Overlay actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center space-x-2 opacity-0 group-hover:opacity-100">
              {!photo.is_primary && (
                <button
                  onClick={() => handleSetPrimary(photo.id)}
                  className="bg-yellow-400 text-white p-3 rounded-full hover:bg-yellow-500 transition-colors"
                  title="Définir comme principale"
                >
                  <FaStar />
                </button>
              )}
              <button
                onClick={() => handleDelete(photo.id)}
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
                title="Supprimer"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}

        {/* Bouton ajouter photo */}
        {photos.length < 6 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors cursor-pointer"
          >
            <FaCamera className="text-4xl text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Ajouter une photo</span>
          </button>
        )}

        {/* Input file caché */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default PhotoUpload;