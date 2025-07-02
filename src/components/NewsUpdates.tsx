
import { Calendar, TrendingUp } from 'lucide-react';

const NewsUpdates = () => {
  const news = [
    {
      title: "Property Prices Rise by 8% in Mumbai",
      date: "2 days ago",
      category: "Market Update"
    },
    {
      title: "New RERA Guidelines for Homebuyers",
      date: "1 week ago",
      category: "Regulation"
    },
    {
      title: "Best Time to Invest in Real Estate",
      date: "2 weeks ago",
      category: "Investment"
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-4">Latest News</h3>
      <div className="space-y-3">
        {news.map((item, index) => (
          <div key={index} className="bg-card rounded-xl p-4 border border-border">
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
        ))}
      </div>
    </div>
  );
};

export default NewsUpdates;
