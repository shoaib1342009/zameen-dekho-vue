
import React, { createContext, useContext, useEffect, useState } from 'react';

interface WishlistContextType {
  wishlistItems: number[];
  wishlist: number[]; // Add this for backward compatibility
  addToWishlist: (propertyId: number) => void;
  removeFromWishlist: (propertyId: number) => void;
  isInWishlist: (propertyId: number) => boolean;
  toggleWishlist: (propertyId: number) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<number[]>([]);

  useEffect(() => {
    // Load wishlist from localStorage on app start
    const savedWishlist = localStorage.getItem('zameen-wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem('zameen-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (propertyId: number) => {
    setWishlistItems(prev => {
      if (!prev.includes(propertyId)) {
        return [...prev, propertyId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (propertyId: number) => {
    setWishlistItems(prev => prev.filter(id => id !== propertyId));
  };

  const isInWishlist = (propertyId: number) => {
    return wishlistItems.includes(propertyId);
  };

  const toggleWishlist = (propertyId: number) => {
    if (isInWishlist(propertyId)) {
      removeFromWishlist(propertyId);
    } else {
      addToWishlist(propertyId);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      wishlist: wishlistItems, // Alias for backward compatibility
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
