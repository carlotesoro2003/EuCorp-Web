// vite.config.js
import { defineConfig } from 'vite'
import { sveltekit } from '@sveltejs/kit/vite'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
	  autoInstall: true,
    })
  ],
  server: {
    port: 5173, // Vite's frontend dev server
    proxy: {
        '/api': {
            target: 'http://localhost:3000', // Backend service
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '') // Remove /api prefix
        }
    }
}
})