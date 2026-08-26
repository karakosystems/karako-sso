import {
    Body,
    ColorScheme,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Raw,
    Section,
    Text
} from "jsx-email";
import { createVariablesHelper } from "keycloakify-emails/variables";
import type { PropsWithChildren, ReactNode } from "react";
import {
    borderColor,
    companyLegalName,
    companyLogo,
    companyName,
    mutedColor,
    primaryColor,
    textColor
} from "./constants";
import i18n from "./i18n";

const page = {
    backgroundColor: "#f4f4f7",
    fontSize: "16px",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    margin: 0,
    padding: "32px 12px"
};

const card = {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    backgroundColor: "#ffffff",
    border: `1px solid ${borderColor}`,
    borderTop: "0"
};

const accentBar = {
    height: "4px",
    backgroundColor: primaryColor,
    fontSize: "1px",
    lineHeight: "4px"
};

const logoImage = {
    display: "block",
    border: "0",
    outline: "none",
    textDecoration: "none",
    height: "auto"
};

const content = {
    padding: "40px 40px 8px 40px",
    color: textColor
};

const divider = {
    borderColor: borderColor,
    borderWidth: "1px 0 0 0",
    margin: "24px 40px 0 40px",
    width: "auto"
};

const footer = {
    padding: "24px 40px 36px 40px"
};

const logoWrap = {
    display: "inline-block",
    lineHeight: 0
};

const footerText = {
    margin: "16px 0 0 0",
    fontSize: "12px",
    lineHeight: "1.6",
    color: mutedColor,
    textAlign: "left" as const
};

const darkModeStyles = `<style type="text/css">
  @media (prefers-color-scheme: dark) {
    body, .email-body { background-color: #0c0c0c !important; }
    .email-card { background-color: #18181b !important; border-color: #2a2a2a !important; }
    .email-content p, .email-content li, .email-content td { color: #ededed !important; }
    .email-divider { border-color: #2a2a2a !important; border-top-color: #2a2a2a !important; }
    .email-footer-text { color: #a1a1aa !important; }
    .email-logo-wrap { background-color: #ffffff !important; padding: 8px 12px !important; border-radius: 8px !important; display: inline-block !important; }
  }
</style>`;

const currentYear = new Date().getFullYear();

const { exp } = createVariablesHelper("email-test.ftl");

export const EmailLayout = ({
    locale,
    children,
    preview
}: PropsWithChildren<{ preview: ReactNode; locale: string }>) => {
    const t = i18n.getFixedT(locale);

    return (
        <Html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
            <Head>
                <ColorScheme mode="light dark" />
                <Raw content={darkModeStyles} />
            </Head>
            <Preview>{preview}</Preview>
            <Body style={page} className="email-body">
                <Container style={card} className="email-card">
                    <Section style={accentBar}>&nbsp;</Section>

                    <Section style={content} className="email-content">
                        {children}
                    </Section>

                    <Hr style={divider} className="email-divider" />

                    <Section style={footer}>
                        <span style={logoWrap} className="email-logo-wrap">
                            <Img
                                src={companyLogo}
                                width={132}
                                alt={companyName}
                                style={logoImage}
                            />
                        </span>
                        <Text style={footerText} className="email-footer-text">
                            {t("footer.allRightsReserved", {
                                currentYear,
                                realmName: exp("realmName"),
                                companyName: companyLegalName
                            })}
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};
