import { useTheme } from "@/components/theme-provider";
import { assert } from "tsafe/assert";
import { useKcContext } from "../../KcContext";

// Rendered by the Turnstile form action in providers/. The script it injects
// picks the element up by its class and adds the token to the form.
export function Turnstile() {
    const { kcContext } = useKcContext();
    assert(kcContext.pageId === "register.ftl");
    const { theme } = useTheme();

    if (kcContext.turnstileRequired !== true) {
        return null;
    }
    if (kcContext.turnstileSiteKey === undefined) {
        return null;
    }

    const configured = kcContext.turnstileTheme ?? "auto";
    // "auto" follows the OS, not the theme picked in this page.
    const widgetTheme =
        configured !== "auto" ? configured : theme === "system" ? "auto" : theme;

    return (
        <div className="flex justify-center">
            <div
                className="cf-turnstile"
                data-sitekey={kcContext.turnstileSiteKey}
                data-action={kcContext.turnstileAction}
                data-theme={widgetTheme}
                data-response-field-name="cf-turnstile-response"
            />
        </div>
    );
}
