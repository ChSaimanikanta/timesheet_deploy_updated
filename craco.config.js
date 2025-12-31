// craco.config.js
// Add this to silence TypeScript warning
// @ts-nocheck

module.exports = {
  babel: {
    plugins: ['transform-remove-console']
  }
};
