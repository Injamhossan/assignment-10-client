import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, Edit2, X, Trash2 } from 'lucide-react'; 
import PageLoader from '../../components/Spinner/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../services/api'; 

const MyProfile = () => {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUserProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    bio: '',
    phone: '',
    location: '',
    interests: '',
    education: '',
  });

  const [dbUserData, setDbUserData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        // Get user data from Firebase
        const firebaseData = {
          name: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || '',
        };

        // Try to get additional data from MongoDB
        try {
         const dbData = await getMyProfile();
          setDbUserData(dbData);
          setFormData({
            name: dbData.name || firebaseData.name,
            email: dbData.email || firebaseData.email,
            photoURL: dbData.photoURL || firebaseData.photoURL,
            bio: dbData.bio || '',
            phone: dbData.phone || '',
            location: dbData.location || '',
            interests: dbData.interests || '',
            education: dbData.education || '',
          });
        } catch (error) {
          setFormData({
            name: firebaseData.name,
            email: firebaseData.email,
            photoURL: firebaseData.photoURL,
            bio: '',
            phone: '',
            location: '',
            interests: '',
            education: '',
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await updateUserProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    // Popup confirmation
    if (window.confirm('Are you sure you want to delete your account? This action is permanent and cannot be undone.')) {
      setFormLoading(true);
      try {
        await deleteAccount();
        navigate('/'); 
      } catch (error) {
        
        console.error('Delete account failed (in component):', error);
        setFormLoading(false);
      }
    }
  };


  const handleCancel = () => {
    // Reset form data
    if (dbUserData) {
      setFormData({
        name: dbUserData.name || user?.displayName || '',
        email: dbUserData.email || user?.email || '',
        photoURL: dbUserData.photoURL || user?.photoURL || '',
        bio: dbUserData.bio || '',
        phone: dbUserData.phone || '',
        location: dbUserData.location || '',
        interests: dbUserData.interests || '',
        education: dbUserData.education || '',
      });
    } else {
      setFormData({
        name: user?.displayName || '',
        email: user?.email || '',
        photoURL: user?.photoURL || '',
        bio: '',
        phone: '',
        location: '',
        interests: '',
        education: '',
      });
    }
    setIsEditing(false);
  };

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#300A91] dark:text-purple-400 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            View and update your profile information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="relative">
                {formData.photoURL ? (
                  <img
                    src={formData.photoURL}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#300A91] dark:border-purple-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-[#300A91] dark:bg-purple-600 flex items-center justify-center border-4 border-[#300A91] dark:border-purple-500">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {formData.name || 'No Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  {formData.email}
                </p>
              </div>
              
              {/* BUTTON GROUP UPDATE */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                {!isEditing ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      disabled={formLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-[#300A91] dark:bg-purple-600 text-white rounded-lg hover:bg-[#3C0AA4] dark:hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={formLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={formLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

            </div>

            {/* Editable Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {formData.name || 'Not set'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email
                </label>
                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {formData.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                    placeholder="+1 234 567 8900"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {formData.phone || 'Not set'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {formData.location || 'Not set'}
                  </p>
                )}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Education
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                    placeholder="University, Degree"
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {formData.education || 'Not set'}
                  </p>
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Interests
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                    placeholder="Reading, Coding, Music..."
                  />
                ) : (
                  <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                    {formData.interests || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="px-4 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white min-h-[100px]">
                  {formData.bio || 'No bio yet'}
                </p>
              )}
            </div>

            {/* Profile Picture URL */}
            {isEditing && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={(e) => handleChange('photoURL', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            )}

            {/* Save Button */}
            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-3 bg-[#300A91] dark:bg-purple-600 text-white rounded-lg hover:bg-[#3C0AA4] dark:hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4" />
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;