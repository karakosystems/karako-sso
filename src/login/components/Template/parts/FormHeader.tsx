import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RotateCcw, User } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "../../../i18n";
import { useKcContext } from "../../../KcContext";

// Either the page header, or the username being re-authenticated with a restart link.
export function FormHeader(props: {
    headerNode: ReactNode;
    displayRequiredFields?: boolean;
}) {
    const { headerNode, displayRequiredFields = false } = props;

    const { kcContext } = useKcContext();
    const { auth, url } = kcContext;
    const { msg, msgStr } = useI18n();

    const node =
        auth !== undefined && auth.showUsername && !auth.showResetCredentials ? (
            <div id="kc-username" className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-4">
                    <User className="size-6 text-muted-foreground" />
                    <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-normal text-muted-foreground">
                            {msgStr("attemptedUsernameLoggingInAs")}
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
                        <Button variant="outline" size="icon" asChild>
                            <a
                                id="reset-login"
                                href={url.loginRestartFlowUrl}
                                aria-label={msgStr("restartLoginTooltip")}
                            >
                                <RotateCcw className="size-4" />
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{msg("restartLoginTooltip")}</p>
                    </TooltipContent>
                </Tooltip>
            </div>
        ) : (
            <h1 className="text-xl">{headerNode}</h1>
        );

    if (!displayRequiredFields) {
        return node;
    }

    return (
        <div className="flex items-center justify-between gap-2">
            <div>{node}</div>
            <div className="text-xs text-muted-foreground">
                <span className="text-destructive">*</span> {msg("requiredFields")}
            </div>
        </div>
    );
}
