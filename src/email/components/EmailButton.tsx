import { Button } from "jsx-email";
import type { ReactNode } from "react";
import { btnTextColor, primaryColor, radius } from "../constants";

type EmailButtonProps = {
    href: string;
    align?: "left" | "center" | "right";
    children: ReactNode;
};

export const EmailButton = ({ href, align = "left", children }: EmailButtonProps) => (
    <Button
        href={href}
        align={align}
        width={240}
        height={46}
        backgroundColor={primaryColor}
        textColor={btnTextColor}
        borderRadius={radius}
        fontSize={15}
    >
        {children}
    </Button>
);
