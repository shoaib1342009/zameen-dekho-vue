
import { useState } from 'react';
import { X, Upload, Video, Image, MapPin, Home, DollarSign, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useAmenities } from '@/hooks/useSupabaseProperties';
import { useFileUpload } from '@/hooks/useFileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SupabaseListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: () => void;
}

interface PropertyImage {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
}

const SupabaseListPropertyModal = ({ isOpen, onClose, onPropertyAdded }: SupabaseListPropertyModalProps) => {
  const { user } = useAuth();
  const { amenities } = useAmenities();
  const { uploadImage, uploadVideo, uploading } = useFileUpload();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'Apartment/Flat',
    listing_type: 'For Sale',
    price: '',
    location: '',
    address: '',
    beds: 1,
    baths: 1,
    sqft: 500,
    builder: '',
    tag: 'New',
    seller_name: '',
    seller_phone: '',
    seller_email: '',
    selected_amenities: [] as string[]
  });

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage: PropertyImage = {
            id: Date.now().toString() + Math.random(),
            file,
            preview: event.target?.result as string,
            isCover: images.length === 0,
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      if (filtered.length > 0 && !filtered.some(img => img.isCover)) {
        filtered[0].isCover = true;
      }
      return filtered;
    });
  };

  const setCoverImage = (imageId: string) => {
    setImages(prev => prev.map(img => ({
      ...img,
      isCover: img.id === imageId
    })));
  };

  const toggleAmenity = (amenityId: string) => {
    setFormData(prev => ({
      ...prev,
      selected_amenities: prev.selected_amenities.includes(amenityId)
        ? prev.selected_amenities.filter(id => id !== amenityId)
        : [...prev.selected_amenities, amenityId]
    }));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to list a property",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.location || !formData.price) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      // Insert property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          price: parseInt(formData.price),
          location: formData.location,
          address: formData.address,
          property_type: formData.property_type,
          listing_type: formData.listing_type,
          beds: formData.beds,
          baths: formData.baths,
          sqft: formData.sqft,
          builder: formData.builder,
          tag: formData.tag,
          seller_name: formData.seller_name,
          seller_phone: formData.seller_phone,
          seller_email: formData.seller_email,
        })
        .select()
        .single();

      if (propertyError) throw propertyError;

      // Upload images
      const imagePromises = images.map(async (img) => {
        const imageUrl = await uploadImage(img.file, property.id);
        return supabase.from('property_images').insert({
          property_id: property.id,
          image_url: imageUrl,
          is_cover: img.isCover
        });
      });

      await Promise.all(imagePromises);

      // Set cover image URL
      const coverImage = images.find(img => img.isCover);
      if (coverImage) {
        const coverImageUrl = await uploadImage(coverImage.file, property.id);
        await supabase
          .from('properties')
          .update({ cover_image_url: coverImageUrl })
          .eq('id', property.id);
      }

      // Upload video
      if (videoFile) {
        const videoUrl = await uploadVideo(videoFile, property.id);
        await supabase
          .from('properties')
          .update({ video_url: videoUrl })
          .eq('id', property.id);
      }

      // Add amenities
      const amenityPromises = formData.selected_amenities.map(amenityId =>
        supabase.from('property_amenities').insert({
          property_id: property.id,
          amenity_id: amenityId
        })
      );

      await Promise.all(amenityPromises);

      toast({
        title: "Property Listed Successfully!",
        description: "Your property has been added to the listings",
      });

      onPropertyAdded();
      onClose();
      
      // Reset form
      setCurrentStep(1);
      setImages([]);
      setVideoFile(null);
      setFormData({
        title: '',
        description: '',
        property_type: 'Apartment/Flat',
        listing_type: 'For Sale',
        price: '',
        location: '',
        address: '',
        beds: 1,
        baths: 1,
        sqft: 500,
        builder: '',
        tag: 'New',
        seller_name: '',
        seller_phone: '',
        seller_email: '',
        selected_amenities: []
      });
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: "Error",
        description: "Failed to create property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">List Your Property</h3>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted/20 rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-2">
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-zameen-gradient h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Home className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Basic Information</h4>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Title *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Property Type</label>
                  <select
                    value={formData.property_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, property_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="Apartment/Flat">Apartment/Flat</option>
                    <option value="House/Villa">House/Villa</option>
                    <option value="Office">Office</option>
                    <option value="Shop">Shop</option>
                    <option value="Plot/Land">Plot/Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Listing Type</label>
                  <select
                    value={formData.listing_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, listing_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  >
                    <option value="For Sale">For Sale</option>
                    <option value="For Rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your property in detail..."
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Property Details</h4>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price * (₹)</label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Area (sq ft)</label>
                  <Input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData(prev => ({ ...prev, sqft: parseInt(e.target.value) }))}
                    placeholder="Enter area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Builder/Developer</label>
                <Input
                  value={formData.builder}
                  onChange={(e) => setFormData(prev => ({ ...prev, builder: e.target.value }))}
                  placeholder="e.g., Lodha Group"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amenities</label>
                <div className="grid grid-cols-3 gap-2">
                  {amenities.map((amenity) => (
                    <button
                      key={amenity.id}
                      onClick={() => toggleAmenity(amenity.id)}
                      className={`p-2 text-xs rounded-lg border transition-all ${
                        formData.selected_amenities.includes(amenity.id)
                          ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                          : 'bg-card border-border text-muted-foreground hover:border-muted-foreground/50'
                      }`}
                    >
                      {amenity.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Media */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Location & Media</h4>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., Bandra West, Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Complete Address</label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Images</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload images</p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {images.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.preview}
                          alt="Property"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        {image.isCover && (
                          <div className="absolute top-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                            Cover
                          </div>
                        )}
                        <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!image.isCover && (
                            <button
                              onClick={() => setCoverImage(image.id)}
                              className="bg-blue-500 text-white p-1 rounded text-xs"
                            >
                              Set Cover
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(image.id)}
                            className="bg-red-500 text-white p-1 rounded text-xs"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Property Video (Optional)</label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Video className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload video</p>
                    {videoFile && (
                      <p className="text-xs text-green-600 mt-1">Video selected: {videoFile.name}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Contact Information</h4>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <Input
                  value={formData.seller_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, seller_name: e.target.value }))}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <Input
                  value={formData.seller_phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, seller_phone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.seller_email}
                  onChange={(e) => setFormData(prev => ({ ...prev, seller_email: e.target.value }))}
                  placeholder="Your email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tag</label>
                <select
                  value={formData.tag}
                  onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="New">New</option>
                  <option value="Featured">Featured</option>
                  <option value="Popular">Popular</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border">
          <Button
            onClick={prevStep}
            variant="outline"
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button
              onClick={nextStep}
              className="bg-zameen-gradient text-white"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="bg-zameen-gradient text-white"
            >
              {submitting ? 'Creating...' : 'List Property'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseListPropertyModal;
