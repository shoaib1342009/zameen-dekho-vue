
import { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import TopNav from './TopNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <div className="sm:hidden">
        <Header />
      </div>
      
      {/* Desktop Top Navigation */}
      <TopNav />
      
      <main className="pb-16 sm:pb-0 pt-12 sm:pt-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
