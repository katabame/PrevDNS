export async function fetchFromProviders(providers: Record<string, string>[], verbose?: boolean): Promise<Set<string>> {
	let index = 0;
	const list = [];
	for (const provider of providers) {
		if (provider.name.length === 0 || provider.url.length === 0 || provider.regex.length === 0) {
			console.log(`  🔺 Provider #${index} lacks properties`);
			continue;
		}
		const regexPattern = provider.regex.replaceAll("\\\\", "\\");
		if (verbose === true) {
			console.log(`  ${provider.name}`);
			console.log(`    ├──Origin: ${provider.url}`);
			console.log(`    └──RegExp: /${regexPattern}/mg`);
		}
		const regex = new RegExp(regexPattern, "mg");
		const entries = (await (await fetch(provider.url)).text()).matchAll(regex);
		for (const entry of entries) {
			if (entry.groups === undefined) {
				continue;
			}
			list.push(entry.groups.target.toLowerCase());
		}
		index++;
	}
	return new Set(list.sort());
}
