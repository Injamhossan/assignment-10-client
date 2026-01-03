import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, Edit2, X, Trash2 } from 'lucide-react'; 
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css'; 
import PageLoader from '../../components/Spinner/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { getMyProfile } from '../../services/api';
import { toast } from 'react-toastify'; 

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
      
      // Refetch updated user data from MongoDB
      try {
        const updatedData = await getMyProfile();
        setDbUserData(updatedData);
        setFormData({
          name: updatedData.name || user?.displayName || '',
          email: updatedData.email || user?.email || '',
          photoURL: updatedData.photoURL || user?.photoURL || '',
          bio: updatedData.bio || '',
          phone: updatedData.phone || '',
          location: updatedData.location || '',
          interests: updatedData.interests || '',
          education: updatedData.education || '',
        });
      } catch (fetchError) {
        console.error('Error fetching updated profile:', fetchError);
        // Still show success even if refetch fails
      }
      
      setIsEditing(false);
      // Success toast is shown by apiUpdateUserProfile
    } catch (error) {
      console.error('Error updating profile:', error);
      // Error toast is handled in updateUserProfile
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
    <div className="py-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">
            My Profile
          </h1>
          <p className="text-base-content/60">
            View and update your profile information
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-8 border border-base-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Picture and Basic Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-base-200">
              <div className="relative">
                {formData.photoURL ? (
                  <LazyLoadImage
                    src={formData.photoURL}
                    alt="Profile"
                    effect="blur"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                    wrapperClassName="w-32 h-32 rounded-full"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20">
                    <User className="w-16 h-16 text-primary" />
                  </div>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  {formData.name || 'No Name'}
                </h2>
                <p className="text-base-content/60 flex items-center justify-center md:justify-start gap-2">
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
                      onClick={() => {
                        // Ensure form is pre-filled with latest data when entering edit mode
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
                        }
                        setIsEditing(true);
                      }}
                      disabled={formLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-primary/20"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Profile
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={formLoading}
                      className="w-full sm:w-auto px-4 py-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                    className="w-full sm:w-auto px-4 py-2 bg-base-200 text-base-content/70 rounded-lg hover:bg-base-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
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
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    required
                  />
                ) : (
                  <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content">
                    {formData.name || 'Not set'}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Email
                </label>
                <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content/70">
                  {formData.email}
                </p>
                <p className="text-xs text-base-content/40 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="+1 234 567 8900"
                  />
                ) : (
                  <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content">
                    {formData.phone || 'Not set'}
                  </p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="City, Country"
                  />
                ) : (
                  <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content">
                    {formData.location || 'Not set'}
                  </p>
                )}
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Education
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.education}
                    onChange={(e) => handleChange('education', e.target.value)}
                    className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="University, Degree"
                  />
                ) : (
                  <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content">
                    {formData.education || 'Not set'}
                  </p>
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Interests
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.interests}
                    onChange={(e) => handleChange('interests', e.target.value)}
                    className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Reading, Coding, Music..."
                  />
                ) : (
                  <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content">
                    {formData.interests || 'Not set'}
                  </p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-base-content mb-2">
                Bio
              </label>
              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="px-4 py-3 bg-base-200/50 rounded-lg text-base-content min-h-[100px]">
                  {formData.bio || 'No bio yet'}
                </p>
              )}
            </div>

            {/* Profile Picture URL */}
            {isEditing && (
              <div>
                <label className="block text-sm font-semibold text-base-content mb-2">
                  Profile Picture URL
                </label>
                <input
                  type="url"
                  value={formData.photoURL}
                  onChange={(e) => handleChange('photoURL', e.target.value)}
                  className="w-full px-4 py-3 border border-base-300 rounded-lg bg-base-200/50 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all"
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
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
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