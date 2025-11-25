// Price formatting and calculation utilities
export const formatPrice = (
  price: string | number,
  currency: string = 'MAD'
): string => {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;

  if (isNaN(numPrice)) return `0 ${currency}`;

  return `${numPrice.toFixed(2)} ${currency}`;
};

export const calculateDiscount = (
  originalPrice: string,
  dealPrice: string
): number => {
  const original = parseFloat(originalPrice);
  const deal = parseFloat(dealPrice);

  if (isNaN(original) || isNaN(deal) || original === 0) return 0;

  const discount = ((original - deal) / original) * 100;
  return Math.round(discount);
};

export const calculateSavings = (
  originalPrice: string,
  dealPrice: string
): string => {
  const original = parseFloat(originalPrice);
  const deal = parseFloat(dealPrice);

  if (isNaN(original) || isNaN(deal)) return '0';

  const savings = original - deal;
  return savings.toFixed(2);
};

export const validatePrice = (price: string): boolean => {
  const numPrice = parseFloat(price);
  return !isNaN(numPrice) && numPrice >= 0;
};

export const comparePrices = (price1: string, price2: string): number => {
  const p1 = parseFloat(price1);
  const p2 = parseFloat(price2);

  if (isNaN(p1) || isNaN(p2)) return 0;

  return p1 - p2;
};
