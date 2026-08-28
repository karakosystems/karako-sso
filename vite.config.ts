/// <reference types="vitest/config" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { buildEmailTheme } from "keycloakify-emails";
import { keycloakify } from "keycloakify/vite-plugin";
import path from "node:path";
import { defineConfig } from "vite";
import { BRAND_ENVIRONMENT_VARIABLES } from "./src/login/branding/schema.ts";

import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
        keycloakify({
            accountThemeImplementation: "none",
            themeName: "karako-iam-theme",
            environmentVariables: BRAND_ENVIRONMENT_VARIABLES,
            keycloakVersionTargets: {
                "22-to-25": false,
                "all-other-versions": "karako-iam-theme.jar"
            },
            postBuild: async buildContext => {
                await buildEmailTheme({
                    templatesSrcDirPath: path.join(
                        buildContext.themeSrcDirPath,
                        "email",
                        "templates"
                    ),
                    i18nSourceFile: path.join(
                        buildContext.themeSrcDirPath,
                        "email",
                        "i18n.ts"
                    ),
                    themeNames: buildContext.themeNames,
                    keycloakifyBuildDirPath: buildContext.keycloakifyBuildDirPath,
                    locales: ["en", "fr"],
                    esbuild: {
                        jsx: "automatic"
                    },
                    cwd: import.meta.dirname,
                    environmentVariables: buildContext.environmentVariables
                });
            }
        })
    ],
    resolve: {
        alias: {
            "@": path.resolve(import.meta.dirname, "./src")
        }
    },
    test: {
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(import.meta.dirname, ".storybook")
                    })
                ],
                // Every story is scanned up front so Vite never discovers a new
                // dependency mid-run and reloads the story iframe.
                optimizeDeps: {
                    entries: [".storybook/preview.tsx", "src/**/*.stories.tsx"]
                },
                test: {
                    name: "storybook",
                    // Browser tests are occasionally flaky (iframe reloads).
                    retry: 2,
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright({
                            launchOptions: {
                                args: [
                                    "--no-sandbox",
                                    "--disable-dev-shm-usage",
                                    "--disable-gpu"
                                ]
                            }
                        }),
                        // Pinned so a11y results do not depend on the host's
                        // default window size.
                        viewport: { width: 1280, height: 900 },
                        instances: [{ browser: "chromium" }]
                    }
                }
            }
        ]
    }
});
