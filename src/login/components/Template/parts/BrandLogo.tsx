import { useBranding } from "@/login/branding";

/** The client's logo, with the dark variant swapped in by CSS. */
export function BrandLogo(props: { className?: string }) {
    const { className = "h-24 w-auto" } = props;
    const branding = useBranding();

    return (
        <>
            <img
                src={branding.logoUrl}
                alt={branding.name}
                className={`${className} dark:hidden`}
            />
            <img
                src={branding.logoDarkUrl}
                alt={branding.name}
                className={`hidden ${className} dark:block`}
            />
        </>
    );
}
