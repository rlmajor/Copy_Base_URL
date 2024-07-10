const fs = require('fs');
const path = require('path');

const manifest = {
  manifest_version: 2,
  name: "My Firefox Extension",
  version: "1.0",
  description: "A sample Firefox extension.",
  applications: {
    gecko: {
      id: "your-addon-id@example.com", // Replace with your actual add-on ID
      strict_min_version: "42.0"
    }
  }
};

const manifestPath = path.join(__dirname, 'dist', 'manifest.json');

fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2), (err) => {
  if (err) throw err;
  console.log('manifest.json has been created in ./dist');
});