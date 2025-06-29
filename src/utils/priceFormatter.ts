export const formatPrice = (price: string): string => {
  const numPrice = parseInt(price);
  
  if (numPrice >= 10000000) {
    return `₹${(numPrice / 10000000).toFixed(2)} Cr`;
  } else if (numPrice >= 100000) {
    return `₹${(numPrice / 100000).toFixed(2)} L`;
  } else if (numPrice >= 1000) {
    return `₹${(numPrice / 1000).toFixed(0)} K`;
  } else {
    return `₹${numPrice.toLocaleString()}`;
  }
};

export const formatRentPrice = (price: string): string => {
  const numPrice = parseInt(price);
  
  if (numPrice >= 100000) {
    return `₹${(numPrice / 100000).toFixed(2)} L/month`;
  } else if (numPrice >= 1000) {
    return `₹${(numPrice / 1000).toFixed(0)} K/month`;
  } else {
    return `₹${numPrice.toLocaleString()}/month`;
  }
};