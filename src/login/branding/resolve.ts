import { BASE_COLORS, type BaseColor } from "./baseColors.ts";
import { normalizeHexColor, readableForeground } from "./contrast";
import { BRAND_DEFAULTS, BRAND_PREFIX, type BrandKey } from "./schema";
import { DECORS, LAYOUTS, type Branding, type Decor, type Layout } from "./types";

// Anything missing or invalid falls back to the default: a typo in one variable
// must never produce a broken login page.
const CSS_LENGTH = /^-?\d*\.?\d+(px|rem|em|%|vh|vw|pt)$/;

function read(
    properties: Record<string, string> | undefined,
    key: BrandKey
): string | undefined {
    const raw = properties?.[`${BRAND_PREFIX}${key}`];
    if (raw === undefined) {
        return undefined;
    }
    const trimmed = raw.trim();
    return trimmed === "" ? undefined : trimmed;
}

function asHttpsUrl(value: string | undefined): string | undefined {
    if (value === undefined) {
        return undefined;
    }
    return value.startsWith("https://") ? value : undefined;
}

function asBase(value: string | undefined): BaseColor | undefined {
    return BASE_COLORS.includes(value as BaseColor) ? (value as BaseColor) : undefined;
}

function asLayout(value: string | undefined): Layout | undefined {
    return LAYOUTS.includes(value as Layout) ? (value as Layout) : undefined;
}

function asDecor(value: string | undefined): Decor | string | undefined {
    if (value === undefined) {
        return undefined;
    }
    if (DECORS.includes(value as Decor)) {
        return value as Decor;
    }
    return value.startsWith("https://") ? value : undefined;
}

export function resolveBranding(
    properties?: Record<string, string>,
    overrides?: Partial<Branding>
): Branding {
    const primary =
        normalizeHexColor(read(properties, "PRIMARY") ?? "") ??
        normalizeHexColor(BRAND_DEFAULTS.PRIMARY)!;

    const radiusRaw = read(properties, "RADIUS");
    const radius =
        radiusRaw !== undefined && CSS_LENGTH.test(radiusRaw)
            ? radiusRaw
            : BRAND_DEFAULTS.RADIUS;

    const resolved: Branding = {
        name: read(properties, "NAME") ?? BRAND_DEFAULTS.NAME,
        legalName: read(properties, "LEGAL_NAME") ?? BRAND_DEFAULTS.LEGAL_NAME,
        welcomeMessage: read(properties, "WELCOME_MESSAGE") ?? null,
        logoUrl: asHttpsUrl(read(properties, "LOGO_URL")) ?? BRAND_DEFAULTS.LOGO_URL,
        logoDarkUrl:
            asHttpsUrl(read(properties, "LOGO_DARK_URL")) ?? BRAND_DEFAULTS.LOGO_DARK_URL,
        faviconUrl: asHttpsUrl(read(properties, "FAVICON_URL")) ?? null,
        primary,
        primaryForeground: readableForeground(primary),
        base: asBase(read(properties, "BASE")) ?? BRAND_DEFAULTS.BASE,
        radius,
        layout: asLayout(read(properties, "LAYOUT")) ?? BRAND_DEFAULTS.LAYOUT,
        decor: asDecor(read(properties, "DECOR")) ?? BRAND_DEFAULTS.DECOR
    };

    if (overrides === undefined) {
        return resolved;
    }

    const merged = { ...resolved, ...overrides };
    // Keep the derived foreground consistent with any overridden primary.
    if (overrides.primary !== undefined && overrides.primaryForeground === undefined) {
        merged.primaryForeground = readableForeground(merged.primary);
    }
    return merged;
}
