
import { Calendar, TrendingUp } from 'lucide-react';

const NewsUpdates = () => {
  const news = [
    {
      title: "Property Prices Rise by 8% in Mumbai",
      date: "2 days ago",
      category: "Market Update",
      coverImage: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=200&fit=crop"
    },
    {
      title: "New RERA Guidelines for Homebuyers",
      date: "1 week ago",
      category: "Regulation",
      coverImage: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=200&fit=crop"
    },
    {
      title: "Best Time to Invest in Real Estate",
      date: "2 weeks ago",
      category: "Investment",
      coverImage: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=200&fit=crop"
    },
    {
      title: "Smart Home Technology Trends",
      date: "3 weeks ago",
      category: "Technology",
      coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop"
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Latest News</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {news.map((item, index) => (
          <div key={index} className="bg-card rounded-xl overflow-hidden border border-border">
            <img 
              src={item.coverImage} 
              alt={item.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{item.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsUpdates;
