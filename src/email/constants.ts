import { BRAND_DEFAULTS, BRAND_PREFIX } from "../login/branding/schema.ts";

// In a built theme these become FreeMarker expressions, so an email follows the
// same KARAKO_BRAND_* variables as the login pages. The preview server has no
// FreeMarker, so it gets the literal defaults instead.
const isPreview = process.env.KARAKO_EMAIL_PREVIEW === "1";

function brand(key: keyof typeof BRAND_DEFAULTS): string {
    const fallback = BRAND_DEFAULTS[key] as string;
    return isPreview ? fallback : `\${properties.${BRAND_PREFIX}${key}!'${fallback}'}`;
}

export const primaryColor = brand("PRIMARY");
export const primaryForeground = "#ffffff";

export const btnTextColor = primaryForeground;

export const textColor = "#1a1a1a";
export const headingColor = "#0a0a0a";
export const mutedColor = "#737373";
export const borderColor = "#e5e5e5";
export const radius = 10;

export const companyLogo = brand("LOGO_URL");
export const companyName = brand("NAME");
export const companyLegalName = brand("LEGAL_NAME");
