import type { StorybookConfig } from "@storybook/react-vite";
import remarkGfm from "remark-gfm";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        "@storybook/addon-vitest",
        {
            // Storybook does not enable GFM by default, so markdown tables in
            // MDX render as raw pipes without this.
            name: "@storybook/addon-docs",
            options: {
                mdxPluginOptions: {
                    mdxCompileOptions: { remarkPlugins: [remarkGfm] }
                }
            }
        },
        "@storybook/addon-a11y"
    ],
    framework: {
        name: "@storybook/react-vite",
        options: {}
    },
    staticDirs: ["../public"]
};
export default config;
