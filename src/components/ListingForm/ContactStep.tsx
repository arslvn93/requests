import React, { useState, useEffect } from 'react'; // Import useEffect
import { User, Phone, Mail, MessageSquare } from 'lucide-react';

interface ContactInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

interface ContactStepProps {
  value: ContactInfo;
  onChange: (value: ContactInfo) => void;
  onNext: () => void;
  onValidationChange: (isValid: boolean) => void; // Add prop for validation status
}

const ContactStep: React.FC<ContactStepProps> = ({ value, onChange, onNext, onValidationChange }) => { // Destructure new prop
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const updateField = (field: keyof ContactInfo, newValue: string) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    return (
      value.firstName.trim().length > 0 &&
      value.lastName.trim().length > 0 &&
      value.phone.length >= 10 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)
    );
  };

  // Effect to notify parent component (ListingForm) about validation status changes
  useEffect(() => {
    onValidationChange(isValid());
  }, [value, onValidationChange]); // Re-run when value or the callback changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      {/* Rule 2: Added consistent header structure with icon */}
      <div className="flex items-center gap-3">
        <User className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Contact Information</h2>
          <p className="text-white/60">Let us know who you are so we can get in touch</p>
        </div>
      </div>
      {/* Rule 3: Changed space-y-4 to space-y-6 */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rule 4 & 5: Added Question Block wrapper and Labels */}
        <div className="space-y-3">
          <p className="text-white/90">Full Name</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'firstName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <User className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={value.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              placeholder="First Name"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required // Added for better form validation/accessibility
            />
            </div>
            
            <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'lastName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <User className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={value.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Last Name"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              required // Added for better form validation/accessibility
            />
            </div>
          </div>
        </div>

        {/* Rule 4 & 5: Added Question Block wrapper and Label */}
        <div className="space-y-3">
          <p className="text-white/90">Phone Number</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'phone' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Phone className="w-6 h-6 text-blue-400" />
          <input
            type="tel"
            id="phone"
            name="phone"
            value={value.phone}
            onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            placeholder="Phone number"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            required // Added for better form validation/accessibility
            minLength={10} // Basic validation
          />
          </div>
        </div>

        {/* Rule 4 & 5: Added Question Block wrapper and Label */}
        <div className="space-y-3">
          <p className="text-white/90">Email Address</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'email' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Mail className="w-6 h-6 text-blue-400" />
          <input
            type="email"
            id="email"
            name="email"
            value={value.email}
            onChange={(e) => updateField('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            placeholder="Email address"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            required // Added for better form validation/accessibility
          />
          </div>
        </div>

        {/* Rule 8: Next button styling is already consistent */}
        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed
                   hidden md:block" // Hide on mobile, show on desktop
          disabled={!isValid()}
        >
          Next {/* Removed specific step name */}
        </button>
      </form>
    </div>
  );
};

export default ContactStep;