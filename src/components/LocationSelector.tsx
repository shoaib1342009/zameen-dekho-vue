import { useState } from 'react';

const locations = [
  { name: 'Nerul', image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=100&h=100&fit=crop&crop=center' },
  { name: 'Panvel', image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=100&h=100&fit=crop&crop=center' },
  { name: 'Vashi', image: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=100&h=100&fit=crop&crop=center' },
  { name: 'Ulwe', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=100&h=100&fit=crop&crop=center' },
  { name: 'Kharghar', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop&crop=center' },
  { name: 'Kamothe', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=100&h=100&fit=crop&crop=center' },
  { name: 'Airoli', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center' },
  { name: 'Ghansoli', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100&h=100&fit=crop&crop=center' },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1595146769045-8b29e94cfee6?w=100&h=100&fit=crop&crop=center' },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=100&h=100&fit=crop&crop=center' },
  { name: 'Kochi', image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop&crop=center' },
  { name: 'Ahmedabad', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=100&h=100&fit=crop&crop=center' },
  { name: 'Chandigarh', image: 'https://images.unsplash.com/photo-1586500036706-ef7b523b2db0?w=100&h=100&fit=crop&crop=center' },
  { name: 'Indore', image: 'https://images.unsplash.com/photo-1563114773-71ff30f96b1c?w=100&h=100&fit=crop&crop=center' },
];

const LocationSelector = () => {
  const [selectedLocations, setSelectedLocations] = useState<string[]>(['Nerul']);

  const handleLocationClick = (locationName: string) => {
    setSelectedLocations(prev => {
      if (prev.includes(locationName)) {
        // Remove if already selected (allow deselection)
        return prev.filter(loc => loc !== locationName);
      } else {
        // Add to selection (multiple selection allowed)
        return [...prev, locationName];
      }
    });
  };

  return (
    <div className="py-2">
      <div className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-1">
        {locations.map((location) => {
          const isSelected = selectedLocations.includes(location.name);
          
          return (
            <div
              key={location.name}
              className="flex-shrink-0 flex flex-col items-center cursor-pointer tap-scale"
              onClick={() => handleLocationClick(location.name)}
            >
              <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden mb-2 transition-all duration-300 ${
                isSelected 
                  ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/25 scale-105' 
                  : 'border-2 border-transparent hover:scale-105'
              }`}>
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`text-xs sm:text-sm font-medium text-center transition-colors max-w-[60px] sm:max-w-[70px] truncate ${
                isSelected 
                  ? 'text-blue-500 font-semibold' 
                  : 'text-foreground'
              }`}>
                {location.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSelector;