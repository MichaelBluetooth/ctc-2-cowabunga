import { defineConfig, loadEnv } from 'vite';
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Explicitly load .env files for the current mode
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      https: {
        key: fs.readFileSync('./localhost+2-key.pem'),
        cert: fs.readFileSync('./localhost+2.pem')
      },
      host: '0.0.0.0',
    },
    base: env.VITE_BASE_URL || '/aaaaaaaaaaa',
    build: {
      outDir: 'dist',
    }
  };
});
