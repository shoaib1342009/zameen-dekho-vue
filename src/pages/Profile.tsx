import { useState } from 'react';
import { User, Edit, LogOut, Phone, Mail, Plus, Building, Bell, Download, Calendar, Filter } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import AuthModal from '@/components/AuthModal';
import ListPropertyModal from '@/components/ListPropertyModal';
import NotificationPanel from '@/components/NotificationPanel';
import LeadDownloadModal from '@/components/LeadDownloadModal';

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, updateUser } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showListPropertyModal, setShowListPropertyModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showLeadDownloadModal, setShowLeadDownloadModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSaveProfile = () => {
    if (user) {
      updateUser(editForm);
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center p-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to Zameen Dekho</h2>
            <p className="text-muted-foreground mb-6">Please login to access your profile and manage your properties</p>
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="bg-zameen-gradient text-white"
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background relative">
        {/* Gradient overlay at top */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        
        <div className="px-4 pt-2 space-y-6">
          {/* Profile Header */}
          <div className="bg-card rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-zameen-gradient rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder="Full Name"
                    />
                    <Input
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      placeholder="Email"
                      type="email"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-bold text-foreground">{user?.name}</h2>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{user?.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSaveProfile}
                      size="sm"
                      className="bg-zameen-gradient text-white"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      size="sm"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
                  >
                    <Edit className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>

            {/* List Property Button */}
            <button 
              onClick={() => setShowListPropertyModal(true)}
              className="w-full py-3 bg-zameen-gradient text-white font-medium rounded-xl hover:shadow-lg transition-all tap-scale flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              List My Property
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setShowNotificationPanel(true)}
              className="bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all tap-scale"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Bell className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <p className="text-sm text-muted-foreground">View updates</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => setShowLeadDownloadModal(true)}
              className="bg-card rounded-2xl p-4 border border-border hover:border-primary/50 transition-all tap-scale"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Download className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Download Leads</h3>
                  <p className="text-sm text-muted-foreground">Export data</p>
                </div>
              </div>
            </button>
          </div>

          {/* Property Management */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Building className="w-5 h-5" />
                Property Management
              </h3>
            </div>

            <button className="flex items-center justify-between w-full p-4 hover:bg-muted/20 transition-colors border-b border-border">
              <span className="text-foreground">My Listed Properties</span>
              <span className="text-sm text-muted-foreground">3 active</span>
            </button>

            <button className="flex items-center justify-between w-full p-4 hover:bg-muted/20 transition-colors border-b border-border">
              <span className="text-foreground">Property Analytics</span>
              <span className="text-sm text-muted-foreground">View stats</span>
            </button>

            <button className="flex items-center justify-between w-full p-4 hover:bg-muted/20 transition-colors">
              <span className="text-foreground">Lead Management</span>
              <span className="text-sm text-muted-foreground">12 new</span>
            </button>
          </div>

          {/* Settings */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">Settings</h3>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="text-foreground font-medium">
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </span>
              <button
                onClick={toggleTheme}
                className={cn(
                  "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
                  theme === 'dark' ? 'bg-zameen-gradient' : 'bg-muted'
                )}
              >
                <span
                  className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                    theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                  )}
                />
              </button>
            </div>

            <button className="flex items-center justify-between w-full p-4 hover:bg-muted/20 transition-colors border-b border-border">
              <span className="text-foreground">Privacy Settings</span>
              <span className="text-sm text-muted-foreground">Manage</span>
            </button>

            <button className="flex items-center justify-between w-full p-4 hover:bg-muted/20 transition-colors border-b border-border">
              <span className="text-foreground">Account Settings</span>
              <span className="text-sm text-muted-foreground">Update</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ListPropertyModal 
        isOpen={showListPropertyModal} 
        onClose={() => setShowListPropertyModal(false)} 
      />
      <NotificationPanel 
        isOpen={showNotificationPanel} 
        onClose={() => setShowNotificationPanel(false)} 
      />
      <LeadDownloadModal 
        isOpen={showLeadDownloadModal} 
        onClose={() => setShowLeadDownloadModal(false)} 
      />
    </>
  );
};

export default Profile;