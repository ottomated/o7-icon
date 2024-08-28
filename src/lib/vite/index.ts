import type { Plugin } from 'vite';
import { walk } from 'zimmerframe';
import type { ImportDeclaration } from 'estree';
import MagicString from 'magic-string';
import type { AstNode, RollupAstNode } from 'rollup';

export function o7Icon(): Plugin {
	return {
		name: 'o7-icon',
		enforce: 'pre',
		async transform(input, id) {
			if (id.includes('o7-icon/dist') || id.includes('node_modules')) return;

			let ast: AstNode;
			try {
				ast = this.parse(input) as AstNode;
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (_) {
				return;
			}
			const imports: Array<RollupAstNode<ImportDeclaration>> = [];

			walk(ast, null, {
				ImportDeclaration(node: RollupAstNode<ImportDeclaration>) {
					if (typeof node.source.value !== 'string') return;
					if (!node.source.value.startsWith('@o7/icon')) return;
					if (node.specifiers.some((s) => s.type !== 'ImportSpecifier')) return;
					imports.push(node);
				}
			});
			if (imports.length === 0) return;

			const s = new MagicString(input);

			for (const node of imports) {
				const newImports = [];
				for (const spec of node.specifiers) {
					if (spec.type !== 'ImportSpecifier') continue;
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
	};
}
