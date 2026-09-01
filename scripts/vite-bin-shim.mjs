// Keycloakify shells out to `npx vite` (hardcoded in its Vite plugin and CLI),
// but Vite+ resolves `vite` to @voidzero-dev/vite-plus-core, which ships no
// binary. Without this shim npx downloads an unrelated Vite from the registry
// and the theme is read with a different Vite than the one building it.
import {
    chmodSync,
    existsSync,
    lstatSync,
    mkdirSync,
    readFileSync,
    symlinkSync,
    unlinkSync,
    writeFileSync
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkgDir = join(root, "node_modules", "vite");
const binFile = join(pkgDir, "bin", "vite.js");
const cli = join(pkgDir, "dist", "vite", "node", "cli.js");
const binLink = join(root, "node_modules", ".bin", "vite");

if (!existsSync(pkgDir)) {
    process.exit(0);
}

const name = JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).name;

// A stock Vite install already provides the binary; leave it alone.
if (name !== "@voidzero-dev/vite-plus-core") {
    process.exit(0);
}

if (!existsSync(cli)) {
    console.error(`vite-bin-shim: ${cli} not found, leaving node_modules alone`);
    process.exit(0);
}

mkdirSync(dirname(binFile), { recursive: true });
writeFileSync(binFile, '#!/usr/bin/env node\nimport "../dist/vite/node/cli.js";\n');
chmodSync(binFile, 0o755);

// The package declares no bin, so the manager never links it: do it here or
// `npx vite` silently falls back to downloading an unrelated Vite.
mkdirSync(dirname(binLink), { recursive: true });
try {
    lstatSync(binLink);
    unlinkSync(binLink);
} catch {
    // nothing to replace
}
symlinkSync(join("..", "vite", "bin", "vite.js"), binLink);
