import { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pb-16 sm:pb-20 pt-12 sm:pt-16">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;