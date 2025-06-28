
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '@/utils/priceFormatter';

interface Video {
  id: number;
  videoUrl: string;
  property: {
    title: string;
    price: string;
    location: string;
    seller: string;
  };
}

interface VideoPlayerProps {
  video: Video;
  onContactSeller: () => void;
  onWhatsApp: () => void;
}

const VideoPlayer = ({ video, onContactSeller, onWhatsApp }: VideoPlayerProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const navigate = useNavigate();

  const toggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleViewDetails = () => {
    navigate(`/property/${video.id}`);
  };

  return (
    <div className="absolute inset-0 bg-black">
      {/* Video/Image Background */}
      <div className="w-full h-full relative">
        <video
          src={video.videoUrl}
          poster={video.videoUrl}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => {
            // Fallback to image if video fails
            const target = e.target as HTMLVideoElement;
            const img = document.createElement('img');
            img.src = video.videoUrl;
            img.className = 'w-full h-full object-cover';
            img.alt = video.property.title;
            target.parentNode?.replaceChild(img, target);
          }}
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Property Info */}
        <div className="absolute bottom-24 left-4 right-4 text-white z-10">
          <h3 className="text-xl font-bold mb-2 text-white drop-shadow-lg">{video.property.title}</h3>
          <p className="text-2xl font-bold mb-1 text-white drop-shadow-lg">
            {formatPrice(video.property.price)}
          </p>
          <p className="text-sm opacity-90 text-white drop-shadow-lg">{video.property.location}</p>
        </div>
        
        {/* Action Buttons Row */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <div className="flex items-end justify-between">
            {/* Three buttons in a row */}
            <div className="flex gap-2 flex-1 max-w-[calc(100%-60px)]">
              <button 
                onClick={handleViewDetails}
                className="flex-1 min-w-0 py-2 px-3 text-white rounded-md font-medium tap-scale text-xs sm:text-sm"
                style={{
                  background: 'linear-gradient(to right, #1e3c72, #2a5298)'
                }}
              >
                View Details
              </button>
              
              <button
                onClick={onContactSeller}
                className="flex-1 min-w-0 py-2 px-3 text-white rounded-md font-medium tap-scale text-xs sm:text-sm"
                style={{
                  backgroundColor: '#1e3c72'
                }}
              >
                Contact Seller
              </button>
              
              <button
                onClick={onWhatsApp}
                className="flex-shrink-0 p-2 bg-[#25D366] rounded-md tap-scale"
              >
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488z"/>
                </svg>
              </button>
            </div>
            
            {/* Heart button positioned above WhatsApp button */}
            <div className="flex flex-col items-center gap-1">
              <button
                onClick={toggleLike}
                className="p-2 tap-scale"
              >
                <Heart className={`w-6 h-6 transition-colors ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-white'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
