import { Bell, Moon, Sun, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';
import NotificationPanel from './NotificationPanel';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const handleUserClick = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    }
  };

  const handleNotificationClick = () => {
    if (isAuthenticated) {
      setShowNotificationPanel(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5">
          {isHomePage && (
            <Link to="/" className="text-lg sm:text-xl font-bold tap-scale text-blue-600">
              Zameen Dekho
            </Link>
          )}
          {!isHomePage && <div></div>}
          {isHomePage && (
            <div className="flex items-center gap-1 sm:gap-2">
              <button 
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors tap-scale"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                ) : (
                  <Moon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                )}
              </button>
              <button 
                onClick={handleNotificationClick}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors tap-scale relative"
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                {isAuthenticated && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-[8px] sm:text-xs">3</span>
                  </div>
                )}
              </button>
              <button 
                onClick={handleUserClick}
                className="p-1.5 sm:p-2 rounded-full hover:bg-muted/20 transition-colors tap-scale"
              >
                {isAuthenticated ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-zameen-gradient rounded-full flex items-center justify-center">
                    <span className="text-white text-xs sm:text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
                )}
              </button>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <NotificationPanel isOpen={showNotificationPanel} onClose={() => setShowNotificationPanel(false)} />
    </>
  );
};

export default Header;