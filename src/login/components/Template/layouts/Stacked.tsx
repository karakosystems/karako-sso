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

export function Stacked(props: TemplateProps) {
    const { headerNode, displayRequiredFields, documentTitle, bodyClassName } = props;
    useTemplateSetup({ documentTitle, bodyClassName });
    const branding = useBranding();

    return (
        <div className="flex min-h-svh flex-col bg-muted/20">
            <header className="relative overflow-hidden border-b bg-card">
                <Decor decor={branding.decor} opacity={0.5} />
                <TemplateToolbar className="absolute inset-s-4 top-4" />
                <div className="relative z-10 flex flex-col items-center gap-3 px-6 py-12">
                    <BrandLogo className="h-16 w-auto" />
                    <WelcomeMessage className="max-w-lg text-center text-sm text-muted-foreground" />
                </div>
            </header>

            <div className="flex flex-1 items-start justify-center px-6 py-12">
                <Card
                    className={`w-full max-w-md border bg-card shadow-xs ${props.cardClassName ?? ""}`}
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

            <TemplateFooter className="px-4 pb-6" />
        </div>
    );
}
