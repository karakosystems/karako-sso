import type { ReactNode } from "react";

/** Props every layout accepts. Pages never know which layout is active. */
export type TemplateProps = {
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
