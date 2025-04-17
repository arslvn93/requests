import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  name: string;
  description: string;
  turnaround: string;
  icon: keyof typeof Icons;
  url: string;
  comingSoon?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  name,
  description,
  turnaround,
  icon,
  url,
  comingSoon,
}) => {
  // Get the potential component constructor from the Icons namespace
  const PotentialIcon = Icons[icon];
  // We will check if it exists before rendering and use type assertion

  const navigate = useNavigate();

  const handleServiceClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default link behavior for all clicks initially

    if (comingSoon) {
      return; // Do nothing for coming soon cards
    }

    // Check if the URL is an internal route (starts with '/')
    if (url.startsWith('/')) {
      navigate(url); // Use react-router navigation for internal routes
    } else {
      // For external URLs (Typeform, etc.), open directly in a new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <a
        href={url} // Let handleServiceClick manage navigation/opening
        onClick={handleServiceClick}
        // Removed target="_blank" - handleEmailSubmit handles new tabs for external URLs
        rel="noopener noreferrer" // Keep rel for security when external links are opened via window.open
        className={`glass-card block group p-4 sm:p-6 touch-manipulation relative
          ${comingSoon ? 'cursor-default before:absolute before:inset-0 before:bg-black/30 before:z-10 hover:before:bg-black/20 hover:border-blue-400/50' : 'active:scale-[0.98]'} will-change-transform`}
      >
        {comingSoon && (
          <div className="absolute -right-[4.5rem] top-8 rotate-45 bg-blue-500/90 py-2 px-16 text-base font-semibold text-white z-20 shadow-lg">
            Coming Soon
          </div>
        )}
      <div className="glass-gradient"></div>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        {/* Render the icon conditionally, checking existence and using type assertion */}
        {PotentialIcon ? (
          React.createElement(PotentialIcon as React.ElementType, { // Use React.createElement with type assertion
            className: `w-6 h-6 sm:w-8 sm:h-8 text-blue-400 transition-colors relative z-10 ${comingSoon ? 'opacity-40' : 'group-hover:text-blue-300'}`
          })
        ) : (
          <Icons.HelpCircle className={`w-6 h-6 sm:w-8 sm:h-8 text-gray-500 transition-colors relative z-10 ${comingSoon ? 'opacity-40' : ''}`} /> // Render fallback
        )}
      </div>
      <h3 className={`text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 transition-colors relative z-10 leading-tight
        ${comingSoon ? 'opacity-40' : 'group-hover:text-blue-300'}`}>
        {name}
      </h3>
      <p className={`text-white/90 mb-3 sm:mb-5 relative z-10 leading-relaxed text-sm sm:text-base
        ${comingSoon ? 'blur-[2px] opacity-40' : ''}`}>
        {description}
      </p>
      <div className="border-t border-white/10 pt-4 mt-auto relative z-10">
        <div className="flex items-center flex-wrap gap-1">
          <span className="text-sm font-medium text-white/80">Turnaround Time: </span>
          <span className={`text-sm font-semibold text-blue-300 ml-1 ${comingSoon ? 'opacity-40' : ''}`}>
            {turnaround}
          </span>
        </div>
      </div>
      </a>
    </>
  );
};

export default ServiceCard