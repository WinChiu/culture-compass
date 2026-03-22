import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use the GitHub Pages subpath only in CI deploys.
const githubPagesBase = '/culture-compass/';

export default defineConfig(() => ({
  base:
    process.env.VITE_BASE_PATH ||
    (process.env.GITHUB_ACTIONS === 'true' ? githubPagesBase : '/'),
  plugins: [react()],
}));
