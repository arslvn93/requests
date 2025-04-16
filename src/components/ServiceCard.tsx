import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import EmailModal from './EmailModal';
import { getStoredEmail, storeEmail } from '../utils/emailStorage';

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
  const Icon = Icons[icon];
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (e: React.MouseEvent) => {
    if (comingSoon) {
      e.preventDefault();
      return;
    }
    
    // Handle listing ad form differently
    if (name === "Listing Ad") {
      e.preventDefault();
      navigate('/listing-form');
      return;
    }
    
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleEmailSubmit = (email: string) => {
    storeEmail(email);
    const separator = url.includes('?') ? '&' : '?';
    const finalUrl = `${url}${separator}email=${encodeURIComponent(email)}`;
    window.open(finalUrl, '_blank', 'noopener,noreferrer');
    setIsModalOpen(false);
  };

  return (
    <>
      <a
        href={comingSoon ? "#" : url}
        onClick={handleServiceClick}
        target="_blank"
        rel="noopener noreferrer"
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
        <Icon className={`w-6 h-6 sm:w-8 sm:h-8 text-blue-400 transition-colors relative z-10
          ${comingSoon ? 'opacity-40' : 'group-hover:text-blue-300'}`} />
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
      <EmailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmailSubmit}
        serviceName={name}
      />
    </>
  );
};

export default ServiceCard