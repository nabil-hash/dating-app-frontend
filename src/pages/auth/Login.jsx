import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "L'email est obligatoire";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Format email invalide';

    if (!formData.password)
      newErrors.password = 'Le mot de passe est obligatoire';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await login(formData.email, formData.password);
    if (result.success) {
      toast.success('Connexion réussie !');
      navigate('/discover');
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-primary-500 to-purple-600 p-4">
      
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-lg mb-4 animate-pulse">
            <FaHeart className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Dating App
          </h1>
          <p className="text-white/80 mt-2">
            Trouvez votre âme sœur dès aujourd'hui !
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Connexion
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ex: hello@gmail.com"
              error={errors.email}
              required
            />

            <Input
              label="Mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password}
              required
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="mt-2 transform hover:scale-[1.02] transition-all duration-200"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : 'Se connecter'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="font-semibold text-white hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
