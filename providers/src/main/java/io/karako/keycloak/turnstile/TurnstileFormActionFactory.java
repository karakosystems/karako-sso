package io.karako.keycloak.turnstile;

import org.keycloak.Config;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormActionFactory;
import org.keycloak.models.AuthenticationExecutionModel.Requirement;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class TurnstileFormActionFactory implements FormActionFactory {

    public static final String PROVIDER_ID = "registration-turnstile-action";

    public static final String SITE_KEY = "turnstile.site.key";
    public static final String SECRET_KEY = "turnstile.secret.key";
    public static final String ACTION = "turnstile.action";
    public static final String THEME = "turnstile.theme";
    public static final String TEST_MODE = "turnstile.test.mode";

    // Cloudflare's public test keys: the widget always passes and siteverify
    // always succeeds. They protect nothing - replace them before going live.
    static final String TEST_SITE_KEY = "1x00000000000000000000AA";
    static final String TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

    private static final Requirement[] REQUIREMENT_CHOICES = {
        Requirement.REQUIRED,
        Requirement.DISABLED
    };

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "Cloudflare Turnstile";
    }

    @Override
    public String getHelpText() {
        return "Adds a Cloudflare Turnstile widget to the registration form and "
            + "verifies the token server-side before the account is created.";
    }

    @Override
    public String getReferenceCategory() {
        return "turnstile";
    }

    @Override
    public boolean isConfigurable() {
        return true;
    }

    @Override
    public Requirement[] getRequirementChoices() {
        return REQUIREMENT_CHOICES;
    }

    @Override
    public boolean isUserSetupAllowed() {
        return false;
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        ProviderConfigProperty siteKey = new ProviderConfigProperty();
        siteKey.setName(SITE_KEY);
        siteKey.setLabel("Site key");
        siteKey.setHelpText(
            "Public key from the Turnstile dashboard. Pre-filled with "
                + "Cloudflare's test key - replace it before going live."
        );
        siteKey.setType(ProviderConfigProperty.STRING_TYPE);
        siteKey.setDefaultValue(TEST_SITE_KEY);

        ProviderConfigProperty secretKey = new ProviderConfigProperty();
        secretKey.setName(SECRET_KEY);
        secretKey.setLabel("Secret key");
        secretKey.setHelpText(
            "Private key, used server-side only. Pre-filled with Cloudflare's "
                + "test key, which accepts any token - replace it before going live."
        );
        secretKey.setType(ProviderConfigProperty.PASSWORD);
        secretKey.setSecret(true);
        secretKey.setDefaultValue(TEST_SECRET_KEY);

        ProviderConfigProperty action = new ProviderConfigProperty();
        action.setName(ACTION);
        action.setLabel("Action");
        action.setHelpText("Optional label reported in the Turnstile analytics.");
        action.setType(ProviderConfigProperty.STRING_TYPE);
        action.setDefaultValue("register");

        ProviderConfigProperty theme = new ProviderConfigProperty();
        theme.setName(THEME);
        theme.setLabel("Widget theme");
        theme.setHelpText("auto follows the user's colour scheme.");
        theme.setType(ProviderConfigProperty.LIST_TYPE);
        theme.setOptions(List.of("auto", "light", "dark"));
        theme.setDefaultValue("auto");

        ProviderConfigProperty testMode = new ProviderConfigProperty();
        testMode.setName(TEST_MODE);
        testMode.setLabel("Use Cloudflare test keys");
        testMode.setHelpText(
            "Replaces both keys with Cloudflare's public test pair: the widget "
                + "always passes and any token is accepted. For local testing "
                + "only - it protects nothing."
        );
        testMode.setType(ProviderConfigProperty.BOOLEAN_TYPE);
        testMode.setDefaultValue(false);

        return List.of(testMode, siteKey, secretKey, action, theme);
    }

    @Override
    public FormAction create(KeycloakSession session) {
        return new TurnstileFormAction();
    }

    @Override
    public void init(Config.Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}
}
