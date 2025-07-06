
import { Home, List, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/listings', icon: List, label: 'Listings' },
  { path: '/play', icon: 'Play', label: 'Play' },
  { path: '/wishlist', icon: Heart, label: 'Wishlist' },
];

const TopNav = () => {
  const location = useLocation();

  return (
    <nav className="hidden sm:block fixed top-12 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
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

          {/* Profile Icon - Right side */}
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
    </nav>
  );
};

export default TopNav;
