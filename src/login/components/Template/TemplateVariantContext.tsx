import { createContext, useContext, type ReactNode } from "react";

export type TemplateVariant = "split" | "centered";

const TemplateVariantContext = createContext<TemplateVariant>("centered");

export function TemplateVariantProvider(props: {
    variant: TemplateVariant;
    children: ReactNode;
}) {
    return (
        <TemplateVariantContext.Provider value={props.variant}>
            {props.children}
        </TemplateVariantContext.Provider>
    );
}

export function useTemplateVariant(): TemplateVariant {
    return useContext(TemplateVariantContext);
}
