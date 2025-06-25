
const locations = [
  { name: 'Nerul', image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=100&h=100&fit=crop&crop=center' },
  { name: 'Panvel', image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=100&h=100&fit=crop&crop=center' },
  { name: 'Vashi', image: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=100&h=100&fit=crop&crop=center' },
  { name: 'Ulwe', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=100&h=100&fit=crop&crop=center' },
];

const LocationSelector = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">Choose Location</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {locations.map((location) => (
          <div
            key={location.name}
            className="flex-shrink-0 flex flex-col items-center cursor-pointer tap-scale"
          >
            <div className="w-16 h-16 rounded-full border-2 border-gradient overflow-hidden mb-2 hover-scale">
              <img
                src={location.image}
                alt={location.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-foreground text-center">
              {location.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationSelector;
