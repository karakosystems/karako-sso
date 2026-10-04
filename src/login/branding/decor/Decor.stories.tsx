import type { Meta, StoryObj } from "@storybook/react-vite";
import { DECORS } from "../types";
import { Decor } from "./Decor";

function Gallery(props: { primary: string; opacity: number; dark: boolean }) {
    const { primary, opacity, dark } = props;

    return (
        <div
            style={
                {
                    "--primary": primary,
                    background: dark ? "#141414" : "#ffffff",
                    color: dark ? "#fafafa" : "#0a0a0a",
                    padding: "24px",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "16px"
                } as React.CSSProperties
            }
        >
            {DECORS.map(name => (
                <figure key={name} style={{ margin: 0 }}>
                    <div
                        style={{
                            position: "relative",
                            height: "150px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            border: `1px solid ${dark ? "#2a2a2a" : "#e5e5e5"}`,
                            background: dark ? "#1c1c1c" : "#fbfbfb"
                        }}
                    >
                        <Decor decor={name} opacity={opacity} />
                    </div>
                    <figcaption
                        style={{
                            fontFamily: "ui-monospace, monospace",
                            fontSize: "12px",
                            paddingTop: "8px",
                            opacity: 0.75
                        }}
                    >
                        {name}
                    </figcaption>
                </figure>
            ))}
        </div>
    );
}

const meta = {
    title: "branding/Decors",
    component: Gallery,
    argTypes: {
        primary: { control: "color", name: "Brand colour" },
        opacity: { control: { type: "range", min: 0, max: 1, step: 0.05 } },
        dark: { control: "boolean", name: "Dark background" }
    }
} satisfies Meta<typeof Gallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Karako: Story = {
    args: { primary: "#635bfe", opacity: 0.5, dark: false }
};

export const KarakoDark: Story = {
    name: "Karako (dark)",
    args: { primary: "#635bfe", opacity: 0.55, dark: true }
};

export const ClientBlue: Story = {
    name: "Client, blue",
    args: { primary: "#0055aa", opacity: 0.5, dark: false }
};

export const ClientGreen: Story = {
    name: "Client, green",
    args: { primary: "#0f7b3f", opacity: 0.5, dark: false }
};

export const ClientAmber: Story = {
    name: "Client, amber",
    args: { primary: "#d97706", opacity: 0.5, dark: false }
};
