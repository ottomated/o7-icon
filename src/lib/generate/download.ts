import { $, semver } from 'bun';
import { existsSync } from 'node:fs';
import { getIconPacks } from './common.js';

await $`mkdir -p ./icons`;

for await (const { name, meta, meta_file } of getIconPacks()) {
	console.log(name);
	console.log(`- Current version: ${meta.version}`);

	const tags = (await $`git ls-remote --tags ${meta.git}`.text())
		.trim()
		.split('\n')
		.map((t) => {
			const [hash, tag] = t.split('\t');
			return {
				hash,
				version: tag.substring(tag.lastIndexOf('/') + 1)
			};
		})
		.sort((a, b) => -semver.order(a.version, b.version));

	const latest = tags[0];
	console.log(`- Latest version: ${latest.version}`);

	if (existsSync(`./icons/${name}`)) {
		if (meta.version === latest.version) {
			console.log('- Already up to date!');
			continue;
		}

		// Clone or pull repo
		await $`cd ./icons/${name} && git pull && git checkout ${latest.hash}`;
	} else {
		await $`git clone --depth=1 --branch=${latest.version} ${meta.git} ./icons/${name}`;
	}
	meta.version = latest.version;
	await Bun.write(meta_file, JSON.stringify(meta, null, '\t'));
}
