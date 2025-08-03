// utils/earningsCalculator.js
export const calculateEarnings = (posts) => {
  const RATE_PER_VIEW = 0.01;  // ₹0.01 per view
  const RATE_PER_LIKE = 0.05;  // ₹0.05 per like

  let total = 0;
  for (const post of posts) {
    total += post.views * RATE_PER_VIEW + post.likes * RATE_PER_LIKE;
  }
  return Number(total.toFixed(2));
};
