import React from 'react';
import { MapPin, BookOpen, Users, Mail } from 'lucide-react';

const PartnerCard = ({ partner }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {partner.photoURL ? (
            <img
              src={partner.photoURL}
              alt={partner.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#300A91] dark:border-purple-500"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#300A91] dark:bg-purple-600 flex items-center justify-center border-2 border-[#300A91] dark:border-purple-500">
              <span className="text-2xl font-bold text-white">
                {partner.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {partner.name || 'Anonymous'}
            </h3>
            {partner.location && (
              <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                <MapPin className="w-4 h-4" />
                {partner.location}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bio */}
      {partner.bio && (
        <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
          {partner.bio}
        </p>
      )}

      {/* Details */}
      <div className="space-y-2 mb-4">
        {partner.education && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <BookOpen className="w-4 h-4" />
            <span>{partner.education}</span>
          </div>
        )}
        {partner.interests && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Users className="w-4 h-4" />
            <span>{partner.interests}</span>
          </div>
        )}
      </div>

      {/* Contact Button */}
      {partner.email && (
        <button className="w-full mt-4 px-4 py-2 bg-[#300A91] dark:bg-purple-600 text-white rounded-lg hover:bg-[#3C0AA4] dark:hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
          <Mail className="w-4 h-4" />
          Contact
        </button>
      )}
    </div>
  );
};

export default PartnerCard;




