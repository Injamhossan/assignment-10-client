import React, { useState, useEffect } from 'react';
import PageLoader from '../../components/Spinner/PageLoader';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { getPartnerById } from '../../services/api'; 
import ConnectionCard from '../../components/ConnectionCard/ConncectionCard';


const MyConnections = () => {
  const { user, userData, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [sentPartners, setSentPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchSentPartnerDetails = async () => {
      if (userData && userData.sentRequests && userData.sentRequests.length > 0) {
        try {
          const partnerDetailsPromises = userData.sentRequests.map(id => 
            getPartnerById(id)
          );
          
          const partners = await Promise.all(partnerDetailsPromises);
          
          const validPartners = partners.filter(p => p); 
          
          setSentPartners(validPartners);
        } catch (error) {
          console.error('Failed to fetch partner details:', error);
          setSentPartners([]);
        }
      } else {
        setSentPartners([]); // Kono request pathano hoyni
      }
      setLoading(false);
    };

    fetchSentPartnerDetails();
    
  }, [user, userData, authLoading, navigate]);


  // --- PORIBORTON: EI FUNCTION-TI ADD KORA HOYECHE ---
  // Ei function-ti ConnectionCard theke call hobe ebong UI update korbe
  const handleCancelSuccess = (cancelledPartnerId) => {
    setSentPartners(prevPartners =>
      prevPartners.filter(partner => partner._id !== cancelledPartnerId)
    );
  };
  // --- PORIBORTON SHESH ---


  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-[#300A91] dark:text-purple-400 mb-4">
            Please Log In
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            You need to be logged in to view your connections.
          </p>
          <Link
            to="/login"
            className="px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="container mx-auto px-4 max-w-4xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            My Connections
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your study partner requests and connections
          </p>
        </div>
        
        {/* Pending Sent Requests Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Pending Sent Requests ({sentPartners.length})
          </h2>
          
          {sentPartners.length > 0 ? (
            <div className="space-y-4">
              {sentPartners.map(partner => (
                <ConnectionCard
                  key={partner._id} 
                  partner={partner}
                  status="pending" 
                  sentDate={partner.createdAt || new Date().toISOString()}
                  
                  // --- PORIBORTON: EI PROP-TI PASS KORA HOYECHE ---
                  onCancelSuccess={handleCancelSuccess}
                />
              ))}
            </div>
          ) : (
            // Jodi kono request na thake
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">
                You have not sent any connection requests yet.
              </p>
              <Link
                to="/findpartners"
                className="mt-4 inline-block px-6 py-2 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Find Partners
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MyConnections;