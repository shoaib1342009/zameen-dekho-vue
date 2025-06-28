
import { Bell, Moon, Sun } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {isHomePage && (
          <Link to="/" className="text-xl font-bold tap-scale" style={{ color: '#1e3c72' }}>
            Zameen Dekho
          </Link>
        )}
        {!isHomePage && <div></div>}
        {isHomePage && (
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted/20 transition-colors tap-scale"
            >
              {theme === 'dark' ? (
                <Sun className="w-6 h-6 text-foreground" />
              ) : (
                <Moon className="w-6 h-6 text-foreground" />
              )}
            </button>
            <button className="p-2 rounded-full hover:bg-muted/20 transition-colors tap-scale">
              <Bell className="w-6 h-6 text-foreground" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
