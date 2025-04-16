import React from 'react';
import { Check, DollarSign, MapPin, Home, Users, Target, Wrench, TrendingUp, Camera } from 'lucide-react';

interface ReviewStepProps {
  formData: {
    contact: {
      firstName: string;
      lastName: string;
      phone: string;
      email: string;
    };
    address: {
      address: string;
      address2: string;
      city: string;
      state: string;
      squareFootage: string;
      zipCode: string;
      country: string;
    };
    adDetails: {
      objective: string;
      targetLocation: string;
      duration: string;
      endDate?: string;
    };
    propertyDetails: {
      propertyType: string;
      otherType?: string;
      price: string;
      showPrice: string;
      bedrooms: string;
      bathrooms: string;
    };
    propertyHighlights: {
      topFeatures: string;
      wowFactor: string;
      firstImpression: string;
      hiddenGems: string;
    };
    targetBuyer: {
      idealBuyer: string;
      lifestyle: string;
      propertyAppeal: string;
      neighborhoodAppeal: string;
    };
    marketingStrategy: {
      marketingChannels: string[];
      targetAudience: string;
      uniqueSellingPoints: string;
      callToAction: string;
    };
    propertyUpgrades: {
      recentUpgrades: Array<{ name: string; year: string; }>;
      customFeatures: string[];
      customFeature: string;
    };
    investmentPotential: {
      rentalIncome: string;
      propertyAppreciation: string;
      developmentPlans: string;
      investmentHighlights: string[];
    };
    photosMedia: {
      photos: File[];
      featuredPhotoIndex: number;
      virtualTourUrl?: string;
      videoUrl?: string;
    };
  };
  onSubmit: () => void;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ formData, onSubmit }) => {
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(parseInt(price));
  };

  const Section = ({ 
    icon: Icon, 
    title, 
    children 
  }: { 
    icon: React.ElementType;
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Icon className="w-6 h-6 text-blue-400" />
        <h3 className="text-lg font-semibold text-white/90">{title}</h3>
      </div>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white/90 mb-2">Review Your Listing</h2>
        <p className="text-white/60">Please review all information before submitting</p>
      </div>

      <div className="space-y-6">
        <Section icon={Users} title="Contact Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-white/60">Name</p>
              <p className="text-white/90">{formData.contact.firstName} {formData.contact.lastName}</p>
            </div>
            <div>
              <p className="text-white/60">Phone</p>
              <p className="text-white/90">{formData.contact.phone}</p>
            </div>
            <div>
              <p className="text-white/60">Email</p>
              <p className="text-white/90">{formData.contact.email}</p>
            </div>
          </div>
        </Section>

        <Section icon={MapPin} title="Property Address">
          <div className="space-y-1">
            <p className="text-white/90">{formData.address.address}</p>
            {formData.address.address2 && (
              <p className="text-white/90">{formData.address.address2}</p>
            )}
            <p className="text-white/90">
              {formData.address.city}, {formData.address.state} {formData.address.zipCode}
            </p>
            <p className="text-white/90">{formData.address.squareFootage} sq ft</p>
            <p className="text-white/90">{formData.address.country}</p>
          </div>
        </Section>

        <Section icon={Target} title="Ad Details">
          <div className="space-y-4">
            <div>
              <p className="text-white/60">Objective</p>
              <p className="text-white/90 capitalize">{formData.adDetails.objective}</p>
            </div>
            <div>
              <p className="text-white/60">Target Location</p>
              <p className="text-white/90">{formData.adDetails.targetLocation}</p>
            </div>
            <div>
              <p className="text-white/60">Duration</p>
              <p className="text-white/90">
                {formData.adDetails.duration === 'until_sold' 
                  ? 'Until Sold'
                  : `Until ${formData.adDetails.endDate}`}
              </p>
            </div>
          </div>
        </Section>

        <Section icon={Home} title="Property Details">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white/60">Type</p>
              <p className="text-white/90 capitalize">
                {formData.propertyDetails.propertyType === 'other'
                  ? formData.propertyDetails.otherType
                  : formData.propertyDetails.propertyType}
              </p>
            </div>
            <div>
              <p className="text-white/60">Price</p>
              <p className="text-white/90">
                {formatPrice(formData.propertyDetails.price)}
                {formData.propertyDetails.showPrice === 'email' && ' (Show in email only)'}
              </p>
            </div>
            <div>
              <p className="text-white/60">Bedrooms</p>
              <p className="text-white/90">{formData.propertyDetails.bedrooms}</p>
            </div>
            <div>
              <p className="text-white/60">Bathrooms</p>
              <p className="text-white/90">{formData.propertyDetails.bathrooms}</p>
            </div>
          </div>
        </Section>

        <Section icon={Wrench} title="Property Upgrades">
          {formData.propertyUpgrades.recentUpgrades.length > 0 && (
            <div className="space-y-2">
              <p className="text-white/60">Recent Upgrades</p>
              {formData.propertyUpgrades.recentUpgrades.map((upgrade, index) => (
                <p key={index} className="text-white/90">
                  {upgrade.name} ({upgrade.year})
                </p>
              ))}
            </div>
          )}
          {formData.propertyUpgrades.customFeatures.length > 0 && (
            <div className="space-y-2 mt-4">
              <p className="text-white/60">Special Features</p>
              <div className="flex flex-wrap gap-2">
                {formData.propertyUpgrades.customFeatures.map((feature, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-sm">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </Section>

        <Section icon={TrendingUp} title="Investment Potential">
          <div className="space-y-4">
            <div>
              <p className="text-white/60">Monthly Rental Income</p>
              <p className="text-white/90">{formatPrice(formData.investmentPotential.rentalIncome)}/month</p>
            </div>
            <div>
              <p className="text-white/60">Appreciation Potential</p>
              <p className="text-white/90">{formData.investmentPotential.propertyAppreciation}</p>
            </div>
            <div>
              <p className="text-white/60">Development Plans</p>
              <p className="text-white/90">{formData.investmentPotential.developmentPlans}</p>
            </div>
            {formData.investmentPotential.investmentHighlights.length > 0 && (
              <div>
                <p className="text-white/60">Investment Highlights</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.investmentPotential.investmentHighlights.map((highlight, index) => (
                    <span key={index} className="px-3 py-1 rounded-full bg-blue-400/20 text-blue-300 text-sm">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>

        <Section icon={Camera} title="Photos & Media">
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {formData.photosMedia.photos.map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Property photo ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  {index === formData.photosMedia.featuredPhotoIndex && (
                    <div className="absolute top-2 left-2 px-2 py-1 bg-blue-500 rounded-full 
                                 text-white text-xs font-medium">
                      Featured
                    </div>
                  )}
                </div>
              ))}
            </div>
            {(formData.photosMedia.virtualTourUrl || formData.photosMedia.videoUrl) && (
              <div className="space-y-2">
                {formData.photosMedia.virtualTourUrl && (
                  <div>
                    <p className="text-white/60">Virtual Tour</p>
                    <p className="text-white/90">{formData.photosMedia.virtualTourUrl}</p>
                  </div>
                )}
                {formData.photosMedia.videoUrl && (
                  <div>
                    <p className="text-white/60">Property Video</p>
                    <p className="text-white/90">{formData.photosMedia.videoUrl}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Section>

        <button
          onClick={onSubmit}
          className="w-full mt-8 py-4 px-6 bg-blue-500/90 hover:bg-blue-500 
                   text-white font-medium rounded-xl transition-all duration-200
                   hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
                   flex items-center justify-center gap-2"
        >
          <Check className="w-5 h-5" />
          Submit Listing
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;