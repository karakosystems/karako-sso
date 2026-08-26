#!/usr/bin/env bun
/**
 * Syncs the brand assets that live in this repo with the Karako CDN.
 *
 * Two jobs:
 *   1. Download the favicon set into public/ (these are copied, not linked,
 *      because Keycloak serves theme resources with `Cache-Control: no-cache`
 *      whereas the CDN serves `immutable, max-age=31536000` - a replaced asset
 *      would stay invisible to returning visitors for up to a year).
 *   2. Check that every CDN URL referenced from src/ still exists in the CDN
 *      index, so a renamed logo fails here instead of silently 404ing on the
 *      login page.
 *
 * Run it after uploading new assets to the CDN:  bun run sync:brand
 */

const CDN = "https://cdn.karakosystems.com";
const INDEX_URL = `${CDN}/discover.json`;

/** CDN path -> local destination */
const FAVICONS = {
    "karako/favicon.ico": "public/favicon.ico",
    "karako/favicon-16x16.png": "public/favicon-16x16.png",
    "karako/favicon-32x32.png": "public/favicon-32x32.png",
    "karako/apple-touch-icon.png": "public/apple-touch-icon.png",
    "karako/android-chrome-192x192.png": "public/android-chrome-192x192.png",
    "karako/android-chrome-512x512.png": "public/android-chrome-512x512.png"
};

/**
 * The CDN sets `immutable`, so a plain fetch can return a stale edge copy even
 * when the origin has been updated. A per-run cache buster forces a fresh one.
 */
const bust = `cb=${process.env.SYNC_BRAND_CB ?? String(Math.floor(Date.now() / 1000))}`;

const noCache = { "Cache-Control": "no-cache", Pragma: "no-cache" };

async function fetchFresh(url) {
    const sep = url.includes("?") ? "&" : "?";
    const response = await fetch(`${url}${sep}${bust}`, { headers: noCache });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText} on ${url}`);
    }
    return response;
}

async function main() {
    const index = await (await fetchFresh(INDEX_URL)).json();
    const known = new Set(index.resources.map(resource => resource.path));

    let changed = 0;
    let unchanged = 0;

    for (const [cdnPath, destination] of Object.entries(FAVICONS)) {
        const url = `${CDN}/${cdnPath}`;
        if (!known.has(url)) {
            console.error(`  MISSING on CDN  ${cdnPath}`);
            process.exitCode = 1;
            continue;
        }

        const incoming = Buffer.from(await (await fetchFresh(url)).arrayBuffer());
        const file = Bun.file(destination);
        const current = (await file.exists())
            ? Buffer.from(await file.arrayBuffer())
            : null;

        if (current !== null && current.equals(incoming)) {
            unchanged += 1;
            continue;
        }

        await Bun.write(destination, incoming);
        const from = current === null ? "new" : `${current.length} o`;
        console.log(`  updated  ${destination}  (${from} -> ${incoming.length} o)`);
        changed += 1;
    }

    // Every CDN URL hardcoded in the source must still exist in the index.
    const referenced = new Set();
    for await (const path of new Bun.Glob("**/*.{ts,tsx}").scan("src")) {
        const source = await Bun.file(`src/${path}`).text();
        for (const match of source.matchAll(
            /https:\/\/cdn\.karakosystems\.com\/[^"'`\s)]+/g
        )) {
            referenced.add(match[0]);
        }
    }

    let dangling = 0;
    for (const url of [...referenced].sort()) {
        if (!known.has(url)) {
            console.error(`  DANGLING in src/  ${url}`);
            dangling += 1;
            process.exitCode = 1;
        }
    }

    console.log(
        `\n${changed} favicon(s) updated, ${unchanged} unchanged, ` +
            `${referenced.size} CDN URL(s) referenced from src/` +
            (dangling > 0 ? `, ${dangling} dangling` : ", all resolve")
    );
    if (changed > 0) {
        console.log("Rebuild the theme for Keycloak to serve them: bun run build");
    }
}

await main();
