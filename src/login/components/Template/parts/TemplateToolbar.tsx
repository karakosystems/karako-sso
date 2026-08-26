import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/login/components/ui/ThemeToggle";
import { redirectUrlOrigin } from "@/login/shared/redirectUrlOrigin";
import { FiHome } from "react-icons/fi";
import { useI18n } from "../../../i18n";
import { useKcContext } from "../../../KcContext";
import { Languages } from "../../ui/Langauges";

/** Back-to-application, theme toggle and language picker. */
export function TemplateToolbar(props: { className?: string }) {
    const { className = "" } = props;
    const { kcContext } = useKcContext();
    const { msgStr, enabledLanguages } = useI18n();

    return (
        <div className={`z-20 flex items-center gap-2 ${className}`}>
            <Button type="button" variant="outline" size="icon" asChild>
                <a
                    href={kcContext.client?.baseUrl ?? redirectUrlOrigin ?? "/"}
                    aria-label={msgStr("backToApplication")}
                >
                    <FiHome />
                </a>
            </Button>

            {kcContext.darkMode !== false && <ModeToggle />}

            {enabledLanguages.length > 1 && <Languages />}
        </div>
    );
}
