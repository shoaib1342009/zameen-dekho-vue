
import { useState } from 'react';
import { Search } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import FilterSection from '@/components/FilterSection';
import FeaturedListings from '@/components/FeaturedListings';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBHK, setSelectedBHK] = useState('1 BHK'); // Changed default to 1 BHK
  const [selectedPropertyType, setSelectedPropertyType] = useState('Apartment/Flat');
  const [priceRange, setPriceRange] = useState([2.55]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
            className="w-full px-4 py-3 sm:py-4 pr-12 sm:pr-14 bg-card text-foreground rounded-xl sm:rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm sm:text-base"
          />
          <button className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 bg-zameen-gradient rounded-lg sm:rounded-xl tap-scale">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
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
        <div className="mt-6 sm:mt-8 text-center px-2">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-2">
            Find Your Dream Home
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Discover amazing properties in your preferred location
          </p>
        </div>

        {/* Featured Listings */}
        <div className="w-full">
          <FeaturedListings />
        </div>
      </div>
    </div>
  );
};

export default Home;
