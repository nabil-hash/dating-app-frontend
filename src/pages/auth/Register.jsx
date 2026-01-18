import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
    first_name: '',
    date_of_birth: '',
    gender: '',
    city: '',
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

    if (!formData.first_name)
      newErrors.first_name = 'Le prénom est obligatoire';

    if (!formData.email)
      newErrors.email = "L'email est obligatoire";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Format email invalide';

    if (!formData.password)
      newErrors.password = 'Le mot de passe est obligatoire';
    else if (formData.password.length < 8)
      newErrors.password = 'Minimum 8 caractères';

    if (formData.password !== formData.password_confirmation)
      newErrors.password_confirmation = 'Les mots de passe ne correspondent pas';

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date de naissance obligatoire';
    } else {
      const age =
        new Date().getFullYear() -
        new Date(formData.date_of_birth).getFullYear();
      if (age < 18)
        newErrors.date_of_birth = 'Vous devez avoir au moins 18 ans';
    }

    if (!formData.gender)
      newErrors.gender = 'Le genre est obligatoire';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      toast.success('Bienvenue sur Dating App ');
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
          <h1 className="text-4xl font-extrabold text-white">
            Dating App
          </h1>
          <p className="text-white/80 mt-2">
            Créez votre compte et commencez votre aventure amoureuse !
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/30 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            Inscription
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Prénom"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Jean"
              error={errors.first_name}
              required
            />

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
              placeholder="Minimum 8 caractères"
              error={errors.password}
              required
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="password_confirmation"
              value={formData.password_confirmation}
              onChange={handleChange}
              placeholder="••••••••"
              error={errors.password_confirmation}
              required
            />

            <Input
              label="Date de naissance"
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              error={errors.date_of_birth}
              required
            />

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Genre <span className="text-red-300">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg bg-white/80 text-gray-800 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Sélectionnez</option>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
                <option value="non_binary">Non-binaire</option>
                <option value="other">Autre</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-red-300">{errors.gender}</p>
              )}
            </div>

            <Input
              label="Ville"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Lomé"
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={isLoading}
              className="transform hover:scale-[1.02] transition-all"
            >
              {isLoading ? <LoadingSpinner size="sm" /> : "S'inscrire "}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white/80">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-semibold text-white hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Register;
