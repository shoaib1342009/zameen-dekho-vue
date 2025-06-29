import { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'phone' | 'details' | 'otp';

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const { login } = useAuth();
  const [step, setStep] = useState<AuthStep>('phone');
  const [formData, setFormData] = useState({
    phone: '',
    name: '',
    email: '',
    otp: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [generatedOTP, setGeneratedOTP] = useState('');

  if (!isOpen) return null;

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.phone.length !== 10) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const otp = generateOTP();
    setGeneratedOTP(otp);
    console.log('Generated OTP:', otp); // In real app, this would be sent via SMS
    alert(`Your OTP is: ${otp} (This is for demo purposes)`);
    
    setStep('details');
    setIsLoading(false);
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStep('otp');
    setIsLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.otp !== generatedOTP) {
      alert('Invalid OTP. Please try again.');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create user object
    const user = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: `+91${formData.phone}`,
      isVerified: true,
    };
    
    login(user);
    setIsLoading(false);
    onClose();
    
    // Reset form
    setFormData({ phone: '', name: '', email: '', otp: '' });
    setStep('phone');
  };

  const handleBack = () => {
    if (step === 'details') setStep('phone');
    if (step === 'otp') setStep('details');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in">
      <div className="bg-card rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full max-w-sm sm:max-w-md animate-scale-in">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            {step !== 'phone' && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-muted/20 rounded-full transition-colors"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </button>
            )}
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              {step === 'phone' && 'Welcome to Zameen Dekho'}
              {step === 'details' && 'Complete Your Profile'}
              {step === 'otp' && 'Verify Your Phone'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-muted/20 rounded-full transition-colors tap-scale"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </button>
        </div>

        {step === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Phone Number
              </label>
              <div className="flex">
                <div className="flex items-center px-2 sm:px-3 bg-muted rounded-l-xl border border-r-0 border-border">
                  <span className="text-sm text-foreground">+91</span>
                </div>
                <Input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                  className="rounded-l-none text-sm sm:text-base"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={formData.phone.length !== 10 || isLoading}
              className="w-full bg-zameen-gradient text-white text-sm sm:text-base"
            >
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Button>
          </form>
        )}

        {step === 'details' && (
          <form onSubmit={handleDetailsSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="text-sm sm:text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={!formData.name || !formData.email || isLoading}
              className="w-full bg-zameen-gradient text-white text-sm sm:text-base"
            >
              {isLoading ? 'Processing...' : 'Continue'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOTPSubmit} className="space-y-3 sm:space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Enter OTP
              </label>
              <p className="text-sm text-muted-foreground mb-3">
                We've sent a 6-digit code to +91{formData.phone}
              </p>
              <Input
                type="text"
                required
                maxLength={6}
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value.replace(/\D/g, '') })}
                placeholder="Enter 6-digit OTP"
                className="text-center text-base sm:text-lg tracking-widest"
              />
            </div>
            <Button
              type="submit"
              disabled={formData.otp.length !== 6 || isLoading}
              className="w-full bg-zameen-gradient text-white text-sm sm:text-base"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </Button>
            <button
              type="button"
              onClick={() => {
                const newOTP = generateOTP();
                setGeneratedOTP(newOTP);
                alert(`New OTP: ${newOTP}`);
              }}
              className="w-full text-sm text-primary hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;