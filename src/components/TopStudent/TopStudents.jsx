import React, { useState, useEffect } from 'react';
import { getPartners } from '../../services/api';
import PartnerCard from '../PartnerCard/PartnerCard';
import Spinner from '../Spinner/Spinner'; // Loading spinner import
import { Link } from 'react-router-dom';

const TopStudents = () => {
  const [topStudents, setTopStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopStudents = async () => {
      try {
        const allPartners = await getPartners();
        
        // Rating onujayi sort kora (beshi theke kom)
        const sortedPartners = [...allPartners].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        
        // Prothom 3 jon-ke neya
        const top3 = sortedPartners.slice(0, 3);
        
        setTopStudents(top3);
      } catch (error) {
        console.error('Error fetching top students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopStudents();
  }, []);

  return (
    <section className="container mx-auto px-4 py-12 lg:py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-[#300A91] dark:text-purple-400 mb-4">
          Meet Our Top Students
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with our highest-rated study partners
        </p>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-10">
          <Spinner size="lg" />
        </div>
      )}

      {/* Top Students Grid */}
      {!loading && topStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {topStudents.map((partner) => (
            <PartnerCard key={partner._id || partner.uid} partner={partner} />
          ))}
        </div>
      )}
      
      {/* View All Button (Optional) */}
      {!loading && (
           <div className="text-center mt-12">
           <Link
             to="/findpartners"
             className="inline-block px-8 py-3 bg-[#300A91] dark:bg-purple-600 text-white font-semibold rounded-full hover:bg-[#3C0AA4] dark:hover:bg-purple-700 transition-colors shadow-lg"
           >
             View All Partners
           </Link>
         </div>
      )}

      {/* No Students Found */}
      {!loading && topStudents.length === 0 && (
         <div className="text-center py-10">
          <p className="text-gray-600 dark:text-gray-300">No top students available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default TopStudents;