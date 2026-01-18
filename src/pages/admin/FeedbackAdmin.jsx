import React, { useEffect, useState } from 'react';
import MainLayout from '../../components/layout/MainLayout';
import { feedbackService } from '../../api/feedbackService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaBug, FaLightbulb, FaComment, FaCheck, FaClock, FaCircle } from 'react-icons/fa';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FeedbackAdmin = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, in_progress, resolved
  const [typeFilter, setTypeFilter] = useState('all'); // all, bug, feature, other

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    setIsLoading(true);
    try {
      const response = await feedbackService.getAllFeedbacks();
      setFeedbacks(response.data.data || []);
   } catch (error) {
  console.error('Erreur détaillée:', error);
  toast.error('Erreur lors du chargement des feedbacks');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await feedbackService.updateStatus(id, newStatus);
      toast.success('Statut mis à jour');
      
      // Mettre à jour localement
      setFeedbacks(feedbacks.map(fb => 
        fb.id === id ? { ...fb, status: newStatus } : fb
      ));
   } catch (error) {
  console.error('Erreur détaillée:', error);
  toast.error('Erreur lors du chargement des feedbacks');
}
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'bug': return <FaBug className="text-red-500" />;
      case 'feature': return <FaLightbulb className="text-yellow-500" />;
      default: return <FaComment className="text-blue-500" />;
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case 'bug': return 'Bug';
      case 'feature': return 'Suggestion';
      default: return 'Autre';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      new: { color: 'bg-blue-100 text-blue-800', icon: FaCircle, label: 'Nouveau' },
      in_progress: { color: 'bg-yellow-100 text-yellow-800', icon: FaClock, label: 'En cours' },
      resolved: { color: 'bg-green-100 text-green-800', icon: FaCheck, label: 'Résolu' },
    };
    
    const badge = badges[status];
    const Icon = badge.icon;
    
    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
        <Icon className="text-xs" />
        <span>{badge.label}</span>
      </span>
    );
  };

  // Filtrer les feedbacks
  const filteredFeedbacks = feedbacks.filter(fb => {
    const matchesStatus = filter === 'all' || fb.status === filter;
    const matchesType = typeFilter === 'all' || fb.type === typeFilter;
    return matchesStatus && matchesType;
  });

  // Statistiques
  const stats = {
    total: feedbacks.length,
    new: feedbacks.filter(fb => fb.status === 'new').length,
    inProgress: feedbacks.filter(fb => fb.status === 'in_progress').length,
    resolved: feedbacks.filter(fb => fb.status === 'resolved').length,
  };

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
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📊 Administration des Feedbacks
          </h1>
          <p className="text-gray-600">
            Gérez les retours et suggestions des utilisateurs
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-sm opacity-90 mb-1">Total</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
            <p className="text-sm opacity-90 mb-1">Nouveaux</p>
            <p className="text-3xl font-bold">{stats.new}</p>
          </div>
          <div className="card bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
            <p className="text-sm opacity-90 mb-1">En cours</p>
            <p className="text-3xl font-bold">{stats.inProgress}</p>
          </div>
          <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <p className="text-sm opacity-90 mb-1">Résolus</p>
            <p className="text-3xl font-bold">{stats.resolved}</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            
            {/* Filtre par statut */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Statut
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous</option>
                <option value="new">Nouveaux</option>
                <option value="in_progress">En cours</option>
                <option value="resolved">Résolus</option>
              </select>
            </div>

            {/* Filtre par type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Tous</option>
                <option value="bug">Bugs</option>
                <option value="feature">Suggestions</option>
                <option value="other">Autres</option>
              </select>
            </div>

            {/* Bouton rafraîchir */}
            <div className="flex items-end">
              <button
                onClick={loadFeedbacks}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                🔄 Actualiser
              </button>
            </div>
          </div>
        </div>

        {/* Liste des feedbacks */}
        {filteredFeedbacks.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500 text-lg">Aucun feedback trouvé</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div key={feedback.id} className="card hover:shadow-lg transition-shadow">
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {getTypeIcon(feedback.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-800">
                          {getTypeLabel(feedback.type)}
                        </span>
                        {getStatusBadge(feedback.status)}
                      </div>
                      <p className="text-sm text-gray-500">
                        {feedback.user 
                          ? `Par ${feedback.user.first_name} (${feedback.user.email})`
                          : `Email: ${feedback.email || 'Non renseigné'}`
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right text-sm text-gray-500">
                    <p>{format(new Date(feedback.created_at), 'dd/MM/yyyy', { locale: fr })}</p>
                    <p>{format(new Date(feedback.created_at), 'HH:mm', { locale: fr })}</p>
                  </div>
                </div>

                {/* Page */}
                {feedback.page && (
                  <div className="mb-3">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      📍 Page: {feedback.page}
                    </span>
                  </div>
                )}

                {/* Message */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{feedback.message}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 mr-2">Changer le statut:</span>
                  
                  {feedback.status !== 'new' && (
                    <button
                      onClick={() => handleStatusChange(feedback.id, 'new')}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200 transition-colors"
                    >
                      Nouveau
                    </button>
                  )}
                  
                  {feedback.status !== 'in_progress' && (
                    <button
                      onClick={() => handleStatusChange(feedback.id, 'in_progress')}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-sm hover:bg-yellow-200 transition-colors"
                    >
                      En cours
                    </button>
                  )}
                  
                  {feedback.status !== 'resolved' && (
                    <button
                      onClick={() => handleStatusChange(feedback.id, 'resolved')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      Résolu
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default FeedbackAdmin;