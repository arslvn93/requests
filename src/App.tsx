import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import * as Icons from 'lucide-react';
import servicesData from './data/services.json';
import ServiceCard from './components/ServiceCard';
import ListingForm from './pages/ListingForm';

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/listing-form" element={<ListingForm />} />
        <Route path="/" element={
          <div className="relative min-h-screen overflow-hidden py-6 sm:py-12 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative text-center mb-8 sm:mb-12">
          <svg className="hidden sm:block w-16 h-16 mx-auto mb-4" viewBox="0 0 1080 1080">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="200%" y2="0%">
                <stop offset="0%" stopColor="#4169E1" stopOpacity="1" />
                <stop offset="33.33%" stopColor="#6A5ACD" stopOpacity="1" />
                <stop offset="66.66%" stopColor="#9370DB" stopOpacity="1" />
                <stop offset="100%" stopColor="#4169E1" stopOpacity="1" />
              </linearGradient>
            </defs>
            <path className="svg-gradient" fill="url(#gradient)" transform="translate(512,6)" d="m0 0h42l28 2 28 4 29 7 26 9 27 13 17 11 13 10 13 11 13 13 11 14 10 15 8 16 6 15 6 21 3 19 2 31v17h-128l-1-1-5-36-5-15-6-10-9-10-12-9-16-8-18-6-24-5-22-2h-36l-26 3-20 5-15 6-12 6-10 8-6 7-5 12-2 12v13l4 7 9 8 11 7 14 7 28 10 32 9 74 18 40 11 32 10 24 9 24 11 21 12 16 11 13 11 15 15 11 15 9 16 7 17 5 19 2 13v39l-3 21-5 20-7 19 1 4 11 15 10 15 13 24 14 31 11 25v2h-139l-10-17-5-9-9 3-19 7-25 7-26 5-25 3-13 1h-64l-24-2-33-5-26-6-39-13-11 18-10 21-7 22-5 25-2 20v36l3 26 5 23 8 23 11 22 11 16 12 14 11 11 17 13 19 11 19 8 17 5 30 5 18 1h11l24-2 20-4 21-7 23-11 16-11 11-9 10-9 11-13 10-16 7-15 5-15 3-11h-205l-1-1v-123h333v368h-124l-1-49-17 12-15 9-19 10-25 10-22 7-26 5-32 3h-50l-26-3-27-6-26-8-26-11-20-10-21-13-17-13-11-9-12-11-12-12-9-11-12-15-12-18-12-21-11-23-10-28-7-27-5-28-3-30v-54l3-30 5-27 6-23 7-21 10-23 12-23 10-16 13-18 1-4-8-16-6-15-6-19-5-25-4-35-1-18h133l1 3 2 31 2 10 23-10 27-9 21-5 25-4 13-1h48l31 3 27 5 19 5 29 10 9 4-4-11-7-8-15-10-23-11-19-7-42-12-49-12-38-9-30-9-29-10-24-10-22-11-19-12-13-10-15-13-12-13-9-13-8-15-7-20-3-15-2-23v-12l2-23 5-23 6-17 8-17 10-16 9-11 11-12 7-7 14-11 13-9 18-10 19-8 18-6 25-6 24-4 19-2z" />
          </svg>
          <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-3 sm:mb-4">
            Marketing Service Requests
          </h1>
          <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto px-2 leading-relaxed">
            Choose a service below to submit your request. Our team will process it within the specified turnaround time.
          </p>
          <p className="mt-2 sm:mt-4 text-sm text-white/70">
            Have questions? Email us at <a href="mailto:clientcare@salesgenius.co" className="text-blue-400 hover:text-blue-300">clientcare@salesgenius.co</a>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {servicesData.services.map((service) => (
            <ServiceCard
              key={service.id}
              name={service.name}
              description={service.description}
              turnaround={service.turnaround}
              icon={service.icon as keyof typeof Icons}
              url={service.url}
              comingSoon={service.comingSoon}
            />
          ))}
        </div>
      </div>
      <div className="hidden sm:block fixed bottom-0 left-0 right-0 text-center py-4 px-3">
        <p className="text-white/80">
          Need assistance? Contact our client care team at <a href="mailto:clientcare@salesgenius.co" className="text-blue-400 hover:text-blue-300">clientcare@salesgenius.co</a>
        </p>
      </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;