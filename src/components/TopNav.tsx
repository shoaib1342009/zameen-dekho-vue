
import { Home, List, Heart, User, Bell, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import AuthModal from './AuthModal';
import NotificationPanel from './NotificationPanel';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/listings', icon: List, label: 'Listings' },
  { path: '/play', icon: 'Play', label: 'Play' },
  { path: '/wishlist', icon: Heart, label: 'Wishlist' },
];

const TopNav = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);

  const handleNotificationClick = () => {
    if (isAuthenticated) {
      setShowNotificationPanel(true);
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <nav className="hidden sm:block fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo */}
            <Link to="/" className="text-xl font-bold text-blue-600">
              Zameen Dekho
            </Link>

            {/* Navigation Items - Center */}
            <div className="flex items-center justify-center">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "px-6 py-2 rounded-lg transition-all duration-200 mx-2",
                      isActive 
                        ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right side icons - Theme, Notification, Profile */}
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-muted/20 transition-colors"
              >
                {theme === 'dark' ? (
                  <Sun className="w-6 h-6 text-foreground" />
                ) : (
                  <Moon className="w-6 h-6 text-foreground" />
                )}
              </button>
              
              <button 
                onClick={handleNotificationClick}
                className="p-2 rounded-full hover:bg-muted/20 transition-colors relative"
              >
                <Bell className="w-6 h-6 text-foreground" />
                {isAuthenticated && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </div>
                )}
              </button>

              <Link
                to="/profile"
                className={cn(
                  "p-2 rounded-full transition-colors",
                  location.pathname === '/profile'
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/20"
                )}
              >
                <User className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <NotificationPanel isOpen={showNotificationPanel} onClose={() => setShowNotificationPanel(false)} />
    </>
  );
};

export default TopNav;
