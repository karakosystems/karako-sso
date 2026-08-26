import type { Meta, StoryObj } from "@storybook/react-vite";
import { BASE_COLOR_SCALES, BASE_COLORS } from "./baseColors";

const SWATCHES = [
    "--background",
    "--card",
    "--muted",
    "--secondary",
    "--accent",
    "--border",
    "--foreground"
] as const;

function Gallery(props: { dark: boolean }) {
    const { dark } = props;

    return (
        <div
            style={{
                background: dark ? "#0a0a0a" : "#ffffff",
                color: dark ? "#fafafa" : "#0a0a0a",
                padding: "24px",
                fontFamily: "ui-sans-serif, system-ui"
            }}
        >
            {BASE_COLORS.map(name => {
                const scale = dark
                    ? BASE_COLOR_SCALES[name].dark
                    : BASE_COLOR_SCALES[name].light;
                return (
                    <div key={name} style={{ marginBottom: "20px" }}>
                        <div
                            style={{
                                fontFamily: "ui-monospace, monospace",
                                fontSize: "12px",
                                opacity: 0.75,
                                paddingBottom: "6px"
                            }}
                        >
                            {name}
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                            {SWATCHES.map(token => (
                                <div key={token} style={{ textAlign: "center" }}>
                                    <div
                                        style={{
                                            width: "84px",
                                            height: "52px",
                                            borderRadius: "8px",
                                            background: scale[token],
                                            border: `1px solid ${scale["--border"]}`
                                        }}
                                    />
                                    <div
                                        style={{
                                            fontFamily: "ui-monospace, monospace",
                                            fontSize: "10px",
                                            opacity: 0.6,
                                            paddingTop: "4px"
                                        }}
                                    >
                                        {token.replace("--", "")}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

const meta = {
    title: "branding/Base colours",
    component: Gallery,
    argTypes: { dark: { control: "boolean", name: "Dark scheme" } }
} satisfies Meta<typeof Gallery>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Light: Story = { args: { dark: false } };
export const Dark: Story = { args: { dark: true } };
