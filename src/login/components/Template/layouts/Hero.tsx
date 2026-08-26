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

export function Hero(props: TemplateProps) {
    const { headerNode, displayRequiredFields, documentTitle, bodyClassName } = props;
    useTemplateSetup({ documentTitle, bodyClassName });
    const branding = useBranding();

    return (
        <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
            <Decor decor={branding.decor} opacity={0.9} />

            <TemplateToolbar className="absolute inset-s-4 top-4 px-4" />

            <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 px-6 py-20">
                <div className="flex flex-col items-center gap-4">
                    <BrandLogo className="h-20 w-auto" />
                    <WelcomeMessage className="max-w-md text-center text-sm text-muted-foreground" />
                </div>

                <Card
                    className={`w-full max-w-md border-0 bg-card/95 shadow-2xl ring-1 ring-black/5 backdrop-blur-sm dark:ring-white/10 ${props.cardClassName ?? ""}`}
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

            <TemplateFooter className="relative z-10 px-4 pb-6" />
        </div>
    );
}
