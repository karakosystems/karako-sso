import i18n from "i18next";
import type { GetMessages } from "keycloakify-emails";
import { initReactI18next } from "react-i18next";

import enTranslation from "./locales/en/translation.json";
import frTranslation from "./locales/fr/translation.json";

const resources = {
    en: {
        translation: enTranslation
    },
    fr: {
        translation: frTranslation
    }
};

i18n.use(initReactI18next).init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
        escapeValue: false
    }
});

export default i18n;

/**
 * we want to have this as function with a params, to give developers a
 * flexibility to initialize theirs own i18n solution here
 */
export const getMessages: GetMessages = props => {
    const t = i18n.getFixedT(props.locale);

    return {
        "requiredAction.CONFIGURE_TOTP": t("requiredAction.configure_totp"),
        "requiredAction.TERMS_AND_CONDITIONS": t("requiredAction.terms_and_conditions"),
        "requiredAction.UPDATE_PASSWORD": t("requiredAction.update_password"),
        "requiredAction.UPDATE_PROFILE": t("requiredAction.update_profile"),
        "requiredAction.VERIFY_EMAIL": t("requiredAction.verify_email"),
        "requiredAction.CONFIGURE_RECOVERY_AUTHN_CODES": t(
            "requiredAction.configure_recovery_authn_codes"
        ),
        "linkExpirationFormatter.timePeriodUnit.seconds": t("requiredAction.seconds"),
        "linkExpirationFormatter.timePeriodUnit.minutes": t("requiredAction.minutes"),
        "linkExpirationFormatter.timePeriodUnit.hours": t("requiredAction.hours"),
        "linkExpirationFormatter.timePeriodUnit.days": t("requiredAction.days")
    };
};
