
export const formatPrice = (price: string): string => {
  // Remove currency symbol and convert to number
  const numericPrice = parseFloat(price.replace(/[₹,]/g, ''));
  
  if (numericPrice >= 10000000) { // 1 Cr or more
    return `₹${(numericPrice / 10000000).toFixed(2)} Cr`;
  } else if (numericPrice >= 100000) { // 1 L or more
    return `₹${(numericPrice / 100000).toFixed(2)} L`;
  } else if (numericPrice >= 1000) { // 1 K or more
    return `₹${(numericPrice / 1000).toFixed(2)} K`;
  }
  
  return `₹${numericPrice.toLocaleString()}`;
};
