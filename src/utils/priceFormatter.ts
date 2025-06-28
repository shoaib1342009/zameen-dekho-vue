
export const formatPrice = (priceString: string): string => {
  // Remove currency symbols and commas
  const numericValue = parseFloat(priceString.replace(/[₹,]/g, ''));
  
  if (isNaN(numericValue)) {
    return priceString; // Return original if not a valid number
  }
  
  if (numericValue >= 10000000) { // 1 Crore = 10,000,000
    return `₹${(numericValue / 10000000).toFixed(2)} Cr`;
  } else if (numericValue >= 100000) { // 1 Lakh = 100,000
    return `₹${(numericValue / 100000).toFixed(2)} L`;
  } else if (numericValue >= 1000) {
    return `₹${(numericValue / 1000).toFixed(2)} K`;
  } else {
    return `₹${numericValue.toFixed(0)}`;
  }
};
