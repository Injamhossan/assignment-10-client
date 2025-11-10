import React, { useState, useEffect } from 'react';
import PageLoader from '../../components/Spinner/PageLoader';
// PartnerCard component-er path thik ache kina check korben
import PartnerCard from '../../components/PartnerCard/PartnerCard'; 
import { getPartners } from '../../services/api';
import { Search, ChevronDown } from 'lucide-react';

const FindPartners = () => {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]); // Master list from API
  const [displayedPartners, setDisplayedPartners] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('rating-desc'); // Default sort

  // Fetch partners from API on component mount
  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        setPartners(data);
        setDisplayedPartners(data); // Initially, display all
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
        setDisplayedPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  // Handle filtering and sorting whenever search or sort criteria change
  useEffect(() => {
    let processedPartners = [...partners];

    // 1. Filter based on searchTerm
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      processedPartners = processedPartners.filter(partner => {
        // Check all relevant fields for a match
        return (
          partner.name?.toLowerCase().includes(searchLower) ||
          partner.location?.toLowerCase().includes(searchLower) ||
          (partner.education?.toLowerCase().includes(searchLower)) || // Assuming server adds this
          (partner.interests?.toLowerCase().includes(searchLower)) || // Assuming server adds this
          (partner.bio?.toLowerCase().includes(searchLower)) || // Assuming server adds this
          partner.subject?.toLowerCase().includes(searchLower) || // Added subject
          partner.level?.toLowerCase().includes(searchLower) // Added level
        );
      });
    }

    // 2. Sort the filtered list
    switch (sortCriteria) {
      case 'rating-desc':
        processedPartners.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'rating-asc':
        processedPartners.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
      case 'name-asc':
        processedPartners.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        processedPartners.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Do nothing, keep original (filtered) order
    }

    setDisplayedPartners(processedPartners);
  }, [searchTerm, sortCriteria, partners]);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Find Study Partners
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Discover students who match your learning goals
          </p>
        </div>

        {/* Filter Bar (Search + Sort) */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by subject, name, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-11 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500 transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative w-full md:w-auto md:min-w-[200px]">
            <select
              value={sortCriteria}
              onChange={(e) => setSortCriteria(e.target.value)}
              className="appearance-none block w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#300A91] dark:focus:ring-purple-500 transition-colors"
            >
              <option value="rating-desc">Highest Rating</option>
              <option value="rating-asc">Lowest Rating</option>
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Showing {displayedPartners.length} study partner{displayedPartners.length !== 1 ? 's' : ''}
        </div>

        {/* Partners Grid */}
        {displayedPartners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPartners.map((partner) => (
              <PartnerCard key={partner._id || partner.uid || partner.name} partner={partner} />
            ))}

            
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-inner border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              {searchTerm ? 'No partners found matching your search.' : 'No partners available at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartners;