import type { Decorator, Preview } from "@storybook/react-vite";
import { TemplateVariantProvider } from "../src/login/components/Template/TemplateVariantContext";

const withTemplateVariant: Decorator = (Story, context) => {
    const variant =
        (context.globals.templateVariant as "split" | "centered") ?? "centered";
    return (
        <TemplateVariantProvider variant={variant}>
            <Story />
        </TemplateVariantProvider>
    );
};

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    globalTypes: {
        templateVariant: {
            description: "Template layout variant",
            defaultValue: "centered",
            toolbar: {
                title: "Template",
                icon: "sidebar",
                items: [
                    { value: "split", title: "Split (2 columns)" },
                    { value: "centered", title: "Centered" }
                ],
                dynamicTitle: true
            }
        }
    },
    decorators: [withTemplateVariant]
};

export default preview;
