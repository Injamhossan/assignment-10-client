import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Link as LinkIcon } from 'lucide-react';
import NavLogo from '../../assets/StudyMate.png';
// import PageLoader from '../../components/Spinner/PageLoader'; 
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [loading, setLoading] = useState(false); // Managed by auth state mostly, avoiding internal loading state conflict
  // const [loading, setLoading] = useState(true); // Original loading was a bit redundant if auth context handles it
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Safe destructure in case mock context needed
  const { register, googleSignIn, user } = useAuth() || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validatePassword = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain an uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain a lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain a number';
    return '';
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (formData.photoURL && !/^https?:\/\/.+/.test(formData.photoURL)) {
      newErrors.photoURL = 'Please enter a valid URL (start with http:// or https://)';
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      if(register) await register(formData.email, formData.password, formData.name, formData.photoURL);
      
      setFormData({
        name: '',
        email: '',
        photoURL: '',
        password: '',
        confirmPassword: '',
      });
      setErrors({});
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        if (error.response.data.msg.includes('Email already registered')) {
          setErrors({ email: 'This email is already registered.' });
        } else {
          setErrors({ form: error.response.data.msg });
        }
      } else {
        setErrors({ form: 'Registration failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      if(googleSignIn) await googleSignIn();
      navigate('/');
    } catch (error) {
      console.error('Google registration error:', error);
      setErrors({ form: 'Google Sign-in failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center transition-colors">
      <div className="max-w-md w-full space-y-8 animate-fade-in">
        {/* Logo and Header */}
        <div className="text-center">
          <Link to="/" className="inline-block mb-2 transform hover:scale-105 transition-transform">
             <h1 className="text-4xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">StudyMate</h1>
          </Link>
          <h2 className="mt-4 text-3xl font-bold text-base-content">
            Create Account
          </h2>
          <p className="mt-2 text-base-content/60">
            Join StudyMate and start your learning journey
          </p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-base-100 rounded-3xl shadow-xl p-8 border border-base-200">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* --- General Form Error --- */}
            {errors.form && <p className="p-3 bg-red-100 text-red-600 rounded-lg text-sm text-center font-medium">{errors.form}</p>}

            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-base-content mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="John Doe"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.name ? 'border-red-500' : 'border-base-300'
                  }`}
                  required
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-base-content mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="your.email@example.com"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.email ? 'border-red-500' : 'border-base-300'
                  }`}
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
            </div>
            
            {/* Photo URL (Optional) */}
            <div>
              <label htmlFor="photoURL" className="block text-sm font-semibold text-base-content mb-2">
                Photo URL (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="photoURL"
                  type="text"
                  value={formData.photoURL}
                  onChange={(e) => handleChange('photoURL', e.target.value)}
                  placeholder="https://example.com/image.png"
                  className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.photoURL ? 'border-red-500' : 'border-base-300'
                  }`}
                />
              </div>
              {errors.photoURL && <p className="mt-1 text-xs text-red-500 font-medium">{errors.photoURL}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-base-content mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.password ? 'border-red-500' : 'border-base-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
              <p className="mt-1 text-xs text-base-content/60">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-base-content mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  className={`block w-full pl-10 pr-10 py-3 border rounded-xl bg-base-200/50 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all ${
                    errors.confirmPassword ? 'border-red-500' : 'border-base-300'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-base-content/40 hover:text-base-content transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3.5 px-4 rounded-xl font-bold hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all shadow-lg hover:shadow-primary/30 mt-6 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-base-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-base-100 text-base-content/60">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Register Button */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={loading}
              className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-base-300 rounded-xl bg-base-100 text-base-content font-semibold hover:bg-base-200 focus:outline-none focus:ring-2 focus:ring-base-300 transition-all disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
          </div>

          {/* Login Link */}
          <p className="mt-8 text-center text-sm text-base-content/60">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:underline font-bold"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;