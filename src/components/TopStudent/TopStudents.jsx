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
    <section className="container mx-auto px-4 py-20 lg:py-28 animate-fade-in">
      {/* Section Header */}
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 tracking-wider uppercase">Top Performers</span>
        <h2 className="text-4xl md:text-5xl font-bold font-display text-base-content mb-6">
          Meet Our Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Students</span>
        </h2>
        <p className="text-xl text-base-content/60">
          Connect with our highest-rated study partners and elevate your learning journey.
        </p>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-20">
          <Spinner size="lg" />
        </div>
      )}

      {/* Top Students Grid */}
      {!loading && topStudents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {topStudents.map((partner) => (
            <PartnerCard key={partner._id || partner.uid} partner={partner} />
          ))}
        </div>
      )}
      
      {/* View All Button (Optional) */}
      {!loading && (
           <div className="text-center mt-16">
           <Link
             to="/findpartners"
             className="inline-block px-10 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 hover:-translate-y-1 transition-all shadow-xl shadow-primary/30 text-lg"
           >
             View All Partners
           </Link>
         </div>
      )}

      {/* No Students Found */}
      {!loading && topStudents.length === 0 && (
         <div className="text-center py-20 bg-base-200/50 rounded-3xl">
          <p className="text-xl text-base-content/60 font-medium">No top students available at the moment.</p>
        </div>
      )}
    </section>
  );
};

export default TopStudents;