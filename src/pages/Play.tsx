
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
  }
];

const Play = () => {
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleContactSeller = () => {
    // Check if user contact info exists (simulated)
    const hasContactInfo = localStorage.getItem('user-contact');
    
    if (hasContactInfo) {
      // Redirect to call/WhatsApp
      const sellerPhone = mockVideos[currentVideo].property.seller;
      window.open(`tel:${sellerPhone}`, '_self');
    } else {
      setShowLeadForm(true);
    }
  };

  const handleWhatsApp = () => {
    const hasContactInfo = localStorage.getItem('user-contact');
    
    if (hasContactInfo) {
      const sellerPhone = mockVideos[currentVideo].property.seller;
      const message = `Hi! I'm interested in ${mockVideos[currentVideo].property.title}`;
      window.open(`https://wa.me/${sellerPhone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      setShowLeadForm(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-screen">
        {mockVideos.map((video, index) => (
          <VideoPlayer
            key={video.id}
            video={video}
            isActive={index === currentVideo}
            onContactSeller={handleContactSeller}
            onWhatsApp={handleWhatsApp}
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
