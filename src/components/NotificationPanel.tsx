import { useState } from 'react';
import { X, Bell, Heart, Eye, MessageCircle, Calendar, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Notification {
  id: string;
  type: 'lead' | 'wishlist' | 'view' | 'message';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  propertyTitle?: string;
  userInfo?: {
    name: string;
    phone: string;
  };
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'lead',
    title: 'New Lead Received',
    message: 'Someone is interested in your 3BHK Apartment in Nerul',
    time: '2 hours ago',
    isRead: false,
    propertyTitle: '3BHK Apartment in Nerul',
    userInfo: {
      name: 'Rahul Sharma',
      phone: '+91 98765 43210'
    }
  },
  {
    id: '2',
    type: 'wishlist',
    title: 'Property Wishlisted',
    message: 'Your Villa in Kharghar was added to wishlist',
    time: '4 hours ago',
    isRead: false,
    propertyTitle: 'Villa in Kharghar'
  },
  {
    id: '3',
    type: 'view',
    title: 'Property Viewed',
    message: '15 people viewed your Penthouse in Vashi today',
    time: '6 hours ago',
    isRead: true,
    propertyTitle: 'Penthouse in Vashi'
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'You have a new inquiry about your property',
    time: '1 day ago',
    isRead: true,
    propertyTitle: '2BHK Flat in Airoli'
  },
  {
    id: '5',
    type: 'lead',
    title: 'Lead Update',
    message: 'Priya Patel wants to schedule a visit',
    time: '2 days ago',
    isRead: true,
    propertyTitle: 'Studio Apartment in Seawoods',
    userInfo: {
      name: 'Priya Patel',
      phone: '+91 87654 32109'
    }
  }
];

const NotificationPanel = ({ isOpen, onClose }: NotificationPanelProps) => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'leads'>('all');

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'lead':
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case 'wishlist':
        return <Heart className="w-5 h-5 text-red-500" />;
      case 'view':
        return <Eye className="w-5 h-5 text-green-500" />;
      case 'message':
        return <MessageCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.isRead;
    if (filter === 'leads') return notif.type === 'lead';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Bell className="w-6 h-6" />
              Notifications
            </h3>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-border">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === 'all' 
                  ? 'bg-zameen-gradient text-white' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === 'unread' 
                  ? 'bg-zameen-gradient text-white' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('leads')}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                filter === 'leads' 
                  ? 'bg-zameen-gradient text-white' 
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              Leads
            </button>
          </div>
          
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              variant="outline"
              size="sm"
              className="mt-2 w-full"
            >
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[50vh]">
          {filteredNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications found</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`p-4 border-b border-border cursor-pointer hover:bg-muted/20 transition-colors ${
                  !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className={`text-sm font-medium ${
                        !notification.isRead ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    {notification.propertyTitle && (
                      <p className="text-xs text-primary mt-1">
                        {notification.propertyTitle}
                      </p>
                    )}
                    {notification.userInfo && (
                      <div className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                        <p><strong>Contact:</strong> {notification.userInfo.name}</p>
                        <p><strong>Phone:</strong> {notification.userInfo.phone}</p>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;