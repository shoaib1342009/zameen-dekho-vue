
import { useState } from 'react';
import { User, Edit, ChevronDown, LogOut } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Profile = () => {
  const { theme, toggleTheme } = useTheme();
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
  });

  const menuItems = [
    { label: 'My listing leads', icon: ChevronDown },
    { label: 'My Submissions', icon: ChevronDown },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-zameen-gradient rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{userInfo.name}</h2>
              <p className="text-sm text-muted-foreground">{userInfo.phone}</p>
              <p className="text-sm text-muted-foreground">{userInfo.email}</p>
            </div>
            <button className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale">
              <Edit className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* List Property Button */}
          <button className="w-full py-3 bg-zameen-gradient text-white font-medium rounded-xl hover:shadow-lg transition-all tap-scale">
            List My Property
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                theme === 'dark' ? 'bg-zameen-gradient' : 'bg-muted'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Menu Items */}
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center justify-between w-full p-4 hover:bg-muted/20 transition-colors border-b border-border last:border-b-0"
            >
              <span className="text-foreground">{item.label}</span>
              <item.icon className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}

          {/* Logout */}
          <button className="flex items-center gap-3 w-full p-4 text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
