import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return "S";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name[0].toUpperCase();
};

const PartnerCard = ({ partner }) => {
  const {
    _id,
    image,
    name = "Study Partner",
    subject = "Not specified",
    activeStatus = "Offline",
    rating = 0,
    level = "Beginner",
    location = "Not specified",
    availability = "Not specified",
  } = partner;

  const isOnline = activeStatus.toLowerCase() === "online";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="p-6">
        {/* Card Header: Avatar and Name */}
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            {/* Avatar */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isOnline ? "bg-purple-600" : "bg-purple-600 dark:bg-purple-500"
              } text-white`}
            >
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold">{getInitials(name)}</span>
              )}
            </div>
            {/* Status Badge */}
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
              title={activeStatus}
            ></span>
          </div>
          {/* Name and Subject */}
          <div className="flex-1">
            <h3
              className="font-bold text-lg text-gray-900 dark:text-white truncate"
              title={name}
            >
              {name}
            </h3>
            <p
              className="text-sm text-gray-600 dark:text-gray-400"
              title={subject}
            >
              {subject}
            </p>
          </div>
        </div>

        {/* Card Body: Details */}
        <div className="space-y-3 mb-6">
          {/* Rating and Level */}
          <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <Star className="w-4 h-4 text-yellow-500" fill="currentColor" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-gray-400 dark:text-gray-500">•</span>
            <span>{level}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4" />
            <span className="truncate" title={location}>
              {location}
            </span>
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span className="truncate" title={availability}>
              {availability}
            </span>
          </div>
        </div>

        {/* Card Footer: Button */}
        <div>
          <Link
            to={`/partner/${_id}`}
            className="block w-full text-center px-4 py-2.5  bg-[#300A91] dark:bg-purple-600 text-white font-semibold rounded-lg hover:bg-cyan-700 transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
