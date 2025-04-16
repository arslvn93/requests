import React, { useState } from 'react';
import { TrendingUp, DollarSign, Calculator, FileText } from 'lucide-react';

interface InvestmentPotentialInfo {
  rentalIncome: string;
  propertyAppreciation: string;
  developmentPlans: string;
  investmentHighlights: string[];
}

interface InvestmentPotentialStepProps {
  value: InvestmentPotentialInfo;
  onChange: (value: InvestmentPotentialInfo) => void;
  onNext: () => void;
}

const InvestmentPotentialStep: React.FC<InvestmentPotentialStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const investmentHighlights = [
    'Positive Cash Flow',
    'High ROI Potential',
    'Below Market Value',
    'Development Potential',
    'Tax Benefits',
    'Low Maintenance',
    'High Rental Demand',
    'Appreciation Area'
  ];

  const toggleHighlight = (highlight: string) => {
    const newHighlights = value.investmentHighlights.includes(highlight)
      ? value.investmentHighlights.filter(h => h !== highlight)
      : [...value.investmentHighlights, highlight];
    onChange({ ...value, investmentHighlights: newHighlights });
  };

  const formatCurrency = (input: string) => {
    const numbers = input.replace(/\D/g, '');
    return numbers ? parseInt(numbers).toLocaleString() : '';
  };

  const handleRentalIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...value, rentalIncome: e.target.value.replace(/\D/g, '') });
  };

  const isValid = () => {
    return (
      value.rentalIncome.trim().length > 0 &&
      value.propertyAppreciation.trim().length > 0 &&
      value.developmentPlans.trim().length > 0 &&
      value.investmentHighlights.length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Investment Potential</h2>
          <p className="text-white/60">Highlight the property's investment value</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <p className="text-white/90">What's the potential monthly rental income?</p>
          <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'rentalIncome' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <DollarSign className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              value={formatCurrency(value.rentalIncome)}
              onChange={handleRentalIncomeChange}
              onFocus={() => setFocusedField('rentalIncome')}
              onBlur={() => setFocusedField(null)}
              placeholder="Monthly rental estimate"
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
            />
            <span className="text-white/60">/month</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/90">What's the appreciation potential?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'propertyAppreciation' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Calculator className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.propertyAppreciation}
              onChange={(e) => onChange({ ...value, propertyAppreciation: e.target.value })}
              onFocus={() => setFocusedField('propertyAppreciation')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe the potential for value appreciation (market trends, planned developments, etc.)"
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/90">Are there any upcoming development plans in the area?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'developmentPlans' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.developmentPlans}
              onChange={(e) => onChange({ ...value, developmentPlans: e.target.value })}
              onFocus={() => setFocusedField('developmentPlans')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe any planned developments or improvements in the area"
              rows={3}
              className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-white/90">Investment Highlights</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {investmentHighlights.map((highlight) => (
              <button
                key={highlight}
                type="button"
                onClick={() => toggleHighlight(highlight)}
                className={`glass-card p-4 flex flex-col items-center gap-2 transition-all duration-200
                  ${value.investmentHighlights.includes(highlight) ? 'border-blue-400 bg-blue-400/10' : ''}`}
              >
                <span className="text-white/90 text-sm font-medium text-center">{highlight}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next
        </button>
      </form>
    </div>
  );
};

export default InvestmentPotentialStep;