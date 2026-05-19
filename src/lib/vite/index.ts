import type { Plugin } from 'vite';
import { walk } from 'zimmerframe';
import type { Program, Node, ImportDeclaration } from '@oxc-project/types';
import MagicString from 'magic-string';

export function o7Icon(): Plugin {
	return {
		name: 'o7-icon',
		enforce: 'post',
		transform: {
			filter: {
				id: {
					exclude: [/node_modules/, /o7-icon\/dist/, /\.svelte-kit\/generated/]
				}
			},
			async handler(code, id) {
				let ast: Program;
				try {
					ast = this.parse(code);
				} catch {
					return;
				}
				const imports: Array<ImportDeclaration> = [];

				walk(ast as Node, null, {
					ImportDeclaration(node) {
						if (typeof node.source.value !== 'string') return;
						if (!node.source.value.startsWith('@o7/icon')) return;
						if (node.specifiers.some((s) => s.type !== 'ImportSpecifier')) return;
						imports.push(node);
					}
				});
				if (imports.length === 0) return { code, ast };

				const s = new MagicString(code);

				for (const node of imports) {
					const newImports = [];
					for (const spec of node.specifiers) {
						if (spec.type !== 'ImportSpecifier') continue;
						if (spec.imported.type !== 'Identifier') continue;
						const source =
							node.source.value === '@o7/icon'
								? `@o7/icon/lucide/${spec.imported.name}`
								: `${node.source.value}/${spec.imported.name}`;
						newImports.push(`import ${spec.local.name} from '${source}';`);
					}
					s.overwrite(node.start, node.end, newImports.join('\n'));
				}

				const map = s.generateMap({
					source: id,
					file: id + '.map'
				});
				return {
					code: s.toString(),
					map
				};
			}
		}
	};
}
