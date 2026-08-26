import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Decor, useBranding } from "@/login/branding";
import {
    BrandLogo,
    FormBody,
    FormHeader,
    TemplateFooter,
    TemplateToolbar,
    WelcomeMessage,
    useTemplateSetup,
    type TemplateProps
} from "../parts";

/**
 * Two columns: the form on one side, a branded panel on the other.
 * `reverse` puts the brand panel first, which reads better in RTL locales and
 * suits clients whose logo is the visual anchor.
 */
export function Split(props: TemplateProps & { reverse?: boolean }) {
    const {
        headerNode,
        displayRequiredFields,
        documentTitle,
        bodyClassName,
        reverse = false
    } = props;
    useTemplateSetup({ documentTitle, bodyClassName });
    const branding = useBranding();

    const brandPanel = (
        <div className="relative hidden overflow-hidden bg-muted/40 lg:flex lg:flex-1 lg:flex-col lg:items-center lg:justify-center lg:gap-6 lg:p-12">
            <Decor decor={branding.decor} opacity={0.6} />
            <div className="relative z-10 flex flex-col items-center gap-6">
                <BrandLogo />
                <WelcomeMessage className="max-w-sm text-center text-muted-foreground" />
            </div>
        </div>
    );

    const formPanel = (
        <div className="relative flex flex-1 flex-col px-6 py-10">
            <TemplateToolbar className="absolute inset-s-4 top-4" />

            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex justify-center lg:hidden">
                        <BrandLogo className="h-16 w-auto" />
                    </div>

                    <Card
                        className={`border bg-card shadow-xs ${props.cardClassName ?? ""}`}
                    >
                        <CardHeader className="space-y-8">
                            <CardTitle>
                                <FormHeader
                                    headerNode={headerNode}
                                    displayRequiredFields={displayRequiredFields}
                                />
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormBody {...props} />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <TemplateFooter className="pt-6" />
        </div>
    );

    return (
        <div className="flex min-h-svh flex-col lg:flex-row">
            {reverse ? brandPanel : formPanel}
            {reverse ? formPanel : brandPanel}
        </div>
    );
}
