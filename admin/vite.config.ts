import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    minify: false,
    sourcemap: false,
    outDir: 'build/dist',
  },
  plugins: [tsconfigPaths(), react()],
  server: {
    proxy: {
      '/internal': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  optimizeDeps: {
    // https://github.com/mui/material-ui/issues/32727#issuecomment-1697253782
    include: ['@mui/material/Tooltip', '@emotion/styled', '@mui/material/Unstable_Grid2'],
  },
});