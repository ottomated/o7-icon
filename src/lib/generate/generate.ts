import { getIconPacks, toPascalCase } from './common.js';
import { join, relative, basename } from 'node:path';
import { parse as parseSvg, stringify, type INode } from 'svgson';
import basex from 'base-x';
import { Glob } from 'bun';
import chalk from 'chalk';

const base62 = basex('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');

function intToBase62(int: number) {
	const bytes: number[] = [];
	while (int > 0) {
		bytes.push(int & 0xff);
		int >>= 8;
	}
	return base62.encode(bytes);
}

let id = 1;
function getId() {
	const oldId = id;
	id += 1;
	return [oldId, intToBase62(id)] as const;
}

for await (const { name, meta, sourceRoot, destRoot } of getIconPacks()) {
	for (const [dest, source] of Object.entries(meta.sources)) {
		console.log(`Generating ${chalk.blue.bold(join(name, dest))}`);
		const attributes = new Map<string, number>();
		const destPath = join(destRoot, dest);
		const relativePath = join(relative(destPath, destRoot), '..');

		const names: string[] = [];

		const glob = new Glob(source.glob);

		function getName(icon: string) {
			const name = basename(icon, '.svg');
			if (source.stripSuffix && name.endsWith(source.stripSuffix))
				return name.substring(0, name.length - source.stripSuffix.length);
			return name;
		}

		for await (const icon of glob.scan(sourceRoot)) {
			const svg = await Bun.file(join(sourceRoot, icon)).text().then(parseSvg);
			delete svg.attributes.xmlns;
			const currentAttributes = JSON.stringify(svg.attributes);
			if (!attributes.has(currentAttributes)) {
				attributes.set(currentAttributes, 1);
			} else {
				attributes.set(currentAttributes, attributes.get(currentAttributes)! + 1);
			}
			let name = toPascalCase(getName(icon));
			if (/^\d/.test(name)) name = `_${name}`;
			names.push(name);
			const id = getId();
			const js = generateComponent(id, source.class, relativePath, svg);
			const dts = generateIconTypes(name, svg);
			await Bun.write(join(destPath, name + '.svelte'), js);
			await Bun.write(join(destPath, name + '.svelte.d.ts'), dts);
		}
		await writeIndex(names, destPath);
		console.log(`  ${chalk.yellow(names.length)} icons`);
		if (attributes.size === 1) {
			console.log(`  ${chalk.green('All attributes match!')}`);
			console.log(`    ${chalk.red(attributes.keys().next().value)}`);
		} else {
			console.log('  Attributes:');
			for (const [attr, count] of attributes.entries()) {
				console.log(`    ${count.toString().padStart(4, ' ')}× ${chalk.red(attr)}`);
			}
		}
		console.log();
	}
}

function generateComponent(
	id: readonly [number, string],
	class_: string,
	relativePath: string,
	svg: INode
) {
	const src = svg.children.map((child) => stringify(child));
	return [
		`<script>`,
		`import {s,i,n} from '${relativePath}/icon.js';`,
		`import '${relativePath}/icon.css';`,
		`const {size,style:st,class:c,...props}=$props();`,
		`const style=$derived(s(size,st));`,
		`</script>`,
		`{#if i(${id[0]})}`,
		`<svg class="🟃r" use:n><g id="🟃${id[1]}" class="${class_}">`,
		...src,
		`</g></svg>`,
		`{/if}`,
		`<svg class="🟃i{c?' '+c:''}" viewBox="0 0 24 24" {style} {...props}>`,
		`<use href="#🟃${id[1]}" />`,
		`</svg>`
	].join('');
}

function generateIconTypes(name: string, old: INode) {
	const svg = structuredClone(old);
	const size = Number(svg.attributes.viewBox.split(' ')[2]);
	const margin = 2;
	svg.children.unshift({
		name: 'rect',
		type: 'element',
		value: '',
		attributes: {
			x: `-${margin}`,
			y: `-${margin}`,
			width: `${size + margin * 2}`,
			height: `${size + margin * 2}`,
			fill: 'white',
			rx: margin.toString()
		},
		children: []
	});
	svg.attributes.viewBox = `-${margin} -${margin} ${size + margin * 2} ${size + margin * 2}`;
	svg.attributes.width = '48';
	svg.attributes.height = '48';
	svg.attributes.xmlns = 'http://www.w3.org/2000/svg';
	const base64 = Buffer.from(stringify(svg)).toString('base64');
	const docs = `/** ![img](data:image/svg+xml;base64,${base64}) */`;
	return `import {Icon} from '../icon.js';declare const ${name}:Icon;\n${docs}\ntype ${name}=InstanceType<typeof ${name}>;export default ${name};`;
}

async function writeIndex(names: string[], dest: string) {
	const index = names
		.map((name) => `export {default as ${name}} from './${name}.svelte';`)
		.join('\n');
	await Bun.write(join(dest, 'index.js'), index);
	await Bun.write(join(dest, 'index.d.ts'), index);
}
