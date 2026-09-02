import { createGetKcContextMock } from "@keycloakify/login-ui/KcContext/getKcContextMock";
import { kcEnvDefaults, themeNames } from "../../kc.gen";
import type { KcContextExtension, KcContextExtensionPerPage } from "../KcContext";

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    client: {
        baseUrl: "https://my-theme.keycloakify.dev"
    },
    darkMode: true,
    properties: {
        ...kcEnvDefaults
    }
};
// Every field is optional; the pages are listed so the mock matches the type.
const kcContextExtensionPerPage: KcContextExtensionPerPage = {
    "register.ftl": {},
    "login.ftl": {},
    "login-reset-password.ftl": {}
};

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {},
    overridesPerPage: {}
});
