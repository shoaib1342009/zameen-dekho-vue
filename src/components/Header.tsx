
import { useState } from 'react';
import { Search, Plus, Bell, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import AuthModal from './AuthModal';
import SupabaseListPropertyModal from './SupabaseListPropertyModal';
import { useProperty } from '@/contexts/PropertyContext';

const Header = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { refetch } = useProperty();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleListProperty = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setShowListModal(true);
  };

  const handlePropertyAdded = () => {
    refetch();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="px-3 sm:px-6 py-2 sm:py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-zameen-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <span className="text-xl font-bold text-foreground hidden sm:inline">Zameen Dekho</span>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
              <div className="relative w-full">
                <Input
                  type="text"
                  placeholder="Search properties..."
                  className="w-full pl-10 pr-4 py-2 rounded-full border-muted-foreground/20 focus:border-primary"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              </div>
            </div>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Button
                onClick={handleListProperty}
                className="bg-zameen-gradient text-white hover:opacity-90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                List Property
              </Button>
              
              <Button variant="ghost" size="sm" className="p-2">
                <Bell className="w-5 h-5" />
              </Button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Hi, {user?.email}</span>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} variant="outline" size="sm">
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
              <div className="flex flex-col gap-4">
                {/* Mobile Search */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search properties..."
                    className="w-full pl-10 pr-4 py-2 rounded-full"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                </div>

                {/* Mobile Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    onClick={handleListProperty}
                    className="bg-zameen-gradient text-white hover:opacity-90 flex items-center gap-2 justify-center"
                  >
                    <Plus className="w-4 h-4" />
                    List Property
                  </Button>
                  
                  {isAuthenticated ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Hi, {user?.email}</span>
                      <Button onClick={handleSignOut} variant="outline" size="sm">
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setShowAuthModal(true)} variant="outline">
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <SupabaseListPropertyModal
        isOpen={showListModal}
        onClose={() => setShowListModal(false)}
        onPropertyAdded={handlePropertyAdded}
      />
    </>
  );
};

export default Header;
