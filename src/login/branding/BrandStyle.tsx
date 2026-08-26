import { useEffect } from "react";
import { useBranding } from "./BrandingProvider";

// One brand colour for both schemes; --ring and --sidebar-primary follow it
// rather than being separate settings.
export function BrandStyle() {
    const branding = useBranding();

    useEffect(() => {
        const root = document.documentElement;
        const applied: [string, string][] = [
            ["--primary", branding.primary],
            ["--primary-foreground", branding.primaryForeground],
            ["--sidebar-primary", branding.primary],
            ["--sidebar-primary-foreground", branding.primaryForeground],
            ["--ring", branding.primary],
            ["--radius", branding.radius]
        ];

        const previous = applied.map(
            ([name]) => [name, root.style.getPropertyValue(name)] as const
        );
        applied.forEach(([name, value]) => root.style.setProperty(name, value));

        // Restore on unmount: without this, one story's brand leaks into the
        // next whenever they share a page.
        return () => {
            previous.forEach(([name, value]) => {
                if (value === "") {
                    root.style.removeProperty(name);
                } else {
                    root.style.setProperty(name, value);
                }
            });
        };
    }, [branding.primary, branding.primaryForeground, branding.radius]);

    useEffect(() => {
        if (branding.faviconUrl === null) {
            return;
        }
        const previous = [
            ...document.querySelectorAll<HTMLLinkElement>(
                'link[rel="icon"], link[rel="apple-touch-icon"]'
            )
        ];
        previous.forEach(link => link.remove());

        const link = document.createElement("link");
        link.rel = "icon";
        link.href = branding.faviconUrl;
        document.head.appendChild(link);

        return () => {
            link.remove();
            previous.forEach(old => document.head.appendChild(old));
        };
    }, [branding.faviconUrl]);

    return null;
}
