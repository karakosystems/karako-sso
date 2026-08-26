import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useEffect } from "react";
import { useI18n } from "../../../i18n";
import { useKcContext } from "../../../KcContext";
import { useInitializeTemplate } from "../useInitializeTemplate";

/**
 * Document-level side effects shared by every layout: page title, the classes
 * Keycloak expects on <html>/<body>, and Keycloakify's own initialisation.
 */
export function useTemplateSetup(params: {
    documentTitle?: string;
    bodyClassName?: string;
}) {
    const { documentTitle, bodyClassName } = params;

    const { kcContext } = useKcContext();
    const { msgStr } = useI18n();
    const { kcClsx } = useKcClsx();

    useEffect(() => {
        document.title =
            documentTitle ??
            msgStr("loginTitle", kcContext.realm.displayName || kcContext.realm.name);
    }, []);

    useSetClassName({ qualifiedName: "html", className: kcClsx("kcHtmlClass") });
    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    useInitializeTemplate();
}
