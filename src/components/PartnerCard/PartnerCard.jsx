import React from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Clock } from "lucide-react";

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

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
    <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
      <div className="p-6 flex flex-col flex-grow">
        {/* Card Header: Avatar and Name */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative">
            {/* Avatar */}
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-white shadow-lg shadow-primary/20 overflow-hidden`}
            >
              {image ? (
                <LazyLoadImage
                  src={image}
                  alt={name}
                  effect="blur"
                  className="w-full h-full rounded-full object-cover border-2 border-base-100"
                  wrapperClassName="w-full h-full flex items-center justify-center"
                />
              ) : (
                <span className="text-xl font-bold font-display">{getInitials(name)}</span>
              )}
            </div>
            {/* Status Badge */}
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-base-100 ${
                isOnline ? "bg-green-500" : "bg-base-300"
              }`}
              title={activeStatus}
            ></span>
          </div>
          {/* Name and Subject */}
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-lg text-base-content truncate font-display"
              title={name}
            >
              {name}
            </h3>
            <p
              className="text-sm text-primary font-medium truncate bg-primary/5 inline-block px-2 py-0.5 rounded-md mt-1"
              title={subject}
            >
              {subject}
            </p>
          </div>
        </div>

        {/* Card Body: Details */}
        <div className="space-y-3 mb-6 flex-grow">
          {/* Rating and Level */}
          <div className="flex items-center justify-between text-sm">
             <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-600 px-2.5 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{rating.toFixed(1)}</span>
             </div>
             <span className="text-xs font-semibold uppercase tracking-wider text-base-content/50 bg-base-200 px-2 py-1 rounded-md">{level}</span>
          </div>

          <div className="pt-3 space-y-2 border-t border-base-200/50">
            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <MapPin className="w-4 h-4 text-primary/70" />
              <span className="truncate" title={location}>
                {location}
              </span>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Clock className="w-4 h-4 text-primary/70" />
              <span className="truncate" title={availability}>
                {availability}
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer: Button */}
        <div className="mt-auto pt-4">
          <Link
            to={`/partner/${_id}`}
            className="block w-full text-center px-4 py-3 bg-base-100 text-primary font-bold rounded-xl border-2 border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-primary/30 active:scale-95"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PartnerCard;
