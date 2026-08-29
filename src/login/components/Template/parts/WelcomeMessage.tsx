import { useBranding } from "@/login/branding";
import { useI18n } from "../../../i18n";

/** KARAKO_BRAND_WELCOME_MESSAGE, falling back to the translated default. */
export function WelcomeMessage(props: { className?: string }) {
    const { className = "text-center text-muted-foreground" } = props;
    const branding = useBranding();
    const { msg } = useI18n();

    return (
        <p className={className}>
            {branding.welcomeMessage ?? msg("welcomeMessage", branding.name)}
        </p>
    );
}
