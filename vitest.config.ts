import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";
import path from "node:path";
import { defineConfig } from "vitest/config";

// Runs every story as a test: it renders, its play function passes, and the
// a11y checks configured in .storybook/preview.tsx report no violation.
export default defineConfig({
    resolve: {
        alias: { "@": path.resolve(import.meta.dirname, "./src") }
    },
    plugins: [storybookTest({ configDir: path.join(import.meta.dirname, ".storybook") })],
    test: {
        name: "storybook",
        browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: "chromium" }]
        },
        setupFiles: [".storybook/vitest.setup.ts"]
    }
});
