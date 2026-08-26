import { useEffect } from "react";
import { useBranding } from "./BrandingProvider";

/**
 * Projects the resolved branding onto the CSS custom properties the theme
 * already uses, and onto the favicon links.
 *
 * The colour is written once on :root for both schemes - the same brand colour
 * in light and dark, with the readable foreground derived by contrast. Tokens
 * that should follow the brand (`--ring`, `--sidebar-primary`) are set from the
 * same value rather than exposed as separate settings.
 */
export function BrandStyle() {
    const branding = useBranding();

    useEffect(() => {
        const root = document.documentElement;
        const set = (name: string, value: string) => root.style.setProperty(name, value);

        set("--primary", branding.primary);
        set("--primary-foreground", branding.primaryForeground);
        set("--sidebar-primary", branding.primary);
        set("--sidebar-primary-foreground", branding.primaryForeground);
        set("--ring", branding.primary);
        set("--radius", branding.radius);
    }, [branding.primary, branding.primaryForeground, branding.radius]);

    useEffect(() => {
        if (branding.faviconUrl === null) {
            return;
        }
        // Replace every icon link; Keycloak renders the theme's own set by
        // default and a deployment may want its client's icon instead.
        const links = document.querySelectorAll<HTMLLinkElement>(
            'link[rel="icon"], link[rel="apple-touch-icon"]'
        );
        links.forEach(link => link.remove());

        const link = document.createElement("link");
        link.rel = "icon";
        link.href = branding.faviconUrl;
        document.head.appendChild(link);
    }, [branding.faviconUrl]);

    return null;
}
