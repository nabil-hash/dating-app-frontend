import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FaHeart, FaUser, FaComments, FaFire, FaSignOutAlt, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';


const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const navItems = [
    { path: '/discover', icon: FaFire, label: 'Découvrir' },
    { path: '/matches', icon: FaHeart, label: 'Matches' },
    { path: '/messages', icon: FaComments, label: 'Messages' },
    { path: '/profile', icon: FaUser, label: 'Profil' },
    { path: '/admin/feedbacks', icon: FaCog, label: 'Admin', admin: true },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/discover" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <FaHeart className="text-white text-xl" />
            </div>
            <span className="text-xl font-bold text-gray-800 hidden sm:block">
              Dating App
            </span>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-500 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 hidden sm:block">
              Bonjour, <span className="font-semibold">{user?.first_name}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary-500 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span className="hidden sm:block">Déconnexion</span>
            </button>
          </div>
        </div>

        {/* Navigation Mobile */}
        <div className="md:hidden flex justify-around py-2 border-t">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary-500' : 'text-gray-600'
                }`}
              >
                <Icon className="text-2xl" />
                <span className="text-xs">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;