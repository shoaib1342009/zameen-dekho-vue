
import { useState } from 'react';
import { X, Upload, Video, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProperty } from '@/contexts/PropertyContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EnhancedListPropertyModal = ({ isOpen, onClose }: EnhancedListPropertyModalProps) => {
  const { addProperty } = useProperty();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    location: '',
    type: 'Apartment/Flat',
    beds: 1,
    baths: 1,
    sqft: 500,
    description: '',
    address: '',
    builder: '',
    label: 'For Sale',
    tag: 'New',
    amenities: [] as string[],
    image: '',
    images: [] as string[],
    videoUrl: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.price || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    addProperty({
      ...formData,
      images: formData.images.length > 0 ? formData.images : [formData.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop']
    });

    toast({
      title: "Property Listed Successfully!",
      description: "Your property has been added to the listings",
    });

    // Reset form
    setFormData({
      title: '',
      price: '',
      location: '',
      type: 'Apartment/Flat',
      beds: 1,
      baths: 1,
      sqft: 500,
      description: '',
      address: '',
      builder: '',
      label: 'For Sale',
      tag: 'New',
      amenities: [],
      image: '',
      images: [],
      videoUrl: ''
    });

    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server. For demo, we'll use a placeholder
      const imageUrl = `https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&random=${Date.now()}`;
      setFormData(prev => ({
        ...prev,
        image: imageUrl,
        images: [...prev.images, imageUrl]
      }));
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a server. For demo, we'll use a placeholder
      const videoUrl = `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4?random=${Date.now()}`;
      setFormData(prev => ({ ...prev, videoUrl }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">List Your Property</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., 2BHK Apartment in Bandra"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Price *</label>
              <Input
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="e.g., 15000000"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Location *</label>
            <Input
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Bandra West, Mumbai"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Full Address</label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Complete address"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Bedrooms</label>
              <Input
                type="number"
                value={formData.beds}
                onChange={(e) => setFormData(prev => ({ ...prev, beds: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bathrooms</label>
              <Input
                type="number"
                value={formData.baths}
                onChange={(e) => setFormData(prev => ({ ...prev, baths: parseInt(e.target.value) }))}
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sq Ft</label>
              <Input
                type="number"
                value={formData.sqft}
                onChange={(e) => setFormData(prev => ({ ...prev, sqft: parseInt(e.target.value) }))}
                min="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option>Apartment/Flat</option>
                <option>House/Villa</option>
                <option>Office</option>
                <option>Shop</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your property..."
              className="w-full px-3 py-2 border border-border rounded-md bg-background min-h-[80px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Builder/Developer</label>
            <Input
              value={formData.builder}
              onChange={(e) => setFormData(prev => ({ ...prev, builder: e.target.value }))}
              placeholder="e.g., Lodha Group"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Label</label>
              <select
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option>For Sale</option>
                <option>For Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tag</label>
              <select
                value={formData.tag}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option>New</option>
                <option>Featured</option>
                <option>Popular</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Images</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Image className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload images</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Property Video (Optional)</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                  id="video-upload"
                />
                <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Video className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload video</span>
                  {formData.videoUrl && (
                    <span className="text-xs text-green-600">Video uploaded successfully</span>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-zameen-gradient text-white">
              List Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedListPropertyModal;
