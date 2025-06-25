
import { useState } from 'react';
import { Search } from 'lucide-react';
import LocationSelector from '@/components/LocationSelector';
import FilterSection from '@/components/FilterSection';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBHK, setSelectedBHK] = useState('2 BHK');
  const [priceRange, setPriceRange] = useState([2.55]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 space-y-6">
        {/* Location Selector */}
        <LocationSelector />

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search anything"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-4 pr-12 bg-card text-foreground rounded-2xl border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-zameen-gradient rounded-xl tap-scale">
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filter Section */}
        <FilterSection
          selectedBHK={selectedBHK}
          setSelectedBHK={setSelectedBHK}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedAmenities={selectedAmenities}
          setSelectedAmenities={setSelectedAmenities}
        />

        {/* Welcome Message */}
        <div className="mt-8 text-center">
          <h2 className="text-2xl font-bold text-gradient mb-2">
            Find Your Dream Home
          </h2>
          <p className="text-muted-foreground">
            Discover amazing properties in your preferred location
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
