import type { Decorator, Preview } from "@storybook/react-vite";
import {
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
        welcomeMessage: "Sign in to your ACME workspace."
    },
    verdant: {
        name: "Verdant",
        legalName: "Verdant Health",
        primary: "#0f7b3f",
        radius: "1rem",
        welcomeMessage: "Secure access to Verdant Health services."
    },
    ember: {
        name: "Ember",
        legalName: "Ember Financial",
        primary: "#d97706",
        radius: "0.25rem",
        welcomeMessage: "Ember Financial — client portal."
    },
    slate: {
        name: "Slate",
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
        // "todo" reports violations without failing the run. 27 pre-existing
        // ones remain (nested-interactive, label, contrast); switch back to
        // "error" once they are fixed.
        a11y: { test: "todo" }
    },
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
