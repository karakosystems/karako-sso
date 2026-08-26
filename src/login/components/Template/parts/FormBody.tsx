import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { useI18n } from "../../../i18n";
import { useKcContext } from "../../../KcContext";
import type { TemplateProps } from "./types";

/**
 * Everything between the header and the footer: server message, social
 * providers, the page itself, the "try another way" escape hatch and the
 * optional info note.
 */
export function FormBody(props: TemplateProps) {
    const {
        displayInfo = false,
        displayMessage = true,
        socialProvidersNode = null,
        infoNode = null,
        children
    } = props;

    const { kcContext } = useKcContext();
    const { auth, url, message, isAppInitiatedAction } = kcContext;
    const { msg } = useI18n();
    const { kcClsx } = useKcClsx();

    return (
        <div id="kc-content" className="space-y-4">
            {displayMessage &&
                message !== undefined &&
                (message.type !== "warning" || !isAppInitiatedAction) && (
                    <Alert variant={message.type}>
                        <AlertDescription>
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: kcSanitize(message.summary)
                                }}
                            />
                        </AlertDescription>
                    </Alert>
                )}

            {socialProvidersNode}
            {children}

            {auth !== undefined && auth.showTryAnotherWayLink && (
                <form
                    id="kc-select-try-another-way-form"
                    action={url.loginAction}
                    method="post"
                >
                    <div className={kcClsx("kcFormGroupClass")}>
                        <input type="hidden" name="tryAnotherWay" value="on" />

                        <Button
                            type="button"
                            className="w-full"
                            variant="outline"
                            asChild
                        >
                            <a
                                href="#"
                                id="try-another-way"
                                onClick={event => {
                                    document.forms[
                                        "kc-select-try-another-way-form" as never
                                    ].submit();
                                    event.preventDefault();
                                    return false;
                                }}
                            >
                                {msg("doTryAnotherWay")}
                            </a>
                        </Button>
                    </div>
                </form>
            )}

            {displayInfo && <div className="text-center text-sm">{infoNode}</div>}
        </div>
    );
}
