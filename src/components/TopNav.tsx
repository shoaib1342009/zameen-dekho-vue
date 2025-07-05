
import { Home, List, Heart, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/listings', icon: List, label: 'Listings' },
  { path: '/play', icon: 'Play', label: 'Play' },
  { path: '/wishlist', icon: Heart, label: 'Wishlist' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const TopNav = () => {
  const location = useLocation();

  return (
    <nav className="hidden sm:block fixed top-12 left-0 right-0 z-40 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComponent = item.icon === 'Play' ? PlayIcon : item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-200 mx-2",
                  isActive 
                    ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

export default TopNav;
