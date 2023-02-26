import { fetchFromProviders } from "./utils/provider.ts";
import {
	createZeroTrustLists,
	createZeroTrustRules,
	fetchZeroTrustLists,
	fetchZeroTrustRules,
	removeZeroTrustLists,
	removeZeroTrustRules,
} from "./utils/zerotrust.ts";

const providers = JSON.parse(await Deno.readTextFile("./providers.json"));

if (providers === undefined) {
	console.error("❗ Failed to load `providers.json`");
	Deno.exit(1);
}

console.log("📥 Fetching Blocklists from providers...");
const block = await fetchFromProviders(providers.block);
console.log(`✅ Fetched ${block.size} entries\n`);

console.log("📥 Fetching Allowlists from providers...");
const allow = await fetchFromProviders(providers.allow);
console.log(`✅ Fetched ${allow.size} entries\n`);

console.log("📦 Building Blocklist...");
allow.forEach((_) => block.delete(_));
console.log(`✅ Built with ${block.size} entries\n`);

console.log("📥 Fetching ZeroTrust Rules...");
const ztOldRules = await fetchZeroTrustRules();
console.log(`✅ Fetched ${ztOldRules.length} Rules\n`);

console.log("📥 Fetching ZeroTrust Lists...");
const ztOldLists = await fetchZeroTrustLists();
console.log(`✅ Fetched ${ztOldLists.length} lists\n`);

console.log("📤 Creating new ZeroTrust Lists...");
const ztNewLists = await createZeroTrustLists(block);
console.log(`✅ Created ${ztNewLists.length} lists\n`);

console.log("📤 Creating new ZeroTrust Rules...");
const ztNewRules = await createZeroTrustRules(ztNewLists);
console.log(`✅ Created ${ztNewRules.length} Rules\n`);

console.log("📤 Removing old ZeroTrust Rules...");
await removeZeroTrustRules(ztOldRules);
console.log(`✅ Removed ${ztOldRules.length} Rules\n`);

console.log("📤 Removing old ZeroTrust Lists...");
await removeZeroTrustLists(ztOldLists);
console.log(`✅ Removed ${ztOldLists.length} Lists\n`);

console.log("✨ Operation completed");
