import { Glob } from 'bun';
import { parse as parseSvg, stringify, type INode } from 'svgson';
import { fileURLToPath } from 'bun';
import { join } from 'node:path';

function toPascalCase(string: string) {
	const camelCase = string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
		p2 ? p2.toUpperCase() : p1.toLowerCase()
	);

	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

const icons = new Glob('*.svg');

const src = fileURLToPath(import.meta.resolve('../../../icons/lucide/icons'));
const dest = import.meta.dir;

const names: string[] = [];

let id = 0;
for await (const icon of icons.scan(src)) {
	const svg = await Bun.file(join(src, icon)).text().then(parseSvg);

	const name = toPascalCase(icon.replace('.svg', ''));
	names.push(name);
	const component = generateComponent(id, svg);
	await Bun.write(join(dest, name + '.svelte'), component);
	id += 1;
}

const index = names
	.map((name) => `export { default as ${name} } from './${name}.svelte';`)
	.join('\n');
await Bun.write(join(dest, 'index.ts'), index);
console.log(`Generated ${id} icons`);
function generateComponent(id: number, svg: INode) {
	const src = svg.children.map((child) => stringify(child)).join('');
	return `<script lang="ts">
	import { get_style, type IconProps } from '../common.js';
	import '../icon.css';
	import { include_icon } from '../store.js';
	const { size, style: style_, class: class_, ...props }: IconProps = $props();
	const style = $derived(get_style(size, style_));
</script>

{#if include_icon(${id})}<svg class="🟃r"><g id="🟃${id}" class="🟃g">${src}</g></svg>{/if}<svg
	class="🟃i{class_ ? ' ' + class_ : ''}"
	viewBox="0 0 24 24"
	{style}
	{...props}><use href="#🟃${id}" /></svg>`;
}
