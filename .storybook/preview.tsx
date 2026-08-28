import { fetchMessages_defaultSet } from "@keycloakify/login-ui/core/i18n/messages_defaultSet";
import type { Decorator, Preview } from "@storybook/react-vite";
import {
    BASE_COLORS,
    BrandingOverrideProvider,
    DECORS,
    LAYOUTS,
    type Branding
} from "../src/login/branding";

// Same resolver and defaults as a real deployment; the toolbar stands in for
// the environment variables.
const BRAND_PRESETS: Record<string, Partial<Branding>> = {
    karako: {},
    acme: {
        name: "ACME",
        legalName: "ACME Corporation",
        primary: "#0055aa",
        base: "gray",
        welcomeMessage: "Sign in to your ACME workspace."
    },
    verdant: {
        name: "Verdant",
        base: "olive",
        legalName: "Verdant Health",
        primary: "#0f7b3f",
        radius: "1rem",
        welcomeMessage: "Secure access to Verdant Health services."
    },
    ember: {
        name: "Ember",
        base: "stone",
        legalName: "Ember Financial",
        primary: "#d97706",
        radius: "0.25rem",
        welcomeMessage: "Ember Financial — client portal."
    },
    slate: {
        name: "Slate",
        base: "mist",
        legalName: "Slate Institute",
        primary: "#334155",
        radius: "0rem"
    }
};

const withBranding: Decorator = (Story, context) => {
    const preset = BRAND_PRESETS[context.globals.brand as string] ?? {};

    const overrides: Partial<Branding> = { ...preset };

    const layout = context.globals.layout as string | undefined;
    if (layout !== undefined && layout !== "default") {
        overrides.layout = layout as Branding["layout"];
    }

    const decor = context.globals.decor as string | undefined;
    if (decor !== undefined && decor !== "default") {
        overrides.decor = decor;
    }

    const base = context.globals.base as string | undefined;
    if (base !== undefined && base !== "default") {
        overrides.base = base as Branding["base"];
    }

    return (
        <BrandingOverrideProvider overrides={overrides}>
            <Story />
        </BrandingOverrideProvider>
    );
};

const preview: Preview = {
    parameters: {
        controls: {
            matchers: { color: /(background|color)$/i, date: /Date$/i }
        },
        a11y: { test: "error" }
    },
    // Keycloakify records one-shot effects on window and reloads the page when a
    // second app instance replays one. Stories share an iframe, so the registry
    // is cleared to give each of them the clean document a real page load gives.
    beforeEach: () => {
        const key = "__keycloakify.useExclusiveAppInstanceEffect.globalContext";
        const context = (window as unknown as Record<string, unknown>)[key] as
            { alreadyRanEffectId?: Set<string> } | undefined;

        context?.alreadyRanEffectId?.clear();
    },
    // The dictionary of a non-default language is fetched lazily; loading it up
    // front keeps stories from being checked while their labels are still empty.
    loaders: [
        async ({ args }) => {
            const tag = (
                args as { kcContext?: { locale?: { currentLanguageTag?: string } } }
            ).kcContext?.locale?.currentLanguageTag;

            if (tag !== undefined && tag !== "en") {
                await fetchMessages_defaultSet(tag);
            }

            return {};
        }
    ],
    globalTypes: {
        brand: {
            description: "Client branding preset",
            defaultValue: "karako",
            toolbar: {
                title: "Brand",
                icon: "paintbrush",
                items: Object.keys(BRAND_PRESETS).map(value => ({
                    value,
                    title: value === "karako" ? "Karako (default)" : value
                })),
                dynamicTitle: true
            }
        },
        layout: {
            description: "Page layout (KARAKO_BRAND_LAYOUT)",
            defaultValue: "default",
            toolbar: {
                title: "Layout",
                icon: "sidebar",
                items: [
                    { value: "default", title: "From branding" },
                    ...LAYOUTS.map(value => ({ value, title: value }))
                ],
                dynamicTitle: true
            }
        },
        base: {
            description: "Neutral scale (KARAKO_BRAND_BASE)",
            defaultValue: "default",
            toolbar: {
                title: "Base",
                icon: "contrast",
                items: [
                    { value: "default", title: "From branding" },
                    ...BASE_COLORS.map(value => ({ value, title: value }))
                ],
                dynamicTitle: true
            }
        },
        decor: {
            description: "Background decor (KARAKO_BRAND_DECOR)",
            defaultValue: "default",
            toolbar: {
                title: "Decor",
                icon: "photo",
                items: [
                    { value: "default", title: "From branding" },
                    ...DECORS.map(value => ({ value, title: value }))
                ],
                dynamicTitle: true
            }
        }
    },
    decorators: [withBranding]
};

export default preview;
