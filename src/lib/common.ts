import type { SVGAttributes } from 'svelte/elements';

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
