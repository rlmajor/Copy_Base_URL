const path = require('path');

module.exports = {
  mode: 'development', // Use 'production' for production builds
  entry: './background.js', 
  output: {
    filename: 'bundle.js', // Output bundle file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
};