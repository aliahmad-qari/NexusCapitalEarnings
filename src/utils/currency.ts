/**
 * Format number as Pakistani Rupees (PKR)
 * @param amount - Amount in PKR
 * @returns Formatted string like "PKR 1,000"
 */
export const formatPKR = (amount: number): string => {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
};

/**
 * Format number as PKR with decimal places
 * @param amount - Amount in PKR
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted string like "PKR 1,000.50"
 */
export const formatPKRDecimal = (amount: number, decimals: number = 2): string => {
  return `PKR ${amount.toLocaleString('en-PK', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

/**
 * Convert display text to number (remove PKR prefix and commas)
 * @param text - Formatted PKR string like "PKR 1,000"
 * @returns Numeric value
 */
export const parsePKR = (text: string): number => {
  return Number(text.replace(/PKR\s|,/g, ''));
};
