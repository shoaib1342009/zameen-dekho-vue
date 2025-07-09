
import { useState } from 'react';
import { User, Settings, Heart, Home, LogOut, MapPin, Phone, Mail, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProperties } from '@/hooks/useSupabaseProperties';
import { useWishlist } from '@/contexts/WishlistContext';
import AuthModal from '@/components/AuthModal';
import PropertyCard from '@/components/PropertyCard';
import { formatPrice, formatRentPrice } from '@/utils/priceFormatter';

const Profile = () => {
  const { isAuthenticated, user, signOut } = useAuth();
  const { userProperties, loading } = useUserProperties();
  const { wishlist } = useWishlist();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState('listings');

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to view your profile</h2>
            <p className="text-muted-foreground mb-6">Access your listings, wishlist, and account settings</p>
            <Button onClick={() => setShowAuthModal(true)} className="bg-zameen-gradient text-white">
              Sign In
            </Button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const formatPropertyPrice = (price: string | number, label: string) => {
    const priceStr = price.toString();
    if (label.toLowerCase().includes('rent')) {
      return formatRentPrice(priceStr);
    }
    return formatPrice(priceStr);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-6 mb-6 border border-border">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-zameen-gradient rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">{user?.email}</h1>
              <p className="text-muted-foreground">Property Owner</p>
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={activeTab === 'listings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('listings')}
            className="flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            My Listings ({userProperties.length})
          </Button>
          <Button
            variant={activeTab === 'wishlist' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('wishlist')}
            className="flex items-center gap-2"
          >
            <Heart className="w-4 h-4" />
            Wishlist ({wishlist.length})
          </Button>
          <Button
            variant={activeTab === 'settings' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* My Listings Tab */}
          {activeTab === 'listings' && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">My Property Listings</h2>
              
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-muted rounded-lg p-4 animate-pulse">
                      <div className="h-48 bg-muted-foreground/20 rounded-lg mb-3"></div>
                      <div className="h-4 bg-muted-foreground/20 rounded mb-2"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded mb-2"></div>
                      <div className="h-3 bg-muted-foreground/20 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : userProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {userProperties.map((property) => (
                    <div key={property.id} className="relative">
                      <PropertyCard property={property} />
                      <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                        Your Listing
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Home className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No listings yet</h3>
                  <p className="text-muted-foreground mb-4">Start by adding your first property</p>
                  <Button className="bg-zameen-gradient text-white">
                    + Add Property
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Saved Properties</h2>
              
              {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((propertyId) => {
                    // Find the property in the global properties list
                    // This is a simplified approach - in production, you'd want to fetch these specifically
                    return (
                      <div key={propertyId} className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">Property ID: {propertyId}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Property details would be loaded here
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No saved properties</h3>
                  <p className="text-muted-foreground mb-4">Save properties you're interested in</p>
                  <Button variant="outline">
                    Browse Properties
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="bg-card rounded-2xl p-6 border border-border">
              <h2 className="text-xl font-semibold text-foreground mb-4">Account Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Change</Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">Not provided</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Add</Button>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-border">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">Not provided</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Add</Button>
                </div>
                
                <div className="pt-4">
                  <Button
                    onClick={handleSignOut}
                    variant="destructive"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
