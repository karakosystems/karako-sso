import { useEffect, useState } from "react";
import { BASE_COLOR_SCALES } from "./baseColors.ts";
import { useBranding } from "./BrandingProvider";

// The theme provider toggles a `dark` class on <html>; watch it so the base
// scale follows a theme change instead of being read once at mount.
function useIsDark() {
    const [isDark, setIsDark] = useState(
        () =>
            typeof document !== "undefined" &&
            document.documentElement.classList.contains("dark")
    );

    useEffect(() => {
        const root = document.documentElement;
        const update = () => setIsDark(root.classList.contains("dark"));
        update();

        const observer = new MutationObserver(update);
        observer.observe(root, { attributes: true, attributeFilter: ["class"] });
        return () => observer.disconnect();
    }, []);

    return isDark;
}

// One brand colour for both schemes; --ring and --sidebar-primary follow it
// rather than being separate settings.
export function BrandStyle() {
    const branding = useBranding();
    const isDark = useIsDark();

    useEffect(() => {
        const root = document.documentElement;
        const scale = BASE_COLOR_SCALES[branding.base];
        const applied: [string, string][] = [
            ...Object.entries(isDark ? scale.dark : scale.light),
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
    }, [
        branding.base,
        branding.primary,
        branding.primaryForeground,
        branding.radius,
        isDark
    ]);

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
