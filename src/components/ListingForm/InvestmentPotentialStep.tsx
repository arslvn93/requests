import React, { useState } from 'react';
// Removed duplicate import on the next line
import { TrendingUp, DollarSign, Calculator, FileText } from 'lucide-react';

interface InvestmentPotentialInfo {
  isGoodInvestment: 'yes' | 'no' | ''; // Added field
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

  // Update field function
  const updateField = (field: keyof InvestmentPotentialInfo, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    // Step is valid if the initial question is answered
    return value.isGoodInvestment !== '';
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
        {/* --- New Yes/No Question --- */}
        <div className="space-y-3">
          <p className="text-white/90">Is this property a good investment opportunity?</p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => updateField('isGoodInvestment', 'yes')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                ${value.isGoodInvestment === 'yes'
                  ? 'bg-blue-500 text-white'
                  : 'glass-card text-white/90 hover:border-blue-400'}`}
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => updateField('isGoodInvestment', 'no')}
              className={`flex-1 p-3 rounded-xl text-center transition-all duration-200
                ${value.isGoodInvestment === 'no'
                  ? 'bg-blue-500 text-white'
                  : 'glass-card text-white/90 hover:border-blue-400'}`}
            >
              No
            </button>
          </div>
        </div>

        {/* --- Conditionally Render Existing Fields --- */}
        {value.isGoodInvestment === 'yes' && (
          <>
            {/* Rule 4: Changed space-y-2 to space-y-3 */}
            <div className="space-y-3">
              <p className="text-white/90">What's the potential monthly rental income? (Optional)</p>
              <div className={`glass-card flex items-center gap-3 p-4 transition-all duration-200
            ${focusedField === 'rentalIncome' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <DollarSign className="w-6 h-6 text-blue-400" />
            <input
              type="text"
              id="rentalIncome"
              name="rentalIncome"
              inputMode="numeric" // Better for mobile keyboards
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

            {/* Rule 4: Changed space-y-2 to space-y-3 */}
            <div className="space-y-3">
              <p className="text-white/90">What's the appreciation potential? (Optional)</p>
              <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'propertyAppreciation' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Calculator className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="propertyAppreciation"
              name="propertyAppreciation"
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

            {/* Rule 4: Changed space-y-2 to space-y-3 */}
            <div className="space-y-3">
              <p className="text-white/90">Are there any upcoming development plans in the area? (Optional)</p>
              <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'developmentPlans' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <FileText className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              id="developmentPlans"
              name="developmentPlans"
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
              <p className="text-white/90">Investment Highlights (Optional)</p>
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
          </>
        )}
        {/* --- End Conditional Rendering --- */}

        <button
          type="submit"
          className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!isValid()}
        >
          Next: Neighborhood Information
        </button>
      </form>
    </div>
  );
};

export default InvestmentPotentialStep;