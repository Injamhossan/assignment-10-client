// src/components/ConnectionCard/ConncectionCard.jsx

import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const getInitials = (name) => {
  if (!name) return 'S';
  const names = name.split(' ');
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

const ConnectionCard = ({ partner, status = 'pending', sentDate = 'N/A', onCancelSuccess }) => {
  const { cancelRequest } = useAuth(); 

  // Guard clause to prevent rendering if partner data is missing
  if (!partner) {
    return null; // Or a loading/error state
  }

  const ConnectionCard = ({ partner, status = 'pending', sentDate = 'N/A', onCancelSuccess }) => {
  const { cancelRequest } = useAuth(); 

  const handleCancel = async () => {
    if (window.confirm(`Are you sure you want to cancel your request to ${partner.name}?`)) {
      
      const toastId = toastId.loading("Cancelling request..."); // লোডিং টোস্ট

      try {
        await cancelRequest(partner._id);
        
        // সফল হলে প্যারেন্টকে জানাবে
        onCancelSuccess && onCancelSuccess(partner._id);
        
        toast.success("Request successfully cancelled", { id: toastId }); // 2. সফল মেসেজ

      } catch (error) {
        console.error('Cancel request error:', error);
        
        // 3. এরর মেসেজ দেখান
        const errorMessage = error.response?.data?.message || "Failed to cancel request";
        toast.error(errorMessage, { id: toastId }); 
      }
    }
  };

  const isAccepted = status.toLowerCase() === 'accepted';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
      {/* Partner Info */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isAccepted ? 'bg-cyan-600' : 'bg-purple-600 dark:bg-purple-500'} text-white`}>
          {partner.image ? (
            <img src={partner.image} alt={partner.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <span className="text-xl font-bold">{getInitials(partner.name)}</span>
          )}
        </div>
        
        {/* Name, Subject, and Status */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {partner.name || 'Study Partner'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {partner.subject || 'Not specified'}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isAccepted 
                ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
            }`}>
              {status}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              • Sent on {new Date(sentDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        
        {/* Delete/Cancel Button */}
        <button 
          title="Cancel Request"
          onClick={handleCancel}
          className="p-2 rounded-md text-red-600 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ConnectionCard;