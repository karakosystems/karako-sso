import { Button } from "jsx-email";
import type { ReactNode } from "react";
import { btnTextColor, primaryColor, radius } from "../constants";

// width:auto is required: jsx-email defaults to width:100%, which together with
// the padding overflows the container (email boxes are content-box).
export const EmailButton = ({
    href,
    align = "left",
    children
}: {
    href: string;
    align?: "left" | "center" | "right";
    children: ReactNode;
}) => (
    <Button
        href={href}
        align={align}
        backgroundColor={primaryColor}
        textColor={btnTextColor}
        borderRadius={radius}
        fontSize={15}
        // Outlook only: these feed the VML fallback, not the HTML button,
        // which stays auto-width so long labels do not overflow.
        width={240}
        height={48}
        style={{
            display: "inline-block",
            width: "auto",
            boxSizing: "border-box",
            padding: "14px 28px",
            fontWeight: 600,
            lineHeight: "20px",
            textDecoration: "none",
            maxWidth: "100%",
            textAlign: "center"
        }}
    >
        {children}
    </Button>
);
