import { BASE_COLORS } from "./baseColors.ts";
import { DECORS, LAYOUTS, type Decor, type Layout } from "./types.ts";

// Not `KC_`: Keycloak validates its own KC_* options and warns on unknown ones.
export const BRAND_PREFIX = "KARAKO_BRAND_";

export const BRAND_DEFAULTS = {
    NAME: "Karako",
    LEGAL_NAME: "Karako Systems",
    WELCOME_MESSAGE: "",
    LOGO_URL: "https://cdn.karakosystems.com/karako/logos/logo-full-violet.png",
    LOGO_DARK_URL:
        "https://cdn.karakosystems.com/karako/logos/logo-full-violet-white.png",
    FAVICON_URL: "",
    PRIMARY: "#635bfe",
    BASE: "neutral",
    RADIUS: "0.625rem",
    LAYOUT: "centered" satisfies Layout,
    DECOR: "shape" satisfies Decor
} as const;

export type BrandKey = keyof typeof BRAND_DEFAULTS;

/** Consumed by vite.config.ts to declare the variables to Keycloakify. */
export const BRAND_ENVIRONMENT_VARIABLES = Object.entries(BRAND_DEFAULTS).map(
    ([key, value]) => ({
        name: `${BRAND_PREFIX}${key}`,
        default: value as string
    })
);

export const BRAND_SETTINGS: Record<BrandKey, { label: string; hint: string }> = {
    NAME: { label: "Brand name", hint: "Short name shown in the UI and page title" },
    LEGAL_NAME: { label: "Legal name", hint: "Full company name, shown in the footer" },
    WELCOME_MESSAGE: {
        label: "Welcome message",
        hint: "Optional sentence next to the logo; falls back to the translated default"
    },
    LOGO_URL: {
        label: "Logo",
        hint: "Absolute https:// URL, shown on light backgrounds"
    },
    LOGO_DARK_URL: { label: "Logo (dark)", hint: "Variant used on dark backgrounds" },
    FAVICON_URL: {
        label: "Favicon",
        hint: "Optional; when empty the icons bundled in the theme are used"
    },
    PRIMARY: {
        label: "Brand colour",
        hint: "Hex colour driving buttons, links and decor"
    },
    BASE: {
        label: "Base colour",
        hint: `Neutral scale for backgrounds and cards. One of: ${BASE_COLORS.join(", ")}`
    },
    RADIUS: { label: "Corner radius", hint: "Any CSS length, e.g. 0.25rem or 16px" },
    LAYOUT: { label: "Layout", hint: `One of: ${LAYOUTS.join(", ")}` },
    DECOR: {
        label: "Decor",
        hint: `One of: ${DECORS.join(", ")} - or an absolute https:// image URL`
    }
};
