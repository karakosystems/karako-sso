import { useBranding } from "@/login/branding";
import { useI18n } from "../../../i18n";

/**
 * Tagline shown beside the logo. A deployment can override it via
 * KARAKO_BRAND_WELCOME_MESSAGE; otherwise the translated default is used.
 */
export function WelcomeMessage(props: { className?: string }) {
    const { className = "text-center text-muted-foreground" } = props;
    const branding = useBranding();
    const { msg } = useI18n();

    return (
        <p className={className}>{branding.welcomeMessage ?? msg("welcomeMessage")}</p>
    );
}
