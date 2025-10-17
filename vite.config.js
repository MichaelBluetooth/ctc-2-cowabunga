import fs from 'fs';
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./localhost+2-key.pem'),
      cert: fs.readFileSync('./localhost+2.pem')
    },
    host: '0.0.0.0', // Listen on all network interfaces
  },
});