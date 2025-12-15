// scripts/build-firefox.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Paths
const distPath = path.resolve(__dirname, '../dist');
const firefoxDistPath = path.resolve(__dirname, '../dist-firefox');

// Cleaning & Copying (dist -> dist-firefox)
console.log('Building for Firefox...');
if (fs.existsSync(firefoxDistPath)) {
    fs.rmSync(firefoxDistPath, { recursive: true, force: true });
}
fs.cpSync(distPath, firefoxDistPath, { recursive: true });

// Reading the Manifest
const manifestPath = path.join(firefoxDistPath, 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));

const backgroundScript = manifest.background?.service_worker;

if (backgroundScript) {
    // Transform for Firefox
    manifest.background = {
        scripts: [backgroundScript], // Changes 'service_worker' to 'scripts'
        type: "module"
    };

    manifest.browser_specific_settings = {
        gecko: {
            id: "aura@sagarsirikonda",
            strict_min_version: "115.0",
            data_collection_permissions: {
                required: ["none"]
            }
        }
    };

    // Saves the new Manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`✅ Firefox build complete! Background script linked: ${backgroundScript}`);
} else {
    console.error('❌ Could not find background.service_worker in manifest!');
    process.exit(1);
}