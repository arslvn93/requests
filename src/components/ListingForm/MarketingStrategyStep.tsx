import React, { useState } from 'react';
import { Target, Users, Globe, Share2, FileText } from 'lucide-react';

interface MarketingStrategyInfo {
  marketingChannels: string[];
  targetAudience: string;
  uniqueSellingPoints: string;
  callToAction: string;
}

interface MarketingStrategyStepProps {
  value: MarketingStrategyInfo;
  onChange: (value: MarketingStrategyInfo) => void;
  onNext: () => void;
}

const MarketingStrategyStep: React.FC<MarketingStrategyStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const marketingOptions = [
    { id: 'social', label: 'Social Media', icon: Share2 },
    { id: 'email', label: 'Email Marketing', icon: Globe },
    { id: 'portals', label: 'Property Portals', icon: Globe },
    { id: 'print', label: 'Print Media', icon: FileText },
  ];

  const toggleChannel = (channelId: string) => {
    const newChannels = value.marketingChannels.includes(channelId)
      ? value.marketingChannels.filter(c => c !== channelId)
      : [...value.marketingChannels, channelId];
    onChange({ ...value, marketingChannels: newChannels });
  };

  const updateField = (field: keyof MarketingStrategyInfo, newValue: any) => {
    onChange({ ...value, [field]: newValue });
  };

  const isValid = () => {
    return (
      value.marketingChannels.length > 0 &&
      value.targetAudience.trim().length > 0 &&
      value.uniqueSellingPoints.trim().length > 0 &&
      value.callToAction.trim().length > 0
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid()) onNext();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Marketing Strategy</h2>
          <p className="text-white/60">Help us create an effective marketing plan</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-3">
          <p className="text-white/90">Which marketing channels should we focus on?</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {marketingOptions.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => toggleChannel(id)}
                className={`glass-card p-4 flex flex-col items-center gap-3 transition-all duration-200
                  ${value.marketingChannels.includes(id) ? 'border-blue-400 bg-blue-400/10' : ''}`}
              >
                <Icon className="w-6 h-6 text-blue-400" />
                <span className="text-white/90 text-sm font-medium text-center">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/90">Who is your target audience?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'targetAudience' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Users className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.targetAudience}
              onChange={(e) => updateField('targetAudience', e.target.value)}
              onFocus={() => setFocusedField('targetAudience')}
              onBlur={() => setFocusedField(null)}
              placeholder="Describe your ideal buyers (age, lifestyle, preferences...)"
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/90">What are the unique selling points we should emphasize?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'uniqueSellingPoints' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Target className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.uniqueSellingPoints}
              onChange={(e) => updateField('uniqueSellingPoints', e.target.value)}
              onFocus={() => setFocusedField('uniqueSellingPoints')}
              onBlur={() => setFocusedField(null)}
              placeholder="What makes this property stand out in the market?"
              rows={3}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-white/90">What call-to-action should we use?</p>
          <div className={`glass-card flex items-start gap-3 p-4 transition-all duration-200
            ${focusedField === 'callToAction' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
            <Share2 className="w-6 h-6 text-blue-400 mt-1" />
            <textarea
              value={value.callToAction}
              onChange={(e) => updateField('callToAction', e.target.value)}
              onFocus={() => setFocusedField('callToAction')}
              onBlur={() => setFocusedField(null)}
              placeholder="What action do you want potential buyers to take?"
              rows={2}
              className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40 resize-none"
            />
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

export default MarketingStrategyStep;