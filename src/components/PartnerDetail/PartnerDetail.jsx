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
    <div className="py-10 md:py-20 transition-colors mt-3 md:mt-10">
      <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
        
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-base-content/60 hover:text-primary font-medium transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Partners
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Profile Card */}
          <div className="lg:w-1/3 w-full">
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 p-8 text-center sticky top-24">
              {/* Avatar */}
              <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white mx-auto mb-6 shadow-2xl shadow-primary/30">
                {partner.image ? (
                  <img src={partner.image} alt={partner.name} className="w-full h-full rounded-full object-cover border-4 border-base-100" />
                ) : (
                  <span className="text-4xl font-display font-bold">{getInitials(partner.name)}</span>
                )}
                {isOnline && (
                  <span className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-base-100 rounded-full"></span>
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-base-content mb-2 font-display">{partner.name}</h2>
              <p className="text-lg text-primary font-medium mb-6 bg-primary/5 inline-block px-4 py-1 rounded-full">{partner.subject}</p>

              <div className="space-y-4 text-left bg-base-200/50 p-6 rounded-2xl">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 font-medium">Experience</span>
                  <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm font-bold">
                    {partner.level || 'Beginner'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 font-medium">Study Mode</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${isOnline ? 'bg-green-500/10 text-green-600' : 'bg-base-300 text-base-content/60'}`}>
                    {partner.activeStatus || 'Offline'}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 font-medium">Rating</span>
                  <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{partner.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: About and Actions */}
          <div className="lg:w-2/3 w-full">
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-200 p-8 h-full flex flex-col">
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-base-content mb-4 flex items-center gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  About Me
                </h3>
                <p className="text-base-content/70 leading-relaxed text-lg">
                  {partner.about || 'No bio provided.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-base-200/50 p-5 rounded-2xl border border-base-200">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-2 uppercase tracking-wide">
                    <MapPin className="w-4 h-4" />
                    Location
                  </h4>
                  <p className="text-base-content font-medium text-lg">{partner.location || 'Not specified'}</p>
                </div>
                <div className="bg-base-200/50 p-5 rounded-2xl border border-base-200">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-primary mb-2 uppercase tracking-wide">
                    <Clock className="w-4 h-4" />
                    Availability
                  </h4>
                  <p className="text-base-content font-medium text-lg">{partner.availability || 'Not specified'}</p>
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-base-200">
                <form onSubmit={hasSentRequest ? handleCancelRequest : handleSendRequest}>
                  {!hasSentRequest && (
                    <div className="mb-6">
                      <label className="block text-sm font-bold text-base-content mb-3 ml-1">
                        Send a Message <span className="text-base-content/40 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows="3"
                        className="w-full px-4 py-3 border border-base-300 rounded-xl bg-base-200/30 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        placeholder="Hi! I noticed we're both studying..."
                      />
                    </div>
                  )}

                  {hasSentRequest ? (
                    <button
                      type="submit"
                      className="w-full py-4 bg-red-500/10 text-red-500 font-bold rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 border border-red-500/20 group"
                    >
                      <XCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                      Cancel Request
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-primary/30 hover:-translate-y-1"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Send Connection Request
                    </button>
                  )}
                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PartnerDetail;