
import { Star } from 'lucide-react';

const AppReviews = () => {
  const reviews = [
    {
      name: "Priya Sharma",
      rating: 5,
      review: "Found my dream home through this app. Excellent service!",
      location: "Mumbai",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Rahul Gupta",
      rating: 5,
      review: "Very professional and transparent. Highly recommended!",
      location: "Delhi",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Anita Patel",
      rating: 4,
      review: "Great variety of properties and helpful customer support.",
      location: "Bangalore",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">What Our Customers Say</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3 mb-3">
              <img 
                src={review.avatar} 
                alt={review.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{review.name}</span>
                  <span className="text-xs text-muted-foreground">• {review.location}</span>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppReviews;
