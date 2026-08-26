import { i18nBuilder } from "@keycloakify/login-ui/i18n";
import type { ThemeName } from "../kc.gen";

/** @see: https://docs.keycloakify.dev/features/i18n */
const { I18nProvider, useI18n } = i18nBuilder
    .withThemeName<ThemeName>()
    .withCustomTranslations({
        en: {
            welcomeMessage: "Welcome to Karako - your secure access to our services.",
            loginAccountTitle: "Sign in to your account",
            registerTitle: "Create a new account",
            email: "Email",
            noAccount: "Don't have an account?",
            doRegister: "Sign up",
            "organization.selectTitle": "Choose Your Organization",
            "organization.pickPlaceholder": "Pick an organization to continue",
            "identity-provider-login-last-used": "Last used",
            attemptedUsernameLoggingInAs: "Logging in as",
            switchToDarkMode: "Switch to dark mode",
            switchToLightMode: "Switch to light mode",
            turnstileFailed: "Security check failed. Please try again.",
            turnstileNotConfigured:
                "The security check is required but has not been configured."
        },
        fr: {
            welcomeMessage: "Bienvenue sur Karako - votre accès sécurisé à nos services.",
            loginAccountTitle: "Connectez-vous à votre compte",
            registerTitle: "Créer un nouveau compte",
            email: "E-mail",
            doRegister: "S'inscrire",
            noAccount: "Vous n'avez pas de compte?",
            "organization.selectTitle": "Choisissez Votre Organisation",
            "organization.pickPlaceholder":
                "Sélectionnez une organisation pour continuer",
            "identity-provider-login-last-used": "Dernière utilisation",
            attemptedUsernameLoggingInAs: "Se connecter en tant que",
            switchToDarkMode: "Passer en mode sombre",
            switchToLightMode: "Passer en mode clair",
            turnstileFailed: "La vérification de sécurité a échoué. Veuillez réessayer.",
            turnstileNotConfigured:
                "La vérification de sécurité est requise mais n'a pas été configurée."
        }
    })
    .build();

export { I18nProvider, useI18n };
