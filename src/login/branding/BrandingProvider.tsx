import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useKcContext } from "../KcContext";
import { resolveBranding } from "./resolve";
import type { Branding } from "./types";

// Values come from kcContext.properties today; the context indirection lets a
// future source (per-realm attributes) replace them without touching consumers.
const BrandingContext = createContext<Branding | undefined>(undefined);

// Only Storybook and the dev server use this, from outside <KcPage>.
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
