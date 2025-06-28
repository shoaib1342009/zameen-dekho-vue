
const locations = [
  { name: 'Nerul', image: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=100&h=100&fit=crop&crop=center' },
  { name: 'Panvel', image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=100&h=100&fit=crop&crop=center' },
  { name: 'Vashi', image: 'https://images.unsplash.com/photo-1458668383970-8ddd3927deed?w=100&h=100&fit=crop&crop=center' },
  { name: 'Ulwe', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=100&h=100&fit=crop&crop=center' },
  { name: 'Kharghar', image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop&crop=center' },
  { name: 'Kamothe', image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?w=100&h=100&fit=crop&crop=center' },
  { name: 'Airoli', image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&h=100&fit=crop&crop=center' },
  { name: 'Ghansoli', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=100&h=100&fit=crop&crop=center' },
  { name: 'Belapur', image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop&crop=center' },
  { name: 'Sanpada', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&h=100&fit=crop&crop=center' },
  { name: 'Koparkhairane', image: 'https://images.unsplash.com/photo-1515263487990-61b07816b104?w=100&h=100&fit=crop&crop=center' },
  { name: 'Turbhe', image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=100&h=100&fit=crop&crop=center' },
  { name: 'Mahape', image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop&crop=center' },
  { name: 'Taloja', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=100&h=100&fit=crop&crop=center' },
];

const LocationSelector = () => {
  return (
    <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
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
  );
};

export default LocationSelector;
