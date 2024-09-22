const fs = require('fs');
const path = require('path');

// Path to the versions directory
const versionsDir = path.join(__dirname, 'versions');

// Read all directories inside the versions directory
const versions = fs.readdirSync(versionsDir).filter(version => {
  const versionPath = path.join(versionsDir, version);
  return fs.statSync(versionPath).isDirectory();
});

versions.forEach(versionId => {
  const manifest = {
    "name": "VayuVani",
    "version": versionId,
    "new_install_prompt_erase": true,
    "builds": []
  };

  const chipFamilies = [
    { family: "ESP32", id: "esp32" },
    { family: "ESP32-C3", id: "esp32c3" },
    { family: "ESP32-S3", id: "esp32s3" }
  ];

  chipFamilies.forEach(({ family, id }) => {
    const binPath = `./versions/${versionId}/VayuVani-${versionId}-${id}_merged.bin`;
    const absoluteBinPath = path.join(__dirname, binPath);

    if (fs.existsSync(absoluteBinPath)) {
      manifest.builds.push({
        "chipFamily": family,
        "parts": [
          { "path": binPath, "offset": 0 }
        ]
      });
    }
  });

  // Write the manifest file for this version
  const manifestFilename = `manifest_v${versionId}.json`;
  fs.writeFileSync(manifestFilename, JSON.stringify(manifest, null, 2));
  console.log(`Generated ${manifestFilename}`);
});

// After generating all manifest files, write versions.json
fs.writeFileSync('versions.json', JSON.stringify(versions, null, 2));
console.log('Generated versions.json');
