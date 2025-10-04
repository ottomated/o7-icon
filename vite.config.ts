import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { o7Icon } from '@o7/icon/vite';
import inspector from 'vite-plugin-inspect';

export default defineConfig({
	plugins: [o7Icon(), sveltekit(), inspector()],
	server: {
		fs: {
			allow: ['dist']
		}
	}
});
