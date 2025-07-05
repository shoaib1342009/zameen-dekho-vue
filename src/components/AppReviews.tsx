
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
    },
    {
      name: "Vikram Singh",
      rating: 5,
      review: "Amazing experience! Found exactly what I was looking for.",
      location: "Pune",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Sneha Reddy",
      rating: 4,
      review: "User-friendly interface and quick response from agents.",
      location: "Hyderabad",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Arjun Kumar",
      rating: 5,
      review: "Transparent pricing and no hidden charges. Highly satisfied!",
      location: "Chennai",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const firstRowReviews = reviews.slice(0, 3);
  const secondRowReviews = reviews.slice(3, 6);

  const ReviewCard = ({ review, index }: { review: typeof reviews[0], index: number }) => (
    <div className="bg-card rounded-xl p-4 border border-border flex-shrink-0 w-72 mx-2">
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
  );

  return (
    <div className="w-full overflow-hidden">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-6">What Our Customers Say</h3>
      
      {/* First row - slides left to right */}
      <div className="relative mb-4">
        <div className="flex animate-scroll-left">
          {[...firstRowReviews, ...firstRowReviews].map((review, index) => (
            <ReviewCard key={`row1-${index}`} review={review} index={index} />
          ))}
        </div>
      </div>

      {/* Second row - slides right to left */}
      <div className="relative">
        <div className="flex animate-scroll-right">
          {[...secondRowReviews, ...secondRowReviews].map((review, index) => (
            <ReviewCard key={`row2-${index}`} review={review} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppReviews;
