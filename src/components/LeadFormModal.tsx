
import { useState } from 'react';
import { X } from 'lucide-react';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LeadFormModal = ({ isOpen, onClose }: LeadFormModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage (simulate saving to database)
    localStorage.setItem('user-contact', JSON.stringify(formData));
    console.log('Lead form submitted:', formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl p-6 w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-zameen-gradient text-white font-medium rounded-xl hover:shadow-lg transition-all tap-scale"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default LeadFormModal;
