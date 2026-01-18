import React, { useState } from 'react';
import { FaTimes, FaBug, FaLightbulb, FaComment } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { feedbackService } from '../../api/feedbackService';
import toast from 'react-hot-toast';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';

const FeedbackModal = ({ onClose }) => {
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'other',
    message: '',
    email: '',
  });

  const feedbackTypes = [
    { value: 'bug', label: 'Signaler un bug', icon: FaBug, color: 'text-red-500' },
    { value: 'feature', label: 'Suggestion', icon: FaLightbulb, color: 'text-yellow-500' },
    { value: 'other', label: 'Autre', icon: FaComment, color: 'text-blue-500' },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.message.trim()) {
      toast.error('Le message est obligatoire');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await feedbackService.sendFeedback({
        ...formData,
        page: location.pathname,
      });

      if (response.success) {
        toast.success(response.message);
        onClose();
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative animate-bounce-in">
        
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            💬 Votre avis compte !
          </h2>
          <p className="text-gray-600 text-sm">
            Aidez-nous à améliorer votre expérience sur Dating App
          </p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Type de feedback */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de feedback
            </label>
            <div className="grid grid-cols-3 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.value;
                return (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`text-2xl mx-auto mb-2 ${type.color}`} />
                    <span className="text-xs font-medium text-gray-700">
                      {type.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="4"
              maxLength="1000"
              placeholder="Décrivez votre retour, suggestion ou problème..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.message.length}/1000 caractères
            </p>
          </div>

          {/* Email (optionnel) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email (optionnel)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="votre@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si vous souhaitez être recontacté
            </p>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner size="sm" /> : 'Envoyer le feedback'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default FeedbackModal;