
import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import FilterSection from '@/components/FilterSection';

const bannerImages = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&h=1080&fit=crop',
    title: 'Find Your Dream Home',
    subtitle: 'Discover amazing properties in Mumbai'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=1920&h=1080&fit=crop',
    title: 'Premium Properties',
    subtitle: 'Luxury living at its finest'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920&h=1080&fit=crop',
    title: 'Modern Living Spaces',
    subtitle: 'Contemporary homes for modern families'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1920&h=1080&fit=crop',
    title: 'Waterfront Homes',
    subtitle: 'Wake up to stunning ocean views'
  }
];

interface HeroBannerProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedBHK: string;
  setSelectedBHK: (value: string) => void;
  selectedPropertyType: string;
  setSelectedPropertyType: (value: string) => void;
  priceRange: number[];
  setPriceRange: (value: number[]) => void;
  selectedAmenities: string[];
  setSelectedAmenities: (value: string[]) => void;
}

const HeroBanner = ({
  searchQuery,
  setSearchQuery,
  selectedBHK,
  setSelectedBHK,
  selectedPropertyType,
  setSelectedPropertyType,
  priceRange,
  setPriceRange,
  selectedAmenities,
  setSelectedAmenities,
}: HeroBannerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images */}
      {bannerImages.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-full max-w-4xl px-6">
          {/* Hero Text */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              {bannerImages[currentSlide].title}
            </h1>
            <p className="text-xl text-white/90">
              {bannerImages[currentSlide].subtitle}
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="Search properties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-16 bg-white/95 backdrop-blur-sm text-gray-900 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">
              <Search className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Filter Section */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
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
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
