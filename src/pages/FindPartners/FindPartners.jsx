import React, { useState, useEffect } from 'react';
import PageLoader from '../../components/Spinner/PageLoader';
import PartnerCard from '../../components/PartnerCard/PartnerCard'; 
import { getPartners } from '../../services/api';
import { Search, ChevronDown, Filter, SlidersHorizontal } from 'lucide-react';

const FindPartners = () => {
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]); 
  const [displayedPartners, setDisplayedPartners] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('rating-desc');
  const [filterLevel, setFilterLevel] = useState('All');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Helper function to get experience level order for sorting
  const getLevelOrder = (level) => {
    const levelMap = {
      'Beginner': 1,
      'Intermediate': 2,
      'Advanced': 3,
      'Expert': 4
    };
    return levelMap[level] || 0;
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const data = await getPartners();
        setPartners(data);
        setDisplayedPartners(data); 
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

  useEffect(() => {
    let processedPartners = [...partners];
    
    // 1. Search Filter (by Subject)
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      processedPartners = processedPartners.filter(partner => {
        return partner.subject?.toLowerCase().includes(searchLower);
      });
    }

    // 2. Level Filter
    if (filterLevel !== 'All') {
       processedPartners = processedPartners.filter(partner => partner.level === filterLevel);
    }

    // 3. Sorting
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
      case 'level-asc':
        processedPartners.sort((a, b) => getLevelOrder(a.level) - getLevelOrder(b.level));
        break;
      case 'level-desc':
        processedPartners.sort((a, b) => getLevelOrder(b.level) - getLevelOrder(a.level));
        break;
      default:
        break;
    }

    setDisplayedPartners(processedPartners);
    setCurrentPage(1); // Reset to first page on filter change
  }, [searchTerm, sortCriteria, filterLevel, partners]);

  // Pagination Logic
  const totalPages = Math.ceil(displayedPartners.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayedPartners.slice(indexOfFirstItem, indexOfLastItem);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <div className="py-10 md:py-20 transition-colors mt-10 md:mt-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl animate-fade-in">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold font-display text-base-content mb-3">
            Find Study Partners
          </h1>
          <p className="text-base-content/60 text-lg">
            Discover students who match your learning goals and schedule.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-base-100 p-6 rounded-3xl shadow-xl border border-base-200 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            
            {/* Search - Spans larger area */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="text"
                placeholder="Search by Subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 border border-base-300 rounded-xl bg-base-100 text-base-content placeholder-base-content/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            {/* Filter Level */}
            <div className="md:col-span-3 relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter className="h-5 w-5 text-base-content/40" />
              </div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="appearance-none block w-full pl-11 pr-10 py-3.5 border border-base-300 rounded-xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-base-content/40" />
              </div>
            </div>

            {/* Sort */}
            <div className="md:col-span-4 relative">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SlidersHorizontal className="h-5 w-5 text-base-content/40" />
              </div>
              <select
                value={sortCriteria}
                onChange={(e) => setSortCriteria(e.target.value)}
                className="appearance-none block w-full pl-11 pr-10 py-3.5 border border-base-300 rounded-xl bg-base-100 text-base-content focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all cursor-pointer"
              >
                <option value="rating-desc">Highest Rating</option>
                <option value="rating-asc">Lowest Rating</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="level-asc">Level (Low-High)</option>
                <option value="level-desc">Level (High-Low)</option>
              </select>
               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-base-content/40" />
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 px-2 flex justify-between items-center text-sm font-medium text-base-content/60">
          <span>Showing {currentItems.length} of {displayedPartners.length} results</span>
          {currentPage > 1 && <button onClick={() => setCurrentPage(1)} className="text-primary hover:underline">Reset Page</button>}
        </div>

        {/* Partners Grid */}
        {displayedPartners.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentItems.map((partner) => (
                <div key={partner._id || partner.uid || partner.name} className="h-full">
                  <PartnerCard partner={partner} />
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12 gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-base-100 border border-base-300 hover:bg-base-200 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base-content"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                      currentPage === i + 1
                        ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold'
                        : 'bg-base-100 border border-base-300 hover:bg-base-200 hover:text-primary text-base-content'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-base-100 border border-base-300 hover:bg-base-200 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-base-content"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-24 bg-base-100 rounded-3xl border border-dashed border-base-300">
             <div className="w-20 h-20 bg-base-200/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search size={32} className="text-base-content/30" />
             </div>
            <h3 className="text-2xl font-bold text-base-content mb-2 font-display">No partners found</h3>
            <p className="text-base-content/60 text-lg max-w-md mx-auto mb-8">
              We couldn't find any partners matching your current filters. Try generating a broader search.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setFilterLevel('All');}}
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindPartners;