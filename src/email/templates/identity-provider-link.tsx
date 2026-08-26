import i18n, { type TFunction } from "i18next";
import { Text, render } from "jsx-email";
import type { GetSubject, GetTemplate, GetTemplateProps } from "keycloakify-emails";
import { createVariablesHelper } from "keycloakify-emails/variables";
import { EmailButton } from "../components/EmailButton";
import { EmailLayout } from "../layout";
import { previewLocale } from "../utils/previewLocale";
import { applyRTL } from "../utils/RTL";

type TemplateProps = Omit<GetTemplateProps, "plainText"> & { t: TFunction };

const paragraph = {
    lineHeight: 1.65,
    fontSize: 15,
    color: "#1a1a1a",
    fontWeight: 400,
    textAlign: "left" as const
};

const rtlStyle = {
    direction: "rtl" as const,
    textAlign: "right" as const
};

export const previewProps: TemplateProps = {
    t: i18n.getFixedT(previewLocale),
    locale: previewLocale,
    themeName: "vanilla"
};

export const templateName = "Identity Provider Link";

const { exp } = createVariablesHelper("identity-provider-link.ftl");

export const Template = ({ locale, t }: TemplateProps) => {
    const isRTL = locale === "ar";

    return (
        <EmailLayout preview={t("identity-provider-link.subject")} locale={locale}>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.message", {
                    identityProviderDisplayName: exp("identityProviderDisplayName"),
                    realmName: exp("realmName"),
                    username: exp("identityProviderContext.username")
                })}
            </Text>

            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.clickLink")}
            </Text>

            <EmailButton href={exp("link")} align={isRTL ? "right" : "left"}>
                {t("identity-provider-link.linkAccountsButton")}
            </EmailButton>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.linkExpiration", {
                    expiration: exp("linkExpirationFormatter(linkExpiration)")
                })}
            </Text>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.ignoreMessage")}
            </Text>
            <Text style={applyRTL(paragraph, isRTL, rtlStyle)}>
                {t("identity-provider-link.loginInfo", {
                    identityProviderDisplayName: exp("identityProviderDisplayName"),
                    realmName: exp("realmName")
                })}
            </Text>
        </EmailLayout>
    );
};

export const getTemplate: GetTemplate = async props => {
    const t = i18n.getFixedT(props.locale);
    return await render(<Template {...props} t={t} />, { plainText: props.plainText });
};

export const getSubject: GetSubject = async props => {
    const t = i18n.getFixedT(props.locale);
    return t("identity-provider-link.subject");
};
