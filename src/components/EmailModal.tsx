import React, { useState } from 'react';
import { X } from 'lucide-react';
import { getStoredEmail } from '../utils/emailStorage';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
  serviceName: string;
}

const EmailModal: React.FC<EmailModalProps> = ({ isOpen, onClose, onSubmit, serviceName }) => {
  const [email, setEmail] = useState(getStoredEmail() || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
    onSubmit(email);
    setEmail('');
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" onClick={onClose}></div>
      <div className="relative bg-transparent w-full max-w-md rounded-t-2xl sm:rounded-xl p-4 sm:p-0">
        <button
          onClick={onClose}
          className="absolute -top-12 right-2 sm:right-0 text-white/60 hover:text-white transition-colors p-2 touch-manipulation"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-lg sm:text-xl font-medium text-white/90 text-center mb-2 sm:mb-3">
          {serviceName}
        </h2>
        <p className="text-white/60 text-center text-sm mb-4 sm:mb-6">
          Please enter your email to continue
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            placeholder="Enter your email"
            className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl bg-white/10 border-2 border-white/20 
                     text-white placeholder-white/40 focus:outline-none focus:border-blue-400
                     text-base sm:text-lg transition-all duration-200 mb-2 backdrop-blur-xl
                     focus:bg-white/15 focus:shadow-[0_0_30px_rgba(59,130,246,0.2)]"
            autoFocus
          />
          {error && (
            <p className="text-red-400/90 text-sm text-center mt-3">{error}</p>
          )}
          <button
            type="submit"
            className="w-full mt-4 sm:mt-6 py-3 sm:py-4 px-4 sm:px-6 bg-blue-500/90 hover:bg-blue-500 
                     text-white font-medium rounded-xl transition-all duration-200
                     hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Confirm and Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailModal