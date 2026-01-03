
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createPartner, updatePartnerProfile } from '../../services/api'; 
import PageLoader from '../../components/Spinner/PageLoader';
import { toast } from '../../utils/toastManager';
import { User, Mail, Book, BarChart, Wifi, MapPin, Clock, Info, Image as ImageIcon } from 'lucide-react';

const CreatePartner = () => {
  const { user, loading: authLoading, partnerData, checkAndSetPartnerData } = useAuth();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    subject: '',
    level: '',
    studyMode: '',
    location: '',
    availability: '',
    about: '', 
  });

  useEffect(() => {
    if (authLoading) return; 
    
    if (!user) {
      navigate('/login');
      toast.info('Please log in to create or edit a profile.');
      return;
    }

    if (partnerData) {
      setFormData({
        name: partnerData.name || '',
        email: user.email, 
        image: partnerData.image || '',
        subject: partnerData.subject || '',
        level: partnerData.level || '',
        studyMode: partnerData.activeStatus || '', 
        location: partnerData.location || '',
        availability: partnerData.availability || '',
        about: partnerData.about || '',
      });
    } 
    else if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
        image: user.photoURL || '',
      }));
    }
  }, [user, partnerData, authLoading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { name, subject, level, studyMode, location, availability, email } = formData;
    if (!name || !subject || !level || !studyMode || !location || !availability || !email) {
      toast.error('Please fill in all required fields.');
      return;
    }
    
    setFormLoading(true);
    try {
      const partnerDataForApi = {
        email: formData.email, 
        name: formData.name,
        image: formData.image,
        subject: formData.subject,
        level: formData.level,
        activeStatus: formData.studyMode, 
        location: formData.location,
        availability: formData.availability,
        about: formData.about,
        rating: partnerData?.rating || (Math.random() * (5 - 3.5) + 3.5).toFixed(1), 
      };

      if (partnerData) {
        await updatePartnerProfile(partnerData._id, partnerDataForApi);
      } else {
        await createPartner(partnerDataForApi);
      }

      await checkAndSetPartnerData(user.email);
      
      navigate('/findpartners'); 

    } catch (error) {
      
      console.error('Error in handleSubmit:', error);
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return <PageLoader />;
  }

  return (
    <div className="py-8 transition-colors">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-base-content mb-2">
            {partnerData ? 'Update Your Profile' : 'Create Your Profile'}
          </h1>
          <p className="text-base-content/60">
            {partnerData ? 'Update your details to connect with partners' : 'Share your details to connect with partners'}
          </p>
        </div>

        {/* Profile Form Card */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-8 border border-base-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-base-content mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-base-content mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  disabled 
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200 text-base-content/60 cursor-not-allowed"
                />
              </div>
            </div>
            
            {/* Profile Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-base-content mb-2">
                Profile Image URL
              </label>
              <div className="relative">
                <ImageIcon className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="e.g., https://your-image.com/profile.png"
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-base-content mb-2">
                Subject *
              </label>
              <div className="relative">
                <Book className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Experience Level */}
              <div>
                <label htmlFor="level" className="block text-sm font-semibold text-base-content mb-2">
                  Experience Level *
                </label>
                <div className="relative">
                  <BarChart className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="level"
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select experience level</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Study Mode */}
              <div>
                <label htmlFor="studyMode" className="block text-sm font-semibold text-base-content mb-2">
                  Study Mode *
                </label>
                <div className="relative">
                  <Wifi className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    id="studyMode"
                    name="studyMode"
                    value={formData.studyMode}
                    onChange={handleChange}
                    className="appearance-none block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content focus:outline-none focus:ring-2 focus:ring-primary transition-all cursor-pointer"
                    required
                  >
                    <option value="" disabled>Select study mode</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-base-content mb-2">
                Location *
              </label>
              <div className="relative">
                <MapPin className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, State"
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Availability */}
            <div>
              <label htmlFor="availability" className="block text-sm font-semibold text-base-content mb-2">
                Availability *
              </label>
              <div className="relative">
                <Clock className="h-5 w-5 text-base-content/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="availability"
                  name="availability"
                  type="text"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Weekdays 6-9 PM, Weekends"
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Bio (Optional) */}
            <div>
              <label htmlFor="about" className="block text-sm font-semibold text-base-content mb-2">
                Bio (Optional)
              </label>
              <div className="relative">
                <Info className="h-5 w-5 text-base-content/40 absolute left-3 top-4" />
                <textarea
                  id="about"
                  name="about"
                  rows="4"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell us about yourself and your study goals..."
                  className="block w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-200/30 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-bold hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {formLoading ? (partnerData ? 'Updating Profile...' : 'Creating Profile...') : (partnerData ? 'Update Profile' : 'Create Profile')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePartner;