
import { Shield, Award, Users, Star } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    {
      icon: Shield,
      title: "RERA Verified",
      description: "All properties are RERA registered"
    },
    {
      icon: Award,
      title: "Best in Class",
      description: "Award-winning real estate platform"
    },
    {
      icon: Users,
      title: "50K+ Happy Customers",
      description: "Trusted by thousands of homebuyers"
    },
    {
      icon: Star,
      title: "4.8 Rating",
      description: "Highly rated on app stores"
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Why Choose Us</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((badge, index) => {
          const IconComponent = badge.icon;
          return (
            <div key={index} className="bg-card rounded-xl p-4 border border-border text-center">
              <IconComponent className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-sm mb-1">{badge.title}</h4>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrustBadges;
