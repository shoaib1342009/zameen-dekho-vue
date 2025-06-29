import { useState } from 'react';
import { X, Upload, Camera, MapPin, Home, DollarSign, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PropertyImage {
  id: string;
  file: File;
  preview: string;
  isCover: boolean;
}

const ListPropertyModal = ({ isOpen, onClose }: ListPropertyModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    listingType: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    amenities: [] as string[],
    contactName: '',
    contactPhone: '',
    contactEmail: '',
  });

  const availableAmenities = [
    'Swimming Pool', 'Gym', 'Parking', 'Security', 'Garden', 'Elevator',
    'Power Backup', 'Water Supply', 'Internet', 'Club House', 'Playground', 'CCTV'
  ];

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
            isCover: images.length === 0, // First image is cover by default
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (imageId: string) => {
    setImages(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      // If we removed the cover image, make the first remaining image the cover
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

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = () => {
    // Here you would typically send the data to your backend
    console.log('Property Data:', formData);
    console.log('Images:', images);
    
    // Show success message
    alert('Property listed successfully!');
    onClose();
    
    // Reset form
    setCurrentStep(1);
    setImages([]);
    setFormData({
      title: '',
      description: '',
      propertyType: '',
      listingType: '',
      price: '',
      area: '',
      bedrooms: '',
      bathrooms: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      amenities: [],
      contactName: '',
      contactPhone: '',
      contactEmail: '',
    });
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-card rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h3 className="text-xl font-bold text-foreground">List Your Property</h3>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
          >
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
                <label className="block text-sm font-medium text-foreground mb-2">Property Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Spacious 3BHK Apartment in Prime Location"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Property Type</label>
                  <Select value={formData.propertyType} onValueChange={(value) => setFormData({ ...formData, propertyType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="penthouse">Penthouse</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="duplex">Duplex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Listing Type</label>
                  <Select value={formData.listingType} onValueChange={(value) => setFormData({ ...formData, listingType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">For Sale</SelectItem>
                      <SelectItem value="rent">For Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Price ({formData.listingType === 'rent' ? 'per month' : 'total'})
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter price in ₹"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Area (sq ft)</label>
                  <Input
                    type="number"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="Enter area"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bedrooms</label>
                  <Select value={formData.bedrooms} onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 BHK</SelectItem>
                      <SelectItem value="2">2 BHK</SelectItem>
                      <SelectItem value="3">3 BHK</SelectItem>
                      <SelectItem value="4">4 BHK</SelectItem>
                      <SelectItem value="5">5+ BHK</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Bathrooms</label>
                  <Select value={formData.bathrooms} onValueChange={(value) => setFormData({ ...formData, bathrooms: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="3">3</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="5">5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amenities</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => toggleAmenity(amenity)}
                      className={`p-2 text-xs rounded-lg border transition-all ${
                        formData.amenities.includes(amenity)
                          ? 'bg-blue-500/10 border-blue-500 text-blue-500'
                          : 'bg-card border-border text-muted-foreground hover:border-muted-foreground/50'
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Images */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h4 className="text-lg font-semibold">Location & Images</h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Address</label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="State"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pincode</label>
                  <Input
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Property Images</label>
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
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload images</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload multiple images (JPG, PNG)</p>
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
                              <Camera className="w-3 h-3" />
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
                <label className="block text-sm font-medium text-foreground mb-2">Contact Name</label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contact Phone</label>
                <Input
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  placeholder="Your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Contact Email</label>
                <Input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="Your email address"
                />
              </div>

              {/* Summary */}
              <div className="bg-muted/20 rounded-lg p-4 mt-6">
                <h5 className="font-semibold text-foreground mb-2">Property Summary</h5>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Title:</strong> {formData.title || 'Not specified'}</p>
                  <p><strong>Type:</strong> {formData.propertyType} - {formData.listingType}</p>
                  <p><strong>Price:</strong> ₹{formData.price || '0'}</p>
                  <p><strong>Area:</strong> {formData.area || '0'} sq ft</p>
                  <p><strong>Configuration:</strong> {formData.bedrooms} BHK, {formData.bathrooms} Bath</p>
                  <p><strong>Images:</strong> {images.length} uploaded</p>
                </div>
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
              className="bg-zameen-gradient text-white"
            >
              List Property
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPropertyModal;