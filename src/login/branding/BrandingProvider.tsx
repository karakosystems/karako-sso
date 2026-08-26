import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useKcContext } from "../KcContext";
import { resolveBranding } from "./resolve";
import type { Branding } from "./types";

/**
 * Makes the resolved branding available to the whole tree.
 *
 * Today the values come from `kcContext.properties`, i.e. environment
 * variables passed to the container. The indirection exists so a future source
 * - per-realm attributes injected by the Java provider, for instance - can be
 * plugged in here without touching a single consumer.
 */

const BrandingContext = createContext<Branding | undefined>(undefined);

/**
 * Out-of-band overrides, applied on top of whatever the deployment configured.
 *
 * Production never provides this. It exists so Storybook and the dev server can
 * sit *outside* <KcPage> and still drive the branding, which is what makes
 * every layout and decor previewable without rebuilding an image.
 */
const BrandingOverrideContext = createContext<Partial<Branding> | undefined>(undefined);

export function BrandingOverrideProvider(props: {
    overrides: Partial<Branding> | undefined;
    children: ReactNode;
}) {
    return (
        <BrandingOverrideContext.Provider value={props.overrides}>
            {props.children}
        </BrandingOverrideContext.Provider>
    );
}

export function BrandingProvider(props: { children: ReactNode }) {
    const { children } = props;
    const { kcContext } = useKcContext();
    const overrides = useContext(BrandingOverrideContext);

    const branding = useMemo(
        () =>
            resolveBranding(
                kcContext.properties as unknown as Record<string, string> | undefined,
                overrides
            ),
        [kcContext.properties, overrides]
    );

    return (
        <BrandingContext.Provider value={branding}>{children}</BrandingContext.Provider>
    );
}

export function useBranding(): Branding {
    const branding = useContext(BrandingContext);
    if (branding === undefined) {
        throw new Error("useBranding() must be used inside <BrandingProvider>");
    }
    return branding;
}
