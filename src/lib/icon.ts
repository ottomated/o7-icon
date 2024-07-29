import { browser } from '$app/environment';
import { getContext } from 'svelte';
import type { Action } from 'svelte/action';
import type { SVGAttributes } from 'svelte/elements';

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

/** include_icon - Abbreviated to `i` because it's copied over thousands of components */
export function i(icon: number) {
	const included_icons = get_included_icons();

	if (included_icons.has(icon)) return false;
	included_icons.add(icon);
	return true;
}

/** noremove - Abbreviated to `n` because it's copied over thousands of components */
// We can never remove the svg instances from the dom because they won't be re-added if the
// icon remounts
export const n: Action<HTMLElement> = function (node) {
	return {
		destroy() {
			document.body.appendChild(node);
		}
	};
};

/** get_style - Abbreviated to `s` because it's copied over thousands of components */
export function s(size: number | undefined, style_: string | null | undefined) {
	if (size === undefined && !style_) return undefined;
	const styles = [];
	if (size !== undefined) styles.push(`--🟃s:${size}px`);
	if (style_) styles.push(style_);

	return styles.join(';');
}

export type IconProps = { size?: number } & Omit<
	SVGAttributes<SVGSVGElement>,
	'viewBox' | 'width' | 'height'
>;

type Empty = Record<string, never>;
export interface IIC {
	new (
		options: import('svelte').ComponentConstructorOptions<IconProps>
	): import('svelte').SvelteComponent<IconProps, Empty, Empty> & {
		$$bindings?: '';
	};
	(
		internal: unknown,
		props: IconProps & {
			$$events?: Empty;
			$$slots?: Empty;
		}
	): Empty;
	z_$$bindings?: '';
}
