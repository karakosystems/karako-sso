import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/login/components/ui/ThemeToggle";
import { redirectUrlOrigin } from "@/login/shared/redirectUrlOrigin";
import { kcSanitize } from "@keycloakify/login-ui/kcSanitize";
import { useKcClsx } from "@keycloakify/login-ui/useKcClsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { RotateCcw, User } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { FiHome } from "react-icons/fi";
import { useI18n } from "../../i18n";
import { useKcContext } from "../../KcContext";
import { Languages } from "../ui/Langauges";
import shape from "../../assets/img/shape.svg";
import { useInitializeTemplate } from "./useInitializeTemplate";

const companylogo = "https://cdn.karakosystems.com/karako/logos/logo-full-violet.png";
const companylogoDark =
    "https://cdn.karakosystems.com/karako/logos/logo-full-violet-white.png";

const APP_NAME = "Karako";
const APP_LONG_NAME = "Karako Systems";

export function TemplateCentered(props: {
    displayInfo?: boolean;
    displayMessage?: boolean;
    displayRequiredFields?: boolean;
    headerNode: ReactNode;
    socialProvidersNode?: ReactNode;
    infoNode?: ReactNode;
    documentTitle?: string;
    bodyClassName?: string;
    children: ReactNode;
}) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        children
    } = props;

    const { kcContext } = useKcContext();

    const { auth, url, message, isAppInitiatedAction } = kcContext;

    const { msg, msgStr, enabledLanguages } = useI18n();

    const { kcClsx } = useKcClsx();

    useEffect(() => {
        document.title =
            documentTitle ??
            msgStr("loginTitle", kcContext.realm.displayName || kcContext.realm.name);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    useInitializeTemplate();

    const currentYear = new Date().getFullYear();

    return (
        <TooltipProvider>
            <div className="relative flex min-h-svh flex-col bg-muted/30">
                {/* Fullscreen background shapes */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    <img
                        src={shape}
                        alt=""
                        className="absolute right-0 top-0 w-full max-w-62.5 xl:max-w-112.5"
                    />
                    <img
                        src={shape}
                        alt=""
                        className="absolute bottom-0 left-0 w-full max-w-62.5 rotate-180 xl:max-w-112.5"
                    />
                </div>

                {/* Top navigation */}
                <div className="absolute top-4 inset-s-4 z-20 flex items-center gap-2 px-4">
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

                {/* Centered form area */}
                <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-20">
                    <div className="w-full max-w-md">
                        {/* Logo above the card */}
                        <div className="mb-8 flex justify-center">
                            <img
                                src={companylogo}
                                alt={APP_NAME}
                                className="h-24 w-auto dark:hidden"
                            />
                            <img
                                src={companylogoDark}
                                alt={APP_NAME}
                                className="hidden h-24 w-auto dark:block"
                            />
                        </div>

                        <Card className="border bg-card shadow-xs">
                            <CardHeader className="space-y-8">
                                <CardTitle>
                                    {(() => {
                                        const node = !(
                                            auth !== undefined &&
                                            auth.showUsername &&
                                            !auth.showResetCredentials
                                        ) ? (
                                            <h1 className="text-xl">{headerNode}</h1>
                                        ) : (
                                            <div
                                                id="kc-username"
                                                className="flex items-center justify-between gap-2"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <User className="size-6 text-muted-foreground" />

                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="text-xs font-normal text-muted-foreground">
                                                            {msgStr(
                                                                "attemptedUsernameLoggingInAs"
                                                            )}
                                                        </span>
                                                        <label
                                                            className="text-lg font-semibold"
                                                            id="kc-attempted-username"
                                                        >
                                                            {auth.attemptedUsername}
                                                        </label>
                                                    </div>
                                                </div>

                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            asChild
                                                        >
                                                            <a
                                                                id="reset-login"
                                                                href={
                                                                    url.loginRestartFlowUrl
                                                                }
                                                                aria-label={msgStr(
                                                                    "restartLoginTooltip"
                                                                )}
                                                            >
                                                                <RotateCcw className="size-4" />
                                                            </a>
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>
                                                            {msg("restartLoginTooltip")}
                                                        </p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        );

                                        if (displayRequiredFields) {
                                            return (
                                                <div className="flex items-center justify-between gap-2">
                                                    <div>{node}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        <span className="text-destructive">
                                                            *
                                                        </span>{" "}
                                                        {msg("requiredFields")}
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return node;
                                    })()}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div id="kc-content" className="space-y-4">
                                    {displayMessage &&
                                        message !== undefined &&
                                        (message.type !== "warning" ||
                                            !isAppInitiatedAction) && (
                                            <Alert variant={message.type}>
                                                <AlertDescription>
                                                    <span
                                                        dangerouslySetInnerHTML={{
                                                            __html: kcSanitize(
                                                                message.summary
                                                            )
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
                                                <input
                                                    type="hidden"
                                                    name="tryAnotherWay"
                                                    value="on"
                                                />

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
                                    {displayInfo && (
                                        <div className="text-center text-sm">
                                            {infoNode}
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 px-4 pb-6 text-center text-xs text-muted-foreground">
                    © Copyright {currentYear} - {APP_LONG_NAME}
                </footer>
            </div>
        </TooltipProvider>
    );
}
