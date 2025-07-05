import { useState } from 'react';
import { Search } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import FilterSection from '@/components/FilterSection';
import FeaturedListings from '@/components/FeaturedListings';
import TrustBadges from '@/components/TrustBadges';
import AppReviews from '@/components/AppReviews';
import NewsUpdates from '@/components/NewsUpdates';
import Footer from '@/components/Footer';
import HeroBanner from '@/components/HeroBanner';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBHK, setSelectedBHK] = useState('1 BHK');
  const [selectedPropertyType, setSelectedPropertyType] = useState('Apartment/Flat');
  const [priceRange, setPriceRange] = useState([2.55]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Hero Banner */}
      <div className="hidden sm:block">
        <HeroBanner
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBHK={selectedBHK}
          setSelectedBHK={setSelectedBHK}
          selectedPropertyType={selectedPropertyType}
          setSelectedPropertyType={setSelectedPropertyType}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />
      </div>

      {/* Mobile Layout - Keep existing */}
      <div className="sm:hidden px-3 py-4 space-y-4">
        {/* Location Selector */}
        <div className="w-full">
          <LocationSelector />
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-card text-foreground rounded-xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-zameen-gradient rounded-lg tap-scale">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Filter Section */}
        <div className="w-full">
          <FilterSection
            selectedBHK={selectedBHK}
            setSelectedBHK={setSelectedBHK}
            selectedPropertyType={selectedPropertyType}
            setSelectedPropertyType={setSelectedPropertyType}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            selectedAmenities={selectedAmenities}
            setSelectedAmenities={setSelectedAmenities}
          />
        </div>

        {/* Welcome Message */}
        <div className="mt-6 text-center px-2">
          <h2 className="text-xl font-bold text-blue-600 mb-2">
            Find Your Dream Home
          </h2>
          <p className="text-sm text-muted-foreground">
            Discover amazing properties in your preferred location
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Featured Listings */}
        <div className="w-full">
          <FeaturedListings />
        </div>

        {/* Trust Badges */}
        <div className="w-full">
          <TrustBadges />
        </div>

        {/* App Reviews */}
        <div className="w-full">
          <AppReviews />
        </div>

        {/* News Updates */}
        <div className="w-full">
          <NewsUpdates />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
