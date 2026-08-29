import {
    type ExtendKcContext,
    createUseKcContext
} from "@keycloakify/login-ui/KcContext";
import type { KcEnvName, ThemeName } from "../kc.gen";

export type KcContextExtension = {
    themeName: ThemeName;
    properties: Record<KcEnvName, string> & {};
    // NOTE: Here you can declare more properties to extend the KcContext
    // See: https://docs.keycloakify.dev/faq-and-help/some-values-you-need-are-missing-from-in-kccontext
    client: {
        baseUrl?: string;
    };
    darkMode?: boolean;
    // Set by the branding login-forms provider in providers/, from the realm's
    // KARAKO_BRAND_* attributes. Absent when the realm sets none.
    brandOverrides?: Record<string, string>;
};

// Set by the Turnstile providers in providers/
type TurnstileFields = {
    turnstileRequired?: boolean;
    turnstileSiteKey?: string;
    turnstileAction?: string;
    turnstileTheme?: "auto" | "light" | "dark";
};

export type KcContextExtensionPerPage = {
    "register.ftl": TurnstileFields;
    "login.ftl": TurnstileFields;
    "login-reset-password.ftl": TurnstileFields;
};

export type KcContext = ExtendKcContext<KcContextExtension, KcContextExtensionPerPage>;

export const { useKcContext, KcContextProvider } = createUseKcContext<KcContext>();
