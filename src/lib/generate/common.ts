import { join, dirname } from 'node:path';
import { Glob } from 'bun';

export function toPascalCase(string: string) {
	const camelCase = string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
		p2 ? p2.toUpperCase() : p1.toLowerCase()
	);

	return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

type Meta = {
	git: string;
	sources: {
		[key: string]: {
			glob: string;
			class: string;
			stripSuffix?: string;
		};
	};
	version: string;
};

export async function* getIconPacks() {
	const icon_packs = new Glob('./*/meta.json');
	const root = join(import.meta.dir, '..');
	for await (const f of icon_packs.scan(root)) {
		const meta_file = join(root, f);
		const name = dirname(meta_file).split('/').pop()!;
		const sourceRoot = join(import.meta.dir, '../../../icons', name);
		const destRoot = join(import.meta.dir, '../../../dist', name);

		const meta: Meta = await Bun.file(meta_file).json();
		yield { name, meta, meta_file, sourceRoot, destRoot };
	}
}
