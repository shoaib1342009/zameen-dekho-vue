
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
      <Header />
      {/* Top Navigation - Desktop Only */}
      <TopNav />
      <main className="pb-16 sm:pb-0 pt-12 sm:pt-24">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
