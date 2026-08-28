/**
 * Formatting helpers for currency and dates.
 */

/**
 * Formats a numeric value into USD currency representation ($1,234.56).
 * Handles negative values and invalid inputs gracefully.
 * @param {number|string} amount
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  const numericValue = Number(amount);
  if (isNaN(numericValue)) return '$0.00';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(numericValue);
};

/**
 * Formats a date string formatted as YYYY-MM-DD into "15 Aug 2025".
 * Avoids timezone offset shifts by parsing YYYY, MM, DD explicitly.
 * @param {string} dateString - "YYYY-MM-DD"
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString || typeof dateString !== 'string') return '';

  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;

  const year = parseInt(parts[0], 10);
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(monthIndex) || isNaN(day)) return dateString;

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const monthName = months[monthIndex] || '';
  return `${day} ${monthName} ${year}`;
};
