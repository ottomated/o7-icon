import { browser } from '$app/environment';
import { getContext } from 'svelte';

let included_icons: Set<number>;
if (browser) {
	included_icons = new Set();
	if (import.meta.hot) {
		import.meta.hot.on('vite:beforeUpdate', () => {
			included_icons.clear();
		});
	}
}

const ICON_SET = Symbol();

export function get_included_icons() {
	if (browser) return included_icons;

	const context = getContext<{ [ICON_SET]?: Set<number> }>('__svelte__');
	if (!context) throw new Error('SvelteKit global context not found');
	if (!context[ICON_SET]) context[ICON_SET] = new Set();
	return context[ICON_SET];
}

export function include_icon(icon: number) {
	const included_icons = get_included_icons();

	if (included_icons.has(icon)) return false;
	included_icons.add(icon);
	return true;
}
