import { TooltipProvider } from "@/components/ui/tooltip";
import { useBranding } from "@/login/branding";
import { Centered } from "./layouts/Centered";
import { Hero } from "./layouts/Hero";
import { Minimal } from "./layouts/Minimal";
import { Split } from "./layouts/Split";
import { Stacked } from "./layouts/Stacked";
import type { TemplateProps } from "./parts";

/**
 * Picks the layout for the current deployment and renders the page inside it.
 *
 * Pages never reference a layout: they render <Template> with the same props
 * whatever the client has configured.
 */
export function Template(props: TemplateProps) {
    const { layout } = useBranding();

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
