
import { useLocation } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const showHeader = location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {showHeader && <Header />}
      <main className={showHeader ? "pt-16 pb-20" : "pb-20"}>
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
