import { Decor, useBranding } from "@/login/branding";
import {
    BrandLogo,
    FormBody,
    FormHeader,
    TemplateFooter,
    TemplateToolbar,
    useTemplateSetup,
    type TemplateProps
} from "../parts";

/**
 * No card, no ornament by default: the form sits directly on the page.
 * Suits institutions that want the login screen to feel like a document
 * rather than a product.
 */
export function Minimal(props: TemplateProps) {
    const { headerNode, displayRequiredFields, documentTitle, bodyClassName } = props;
    useTemplateSetup({ documentTitle, bodyClassName });
    const branding = useBranding();

    return (
        <div className="relative flex min-h-svh flex-col bg-background">
            <Decor decor={branding.decor} opacity={0.15} />

            <TemplateToolbar className="absolute inset-s-4 top-4 px-4" />

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24">
                <div className="w-full max-w-sm space-y-8">
                    <div className="flex justify-start">
                        <BrandLogo className="h-12 w-auto" />
                    </div>

                    <div className="space-y-6">
                        <FormHeader
                            headerNode={headerNode}
                            displayRequiredFields={displayRequiredFields}
                        />
                        <FormBody {...props} />
                    </div>
                </div>
            </div>

            <TemplateFooter className="relative z-10 px-4 pb-6" />
        </div>
    );
}
