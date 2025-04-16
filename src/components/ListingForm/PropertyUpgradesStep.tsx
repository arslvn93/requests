import React, { useState } from 'react';
import { Wrench, Plus, Calendar, Check } from 'lucide-react';

interface UpgradeInfo {
  name: string;
  year: string;
}

interface PropertyUpgradesInfo {
  recentUpgrades: UpgradeInfo[];
  customFeatures: string[];
  customFeature: string;
}

interface PropertyUpgradesStepProps {
  value: PropertyUpgradesInfo;
  onChange: (value: PropertyUpgradesInfo) => void;
  onNext: () => void;
}

const PropertyUpgradesStep: React.FC<PropertyUpgradesStepProps> = ({ value, onChange, onNext }) => {
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [newUpgrade, setNewUpgrade] = useState({ name: '', year: '' });

  const defaultFeatures = [
    'Smart Home Technology',
    'Energy-Efficient Windows',
    'Custom Closets',
    'Built-in Speakers',
    'Wine Cellar',
    'Home Theater',
    'Heated Floors',
    'Security System',
    'Solar Panels',
    'EV Charging',
    'Irrigation System',
    'Custom Lighting'
  ];

  const addUpgrade = () => {
    if (newUpgrade.name && newUpgrade.year) {
      onChange({
        ...value,
        recentUpgrades: [...value.recentUpgrades, newUpgrade]
      });
      setNewUpgrade({ name: '', year: '' });
    }
  };

  const removeUpgrade = (index: number) => {
    onChange({
      ...value,
      recentUpgrades: value.recentUpgrades.filter((_, i) => i !== index)
    });
  };

  const toggleFeature = (feature: string) => {
    const newFeatures = value.customFeatures.includes(feature)
      ? value.customFeatures.filter(f => f !== feature)
      : [...value.customFeatures, feature];
    onChange({ ...value, customFeatures: newFeatures });
  };

  const addCustomFeature = () => {
    if (value.customFeature && !value.customFeatures.includes(value.customFeature)) {
      onChange({
        ...value,
        customFeatures: [...value.customFeatures, value.customFeature],
        customFeature: ''
      });
    }
  };

  const isValid = () => {
    return value.recentUpgrades.length > 0 || value.customFeatures.length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="w-8 h-8 text-blue-400" />
        <div>
          <h2 className="text-2xl font-bold text-white/90">Property Upgrades & Features</h2>
          <p className="text-white/60">Tell us about recent improvements and special features</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-white/90">Recent Upgrades or Renovations</p>
          
          <div className="flex gap-4">
            <div className={`glass-card flex-1 flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'upgradeName' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <Wrench className="w-6 h-6 text-blue-400" />
              <input
                type="text"
                value={newUpgrade.name}
                onChange={(e) => setNewUpgrade({ ...newUpgrade, name: e.target.value })}
                onFocus={() => setFocusedField('upgradeName')}
                onBlur={() => setFocusedField(null)}
                placeholder="Upgrade description"
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              />
            </div>
            
            <div className={`glass-card w-32 flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'upgradeYear' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <Calendar className="w-6 h-6 text-blue-400" />
              <input
                type="text"
                value={newUpgrade.year}
                onChange={(e) => setNewUpgrade({ ...newUpgrade, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                onFocus={() => setFocusedField('upgradeYear')}
                onBlur={() => setFocusedField(null)}
                placeholder="Year"
                maxLength={4}
                className="w-full bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              />
            </div>
            
            <button
              type="button"
              onClick={addUpgrade}
              disabled={!newUpgrade.name || !newUpgrade.year}
              className="glass-card p-4 text-blue-400 hover:text-blue-300 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>

          {value.recentUpgrades.length > 0 && (
            <div className="space-y-2">
              {value.recentUpgrades.map((upgrade, index) => (
                <div key={index} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Wrench className="w-5 h-5 text-blue-400" />
                    <span className="text-white/90">{upgrade.name}</span>
                    <span className="text-white/60">({upgrade.year})</span>
                  </div>
                  <button
                    onClick={() => removeUpgrade(index)}
                    className="text-white/40 hover:text-white/60 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-white/90">Special Features</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {defaultFeatures.map((feature) => (
              <button
                key={feature}
                onClick={() => toggleFeature(feature)}
                className={`glass-card p-4 flex items-center justify-between transition-all duration-200
                  ${value.customFeatures.includes(feature) ? 'border-blue-400 bg-blue-400/10' : ''}`}
              >
                <span className="text-white/90">{feature}</span>
                {value.customFeatures.includes(feature) && (
                  <Check className="w-5 h-5 text-blue-400" />
                )}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <div className={`glass-card flex-1 flex items-center gap-3 p-4 transition-all duration-200
              ${focusedField === 'customFeature' ? 'border-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.2)]' : ''}`}>
              <Plus className="w-6 h-6 text-blue-400" />
              <input
                type="text"
                value={value.customFeature}
                onChange={(e) => onChange({ ...value, customFeature: e.target.value })}
                onFocus={() => setFocusedField('customFeature')}
                onBlur={() => setFocusedField(null)}
                placeholder="Add custom feature"
                className="flex-1 bg-transparent border-none outline-none text-white/90 placeholder-white/40"
              />
            </div>
            
            <button
              type="button"
              onClick={addCustomFeature}
              disabled={!value.customFeature}
              className="glass-card p-4 text-blue-400 hover:text-blue-300 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>

        {isValid() && (
          <button
            onClick={onNext}
            className="w-full mt-6 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                     text-white font-medium rounded-xl transition-all duration-200
                     hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyUpgradesStep;