import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { o7Icon } from './src/lib/vite/index.js';
import inspector from 'vite-plugin-inspect';

export default defineConfig({
	plugins: [o7Icon(), sveltekit(), inspector()],
	server: {
		fs: {
			allow: ['dist']
		}
	}
});
