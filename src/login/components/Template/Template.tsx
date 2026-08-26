import type { ReactNode } from "react";
import { TemplateCentered } from "./TemplateCentered";
import { TemplateSplit } from "./TemplateSplit";
import { useTemplateVariant } from "./TemplateVariantContext";

type TemplateProps = {
    displayInfo?: boolean;
    displayMessage?: boolean;
    displayRequiredFields?: boolean;
    headerNode: ReactNode;
    socialProvidersNode?: ReactNode;
    infoNode?: ReactNode;
    documentTitle?: string;
    bodyClassName?: string;
    cardClassName?: string;
    children: ReactNode;
};

export function Template(props: TemplateProps) {
    const variant = useTemplateVariant();
    if (variant === "centered") {
        return <TemplateCentered {...props} />;
    }
    return <TemplateSplit {...props} />;
}
