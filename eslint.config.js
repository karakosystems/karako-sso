import typescriptEslint from "typescript-eslint";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import js from "@eslint/js";
import storybook from "eslint-plugin-storybook";

export default typescriptEslint.config(
    js.configs.recommended,
    ...typescriptEslint.configs.recommended,
    react.configs.flat.recommended,
    react.configs.flat["jsx-runtime"],
    eslintConfigPrettier,
    ...storybook.configs["flat/recommended"],
    {
        ignores: ["dist/**", "dist_keycloak/**", "public/**"]
    },
    {
        plugins: {
            "react-refresh": reactRefresh,
            "react-hooks": reactHooks
        },
        languageOptions: {
            globals: {
                ...globals.browser
            }
        },
        settings: {
            react: {
                version: "19"
            }
        },
        rules: {
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true }
            ],
            "react-hooks/exhaustive-deps": "off",
            "@typescript-eslint/no-redeclare": "off",
            "no-labels": "off"
        }
    },
    {
        // Node/Bun build tooling, not browser code
        files: ["scripts/**/*.js"],
        languageOptions: {
            globals: {
                ...globals.node,
                Bun: "readonly"
            }
        }
    },
    {
        files: ["**/*.stories.*"],
        rules: {
            "import/no-anonymous-default-export": "off"
        }
    },
    {
        files: ["src/email/**/*.{ts,tsx}"],
        rules: {
            "react-refresh/only-export-components": "off"
        }
    },
    {
        files: ["src/components/ui/**/*.tsx"],
        rules: {
            "react-refresh/only-export-components": "off"
        }
    },
    {
        files: [
            "src/login/pages/register/Form.tsx",
            "src/login/pages/webauthn-authenticate/Page.tsx",
            "src/login/pages/login-passkeys-conditional-authenticate/Page.tsx"
        ],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/ban-ts-comment": "off"
        }
    }
);
