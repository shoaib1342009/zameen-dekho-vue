
import { useState } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import LeadFormModal from '@/components/LeadFormModal';

const mockVideos = [
  {
    id: 1,
    videoUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=700&fit=crop',
    property: {
      title: 'Luxury 3BHK Apartment',
      price: '₹3,71,560',
      location: 'Nerul, Navi Mumbai',
      seller: '+91 98765 43210'
    }
  },
  {
    id: 2,
    videoUrl: 'https://images.unsplash.com/photo-1524230572899-a752b3835840?w=400&h=700&fit=crop',
    property: {
      title: 'Modern 2BHK Flat',
      price: '₹2,95,000',
      location: 'Vashi, Navi Mumbai',
      seller: '+91 87654 32109'
    }
  },
  {
    id: 3,
    videoUrl: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b?w=400&h=700&fit=crop',
    property: {
      title: 'Premium Villa',
      price: '₹6,50,000',
      location: 'Panvel, Navi Mumbai',
      seller: '+91 76543 21098'
    }
  },
  {
    id: 4,
    videoUrl: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=400&h=700&fit=crop',
    property: {
      title: 'Cozy Studio Apartment',
      price: '₹1,85,000',
      location: 'Airoli, Navi Mumbai',
      seller: '+91 65432 10987'
    }
  },
  {
    id: 5,
    videoUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=700&fit=crop',
    property: {
      title: 'Spacious 4BHK Penthouse',
      price: '₹8,95,000',
      location: 'Kharghar, Navi Mumbai',
      seller: '+91 54321 09876'
    }
  },
  {
    id: 6,
    videoUrl: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=700&fit=crop',
    property: {
      title: 'Contemporary 1BHK',
      price: '₹2,25,000',
      location: 'Seawoods, Navi Mumbai',
      seller: '+91 43210 98765'
    }
  },
  {
    id: 7,
    videoUrl: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=700&fit=crop',
    property: {
      title: 'Garden View 2BHK',
      price: '₹3,25,000',
      location: 'Dombivli, Mumbai',
      seller: '+91 32109 87654'
    }
  },
  {
    id: 8,
    videoUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=700&fit=crop',
    property: {
      title: 'Sea Facing Apartment',
      price: '₹7,50,000',
      location: 'Marine Drive, Mumbai',
      seller: '+91 21098 76543'
    }
  }
];

const Play = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleContactSeller = (video: typeof mockVideos[0]) => {
    const hasContactInfo = localStorage.getItem('user-contact');
    
    if (hasContactInfo) {
      const sellerPhone = video.property.seller;
      window.open(`tel:${sellerPhone}`, '_self');
    } else {
      setShowLeadForm(true);
    }
  };

  const handleWhatsApp = (video: typeof mockVideos[0]) => {
    const hasContactInfo = localStorage.getItem('user-contact');
    
    if (hasContactInfo) {
      const sellerPhone = video.property.seller;
      const message = `Hi! I'm interested in ${video.property.title}`;
      window.open(`https://wa.me/${sellerPhone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      setShowLeadForm(true);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollTop = container.scrollTop;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(scrollTop / itemHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < mockVideos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
        style={{ scrollBehavior: 'smooth' }}
      >
        {mockVideos.map((video, index) => (
          <div key={video.id} className="h-screen w-full snap-start snap-always relative">
            <VideoPlayer
              video={video}
              onContactSeller={() => handleContactSeller(video)}
              onWhatsApp={() => handleWhatsApp(video)}
            />
          </div>
        ))}
      </div>
      
      {/* Video indicators */}
      <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2 z-20">
        {mockVideos.map((_, index) => (
          <div
            key={index}
            className={`w-1 h-8 rounded-full transition-colors duration-300 ${
              index === currentVideoIndex ? 'bg-white' : 'bg-white/30'
            }`}
          />
        ))}
      </div>

      <LeadFormModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
      />
    </div>
  );
};

export default Play;
