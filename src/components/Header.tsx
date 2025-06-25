
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-gradient tap-scale">
          Zameen Dekho
        </Link>
        <button className="p-2 rounded-full hover:bg-muted/20 transition-colors tap-scale">
          <Bell className="w-6 h-6 text-foreground" />
        </button>
      </div>
    </header>
  );
};

export default Header;
