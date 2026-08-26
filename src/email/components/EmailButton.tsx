import { Button } from "jsx-email";
import type { ReactNode } from "react";
import { btnTextColor, primaryColor, radius } from "../constants";

// No fixed width: labels vary a lot across locales (the French password-reset
// label is ~376px) and a fixed width made them overflow.
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
        style={{
            display: "inline-block",
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
