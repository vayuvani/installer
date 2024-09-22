const fs = require('fs');
const path = require('path');

// Define paths
const versionsDir = path.join(__dirname, 'versions');
const manifestPath = path.join(__dirname, 'manifest.json');

// Initialize manifest object
const manifest = {
  "name": "VayuVani",
  "new_install_prompt_erase": true,
  "builds": []
};

// Supported chip families and their corresponding IDs
const chipFamilies = [
  { name: "ESP32", id: "esp32" },
  { name: "ESP32-C3", id: "esp32c3" },
  { name: "ESP32-S3", id: "esp32s3" }
];

// Read all version directories
const versionDirs = fs.readdirSync(versionsDir).filter(file =>
    fs.statSync(path.join(versionsDir, file)).isDirectory()
);

// Iterate over each version directory
versionDirs.forEach(versionId => {
  chipFamilies.forEach(({ name: chipFamily, id: chipId }) => {
    const binFilename = `VayuVani-${versionId}-${chipId}_merged.bin`;
    const binRelativePath = path.join('versions', versionId, binFilename);
    const binAbsolutePath = path.join(versionsDir, versionId, binFilename);

    if (fs.existsSync(binAbsolutePath)) {
      // Find or create the build entry for this chip family
      let build = manifest.builds.find(b => b.chipFamily === chipFamily);
      if (!build) {
        build = {
          "chipFamily": chipFamily,
          "variants": []
        };
        manifest.builds.push(build);
      }

      // Add the variant for this version
      build.variants.push({
        "name": `Version ${versionId}`,
        "parts": [
          { "path": `./${binRelativePath}`, "offset": 0 }
        ]
      });
    }
  });
});

// Write the manifest to file
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Manifest generated at ${manifestPath}`);
