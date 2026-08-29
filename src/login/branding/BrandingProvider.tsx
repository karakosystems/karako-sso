import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useKcContext } from "../KcContext";
import { resolveBranding } from "./resolve";
import type { Branding } from "./types";

// Two sources, most specific last: the container's environment variables brand
// the image, the realm's KARAKO_BRAND_* attributes brand one tenant of it.
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

    const properties = kcContext.properties as unknown as
        Record<string, string> | undefined;
    const realmOverrides = kcContext.brandOverrides;

    const branding = useMemo(
        () => resolveBranding({ ...properties, ...realmOverrides }, overrides),
        [properties, realmOverrides, overrides]
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
