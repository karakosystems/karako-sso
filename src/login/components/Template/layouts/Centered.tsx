import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

/** Card centred on a decorated background. */
export function Centered(props: TemplateProps) {
    const { headerNode, displayRequiredFields, documentTitle, bodyClassName } = props;
    useTemplateSetup({ documentTitle, bodyClassName });
    const branding = useBranding();

    return (
        <div className="relative flex min-h-svh flex-col bg-muted/30">
            <Decor decor={branding.decor} opacity={0.45} />

            <TemplateToolbar className="absolute inset-s-4 top-4 px-4" />

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex justify-center">
                        <BrandLogo />
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

            <TemplateFooter className="relative z-10 px-4 pb-6" />
        </div>
    );
}
