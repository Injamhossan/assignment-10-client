import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPartnerById } from '../../services/api';
import PageLoader from '../../components/Spinner/PageLoader';
import { ArrowLeft, Star, MapPin, Clock, Users, Award, Wifi, MessageSquare, XCircle, CheckCircle } from 'lucide-react'; // <-- Notun Icon
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext'; // <-- AuthContext Import

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return 'S';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

const PartnerDetail = () => {
  const { id } = useParams(); // URL theke partner ID neyar jonno
  const navigate = useNavigate(); // "Back" button-er jonno
  
  // --- NOTUN AUTH STATE (START) ---
  const { user, userData, sendRequest, cancelRequest } = useAuth();
  const [hasSentRequest, setHasSentRequest] = useState(false);
  // --- NOTUN AUTH STATE (END) ---

  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchPartner = async () => {
      if (!id) {
        setError('No partner ID provided.');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await getPartnerById(id);
        if (data) {
          setPartner(data);
        } else {
          setError('Partner not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch partner data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id]);

  // --- NOTUN EFFECT (START) ---
  // Check if a request has already been sent to this partner
  useEffect(() => {
    if (userData && userData.sentRequests && id) {
      // Check if the current partner's ID is in the user's sentRequests array
      const partnerObjectId = partner?._id; // 'id' URL theke asha string, partner._id o string
      setHasSentRequest(userData.sentRequests.includes(id) || userData.sentRequests.includes(partnerObjectId));
    }
  }, [userData, id, partner]);
  // --- NOTUN EFFECT (END) ---


  // --- HANLDER UPDATE (START) ---
  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to send a request.');
      navigate('/login');
      return;
    }
    
    if (!partner || !partner._id) {
      toast.error('Partner information not available.');
      return;
    }
    
    try {
      // Use partner._id to ensure we have the correct MongoDB ObjectId
      await sendRequest(partner._id);
      // Update hasSentRequest state after successful send
      setHasSentRequest(true);
    } catch (error) {
      // Error is already handled in sendRequest/sendConnectionRequest
      console.error('Failed to send request:', error);
    }
  };

  const handleCancelRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in');
      return;
    }
    
    if (!partner || !partner._id) {
      toast.error('Partner information not available.');
      return;
    }
    
    try {
      // Use partner._id to ensure we have the correct MongoDB ObjectId
      await cancelRequest(partner._id);
      // Update hasSentRequest state after successful cancel
      setHasSentRequest(false);
    } catch (error) {
      // Error is already handled in cancelRequest
      console.error('Failed to cancel request:', error);
    }
  };
  // --- HANLDER UPDATE (END) ---


  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-center px-4">
        <div>
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => navigate('/findpartners')}
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Back to Find Partners
          </button>
        </div>
      </div>
    );
  }

  if (!partner) {
    return <PageLoader />; // Or a "Not Found" component
  }

  const isOnline = partner.activeStatus?.toLowerCase() === 'online';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="container mx-auto max-w-6xl">
        
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)} // Age'r page e fire jaoyar jonno
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row lg:gap-8">

          {/* Left Column: Profile Card */}
          <div className="lg:w-1/3 w-full mb-6 lg:mb-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6 text-center">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-cyan-600 text-white mx-auto mb-4">
                {partner.image ? (
                  <img src={partner.image} alt={partner.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-5xl font-bold">{getInitials(partner.name)}</span>
                )}
              </div>
              
              {/* Name and Subject */}
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{partner.name}</h2>
              <p className="text-md text-gray-600 dark:text-gray-400 mb-6">{partner.subject}</p>

              {/* Details List */}
              <div className="space-y-4 text-left">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Experience</h4>
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium">
                    {partner.level || 'Beginner'}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">Study Mode</h4>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isOnline ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                    {partner.activeStatus || 'Offline'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{partner.rating.toFixed(1)} rating</span>
                </div>
            
              </div>
            </div>
          </div>

          {/* Right Column: About and Message */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
              {/* About Section */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {partner.about || 'No bio provided.'}
              </p>

              {/* Details: Location & Availability */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200">{partner.location || 'Not specified'}</p>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    <Clock className="w-4 h-4" />
                    Availability
                  </h4>
                  <p className="text-gray-800 dark:text-gray-200">{partner.availability || 'Not specified'}</p>
                </div>
              </div>

              {/* --- BUTTON LOGIC UPDATE (START) --- */}
              {/* Send Message Section */}
              <form onSubmit={hasSentRequest ? handleCancelRequest : handleSendRequest}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Send a Message <span className="text-sm text-gray-500 font-normal">(Optional)</span>
                </h3>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Introduce yourself and explain why you'd like to study together..."
                  disabled={hasSentRequest} // Request pathale message likhte parbe na
                />

                {hasSentRequest ? (
                  // Jodi request pathano hoye thake
                  <button
                    type="submit"
                    className="mt-4 px-8 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    Cancel Partner Request
                  </button>
                ) : (
                  // Jodi request na pathano hoy
                  <button
                    type="submit"
                    className="mt-4 px-8 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Send Partner Request
                  </button>
                )}
              </form>
              {/* --- BUTTON LOGIC UPDATE (END) --- */}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PartnerDetail;