import React, { useState, useEffect } from 'react';
import PageLoader from '../../components/Spinner/PageLoader';
import PartnerCard from '../../components/PartnerCard/PartnerCard';
import { getPartners } from '../../services/api';
import { Search } from 'lucide-react';

const FindPartners = () => {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        setPartners(data);
        setFilteredPartners(data);
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
        setFilteredPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPartners(partners);
    } else {
      const filtered = partners.filter(partner => {
        const searchLower = searchTerm.toLowerCase();
        return (
          partner.name?.toLowerCase().includes(searchLower) ||
          partner.location?.toLowerCase().includes(searchLower) ||
          partner.education?.toLowerCase().includes(searchLower) ||
          partner.interests?.toLowerCase().includes(searchLower) ||
          partner.bio?.toLowerCase().includes(searchLower)
        );
      });
      setFilteredPartners(filtered);
    }
  }, [searchTerm, partners]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#300A91] dark:text-purple-400 mb-2">
            Find Study Partners
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Browse and connect with study partners from around the world
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by name, location, education, or interests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500 focus:border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Partners Grid */}
        {filteredPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner) => (
              <PartnerCard key={partner._id || partner.uid} partner={partner} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {searchTerm ? 'No partners found matching your search.' : 'No partners available at the moment.'}
            </p>
          </div>
        )}

        {/* Results Count */}
        {partners.length > 0 && (
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
            Showing {filteredPartners.length} of {partners.length} partners
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartners;

