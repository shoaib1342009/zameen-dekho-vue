
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

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const IconComponent = item.icon === 'Play' ? PlayIcon : item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 tap-scale",
                isActive 
                  ? "text-accent" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-full transition-all duration-200",
                isActive && "bg-zameen-gradient shadow-lg"
              )}>
                <IconComponent className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-white" : "text-current"
                )} />
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
              {isActive && (
                <div className="w-4 h-0.5 bg-zameen-gradient rounded-full mt-1" />
              )}
            </Link>
          );
        })}
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

export default BottomNav;
