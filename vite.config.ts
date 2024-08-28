import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { o7Icon } from './src/lib/vite/index.js';

export default defineConfig({
	plugins: [sveltekit(), o7Icon()],
	server: {
		fs: {
			allow: ['dist']
		}
	}
});
