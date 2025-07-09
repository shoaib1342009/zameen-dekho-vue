
import { useState } from 'react';
import { X, Upload, Video, Image, Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProperty } from '@/contexts/PropertyContext';
import { useToast } from '@/hooks/use-toast';

interface EnhancedListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const availableAmenities = [
  'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Elevator',
  'Power Backup', 'Water Supply', 'Internet', 'Club House', 'Playground', 
  'CCTV', 'WiFi', 'AC', 'Balcony', 'Furnished', 'Pet Friendly'
];

const EnhancedListPropertyModal = ({ isOpen, onClose }: EnhancedListPropertyModalProps) => {
  const { addProperty } = useProperty();
  const { toast } = useToast();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [uploadedVideo, setUploadedVideo] = useState<string>('');
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

    // Use uploaded images or fallback to default
    const propertyImages = uploadedImages.length > 0 
      ? uploadedImages 
      : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop'];

    addProperty({
      ...formData,
      image: propertyImages[0],
      images: propertyImages,
      videoUrl: uploadedVideo || formData.videoUrl
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
    setUploadedImages([]);
    setUploadedVideo('');

    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Simulate image upload - in real app, you'd upload to server
      const newImages: string[] = [];
      
      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const imageUrl = event.target.result as string;
            newImages.push(imageUrl);
            
            if (newImages.length === files.length) {
              setUploadedImages(prev => [...prev, ...newImages]);
              toast({
                title: "Images Uploaded!",
                description: `${files.length} image(s) uploaded successfully`,
              });
            }
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const videoUrl = event.target.result as string;
          setUploadedVideo(videoUrl);
          toast({
            title: "Video Uploaded!",
            description: "Video uploaded successfully",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
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

          {/* Amenities Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border border-border rounded-md p-3">
              {availableAmenities.map((amenity) => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={`flex items-center gap-2 p-2 text-sm rounded transition-colors ${
                    formData.amenities.includes(amenity)
                      ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                      : 'hover:bg-muted/50'
                  }`}
                >
                  <div className={`w-4 h-4 border rounded ${
                    formData.amenities.includes(amenity)
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-muted-foreground'
                  } flex items-center justify-center`}>
                    {formData.amenities.includes(amenity) && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  {amenity}
                </button>
              ))}
            </div>
            {formData.amenities.length > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                Selected: {formData.amenities.join(', ')}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Property Images</label>
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <Image className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload images</span>
                  <span className="text-xs text-muted-foreground">You can select multiple images</span>
                </label>
              </div>
              
              {/* Show uploaded images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Upload ${index + 1}`} 
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                  {uploadedVideo && (
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
