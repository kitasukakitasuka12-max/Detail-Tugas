
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const generateRandomCommission = (): number => {
  // Random percentage between 20% and 50%
  return Math.floor(Math.random() * (50 - 20 + 1)) + 20;
};
