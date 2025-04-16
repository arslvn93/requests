import React, { useState } from 'react';
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
}

const ContactStep: React.FC<ContactStepProps> = ({ value, onChange, onNext }) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/90">Contact Information</h2>
      <p className="text-white/60">Let us know who you are so we can get in touch</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'firstName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <User className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              value={value.firstName}
              onChange={(e) => updateField('firstName', e.target.value)}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => setFocusedField(null)}
              placeholder="First Name"
              defaultValue="Taylor"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
          
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'lastName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <User className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              value={value.lastName}
              onChange={(e) => updateField('lastName', e.target.value)}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => setFocusedField(null)}
              placeholder="Last Name"
              defaultValue="Morgado"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
          </div>
        </div>

        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${focusedField === 'phone' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Phone className="w-6 h-6 text-blue-400" />
          <input
            type="tel"
            value={value.phone}
            onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, ''))}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
            placeholder="Phone number"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>

        <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
          ${focusedField === 'email' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
          <Mail className="w-6 h-6 text-blue-400" />
          <input
            type="email"
            value={value.email}
            onChange={(e) => updateField('email', e.target.value)}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            defaultValue="taylor@advantayge.com"
            placeholder="Email address"
            className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next: Property Address
        </button>
      </form>
    </div>
  );
};

export default ContactStep;