import { useState, useEffect } from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import LeadFormModal from '@/components/LeadFormModal';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';
import { mockVideos } from '@/data/mockData';

const Play = () => {
  const { isAuthenticated } = useAuth();
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleContactSeller = (video: typeof mockVideos[0]) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const hasContactInfo = localStorage.getItem('user-contact');
    
    if (hasContactInfo) {
      const sellerPhone = video.property.seller;
      window.open(`tel:${sellerPhone}`, '_self');
    } else {
      setShowLeadForm(true);
    }
  };

  const handleWhatsApp = (video: typeof mockVideos[0]) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    const hasContactInfo = localStorage.getItem('user-contact');
    
    if (hasContactInfo) {
      const sellerPhone = video.property.seller;
      const message = `Hi! I'm interested in ${video.property.title}`;
      window.open(`https://wa.me/${sellerPhone.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      setShowLeadForm(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentVideoIndex < mockVideos.length - 1) {
        setCurrentVideoIndex(currentVideoIndex + 1);
      } else if (e.key === 'ArrowUp' && currentVideoIndex > 0) {
        setCurrentVideoIndex(currentVideoIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentVideoIndex]);

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      <div className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
        {mockVideos.map((video, index) => (
          <div key={video.id} className="h-screen w-full snap-start relative">
            <VideoPlayer
              video={video}
              onContactSeller={() => handleContactSeller(video)}
              onWhatsApp={() => handleWhatsApp(video)}
            />
          </div>
        ))}
      </div>

      <LeadFormModal
        isOpen={showLeadForm}
        onClose={() => setShowLeadForm(false)}
      />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};

export default Play;