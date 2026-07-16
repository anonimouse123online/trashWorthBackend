/**
 * Material points multiplier table (points per kilogram)
 */
const POINT_MULTIPLIERS = {
  plastic: 10,
  paper: 5,
  metal: 15,
  glass: 8,
  organic: 2,
  'e-waste': 30,
  other: 1
};

/**
 * Calculates reward points and estimated monetary value for a trash submission.
 * @param {number} weight - Weight of the material in kilograms.
 * @param {string} category - Type of waste material.
 * @returns {object} Calculated points and estimated cash value.
 */
const calculateIncentive = (weight, category) => {
  const normalizedCategory = (category || 'other').toLowerCase();
  
  // Get multiplier or default to 'other' multiplier
  const multiplier = POINT_MULTIPLIERS[normalizedCategory] !== undefined 
    ? POINT_MULTIPLIERS[normalizedCategory] 
    : POINT_MULTIPLIERS.other;

  // Calculate points (rounded to 2 decimal places)
  const pointsEarned = Math.round(weight * multiplier * 100) / 100;

  // Estimated monetary value (e.g., 100 points = 1.00 USD/currency unit)
  const estimatedValue = Math.round((pointsEarned * 0.01) * 100) / 100;

  return {
    category: normalizedCategory,
    weight,
    multiplier,
    pointsEarned,
    estimatedValue
  };
};

module.exports = {
  POINT_MULTIPLIERS,
  calculateIncentive
};
