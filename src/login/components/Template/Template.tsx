import { TooltipProvider } from "@/components/ui/tooltip";
import { useBranding } from "@/login/branding";
import { useI18n } from "@/login/i18n";
import { Centered } from "./layouts/Centered";
import { Hero } from "./layouts/Hero";
import { Minimal } from "./layouts/Minimal";
import { Split } from "./layouts/Split";
import { Stacked } from "./layouts/Stacked";
import type { TemplateProps } from "./parts";

export function Template(props: TemplateProps) {
    const { layout } = useBranding();
    const { isFetchingTranslations } = useI18n();

    // Rendering before the dictionary lands would flash empty labels and headings.
    if (isFetchingTranslations) {
        return null;
    }

    return (
        <TooltipProvider>
            {(() => {
                switch (layout) {
                    case "split":
                        return <Split {...props} />;
                    case "split-reverse":
                        return <Split {...props} reverse />;
                    case "hero":
                        return <Hero {...props} />;
                    case "minimal":
                        return <Minimal {...props} />;
                    case "stacked":
                        return <Stacked {...props} />;
                    case "centered":
                    default:
                        return <Centered {...props} />;
                }
            })()}
        </TooltipProvider>
    );
}
