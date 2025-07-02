
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-8">
      <div className="px-4 py-8 space-y-6">
        {/* Company Info */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-blue-600 mb-2">Zameen Dekho</h3>
          <p className="text-sm text-muted-foreground">
            Your trusted partner in finding the perfect home
          </p>
        </div>

        {/* Contact Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-blue-600" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-blue-600" />
            <span>info@zameendekho.com</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Mumbai, India</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4">
          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Facebook className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Twitter className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Instagram className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors">
            <Linkedin className="w-4 h-4" />
          </button>
        </div>

        {/* Copyright */}
        <div className="text-center text-xs text-muted-foreground border-t border-border pt-4">
          <p>© 2024 Zameen Dekho. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
