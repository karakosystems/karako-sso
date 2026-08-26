import { createKcPageStory, type Meta, type StoryObj } from "../../mocks/KcPageStory";
import { expect, userEvent, waitFor, within } from "storybook/test";

const { KcPageStory } = createKcPageStory({ pageId: "login.ftl" });

const meta = {
    title: "branding/Layouts",
    component: KcPageStory,
    parameters: { layout: "fullscreen" }
} satisfies Meta<typeof KcPageStory>;

export default meta;

type Story = StoryObj<typeof meta>;

/** The login form must work identically whatever layout is configured. */
async function loginFormIsUsable(canvasElement: HTMLElement) {
    const canvas = within(canvasElement);

    const username = await canvas.findByLabelText(/username|email/i);
    const password = canvasElement.querySelector<HTMLInputElement>("#password");
    expect(password).not.toBeNull();

    await userEvent.type(username, "jane.doe");
    expect(username).toHaveValue("jane.doe");

    await userEvent.type(password!, "hunter2");
    expect(password!.type).toBe("password");

    const reveal = canvasElement.querySelector<HTMLButtonElement>(
        '[aria-label*="assword" i], button[data-slot="input-group-addon"] button'
    );
    if (reveal !== null) {
        await userEvent.click(reveal);
        await waitFor(() => expect(password!.type).toBe("text"));
    }
}

export const Centered: Story = {
    globals: { layout: "centered" },
    play: async ({ canvasElement }) => loginFormIsUsable(canvasElement)
};

export const Split: Story = {
    globals: { layout: "split" },
    play: async ({ canvasElement }) => loginFormIsUsable(canvasElement)
};

export const SplitReverse: Story = {
    name: "Split reverse",
    globals: { layout: "split-reverse" },
    play: async ({ canvasElement }) => loginFormIsUsable(canvasElement)
};

export const Hero: Story = {
    globals: { layout: "hero" },
    play: async ({ canvasElement }) => loginFormIsUsable(canvasElement)
};

export const Minimal: Story = {
    globals: { layout: "minimal" },
    play: async ({ canvasElement }) => loginFormIsUsable(canvasElement)
};

export const Stacked: Story = {
    globals: { layout: "stacked" },
    play: async ({ canvasElement }) => loginFormIsUsable(canvasElement)
};

export const ClientBranding: Story = {
    name: "Client branding (ACME)",
    globals: { brand: "acme", layout: "hero", decor: "aurora" },
    play: async ({ canvasElement }) => {
        await loginFormIsUsable(canvasElement);
        const styles = getComputedStyle(document.documentElement);
        expect(styles.getPropertyValue("--primary").trim()).toBe("#0055aa");
    }
};
