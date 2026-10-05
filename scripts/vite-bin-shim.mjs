// Keycloakify hardcodes `npx vite`, but Vite+ resolves `vite` to a package with
// no binary: without this shim npx downloads an unrelated Vite instead.
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

// `vp install` writes devEngines.packageManager with onFail "download", which
// npm does not know: `npx` then refuses to run and every Keycloakify command
// fails. Only npm reads the block, and Keycloakify always runs it, so "ignore".
const manifestFile = join(root, "package.json");
const manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
const packageManager = manifest.devEngines?.packageManager;

if (packageManager !== undefined && packageManager.onFail !== "ignore") {
    packageManager.onFail = "ignore";
    writeFileSync(manifestFile, JSON.stringify(manifest, null, 4) + "\n");
    console.error("vite-bin-shim: set devEngines.packageManager.onFail to ignore");
}

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
    /* nothing to replace */
}
symlinkSync(join("..", "vite", "bin", "vite.js"), binLink);
