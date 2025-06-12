// set-local-ip.js
const fs = require('fs');
const os = require('os');
const path = require('path');

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === 'IPv4' && !config.internal) {
        // Private IP range check (10.x.x.x or 192.168.x.x)
        if (config.address.startsWith('10.') || config.address.startsWith('192.168.') || config.address.startsWith('172.')) {
          return config.address;
        }
      }
    }
  }
  return '127.0.0.1'; // fallback
}

const ip = getLocalIpAddress();
const envPath = path.join(__dirname, '.env');
// const envContent = `EXPO_PUBLIC_BACKEND_IP=${ip}\n`;
const port = 3000; // You can change this if needed

const envContent = `EXPO_PUBLIC_BACKEND_IP=${ip}\nEXPO_PUBLIC_BACKEND_PORT=${port}\n`;


fs.writeFileSync(envPath, envContent);
console.log(`✅ Saved local IP (${ip}) to .env file`);
