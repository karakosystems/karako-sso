import { useBranding } from "@/login/branding";

export function TemplateFooter(props: { className?: string }) {
    const { className = "" } = props;
    const branding = useBranding();
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`text-center text-xs text-muted-foreground ${className}`}>
            © Copyright {currentYear} - {branding.legalName}
        </footer>
    );
}
