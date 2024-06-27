import type { SVGAttributes } from 'svelte/elements';

export function get_style(size: number | undefined, style_: string | null | undefined) {
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
