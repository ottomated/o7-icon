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
const dest = fileURLToPath(import.meta.resolve('../../../dist/lucide'));

const names: string[] = [];

let id = 0;
for await (const icon of icons.scan(src)) {
	const svg = await Bun.file(join(src, icon)).text().then(parseSvg);

	const name = toPascalCase(icon.replace('.svg', ''));
	names.push(name);
	const [js, dts] = generateComponent(id, name, svg);
	await Bun.write(join(dest, name + '.svelte'), js);
	await Bun.write(join(dest, name + '.svelte.d.ts'), dts);
	id += 1;
}

const index = names
	.map((name) => `export {default as ${name}} from './${name}.svelte';`)
	.join('\n');
await Bun.write(join(dest, 'index.js'), index);
await Bun.write(join(dest, 'index.d.ts'), index);
console.log(`Generated ${id} icons`);

function generateComponent(id: number, name: string, svg: INode): [js: string, dts: string] {
	const src = svg.children.map((child) => stringify(child)).join('');
	svg.children.unshift({
		name: 'rect',
		type: 'element',
		value: '',
		attributes: {
			x: '-2',
			y: '-2',
			width: '28',
			height: '28',
			fill: 'white',
			rx: '2'
		},
		children: []
	});
	svg.attributes.viewBox = '-2 -2 28 28';
	svg.attributes.width = '48';
	svg.attributes.height = '48';
	const base64 = Buffer.from(stringify(svg)).toString('base64');
	const docs = `/** ![img](data:image/svg+xml;base64,${base64}) */`;
	return [
		`<script>import {get_style} from '../common.js';import '../icon.css';import {include_icon} from '../store.js';const {size,style:style_,class:class_,...props}:IconProps=$props();const style=$derived(get_style(size,style_));</script>{#if include_icon(${id})}<svg class="🟃r"><g id="🟃${id}" class="🟃g">${src}</g></svg>{/if}<svg class="🟃i{class_ ? ' ' + class_ : ''}" viewBox="0 0 24 24" {style} {...props}><use href="#🟃${id}" /></svg>`,
		`import {IIC} from '../common.js';declare const ${name}:IIC;\n${docs}\ntype ${name}=InstanceType<typeof ${name}>;export default ${name};`
	];
}
