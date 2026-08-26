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
        siteKey.setHelpText("Public key from the Turnstile dashboard.");
        siteKey.setType(ProviderConfigProperty.STRING_TYPE);

        ProviderConfigProperty secretKey = new ProviderConfigProperty();
        secretKey.setName(SECRET_KEY);
        secretKey.setLabel("Secret key");
        secretKey.setHelpText("Private key, used server-side only.");
        secretKey.setType(ProviderConfigProperty.PASSWORD);
        secretKey.setSecret(true);

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

        return List.of(siteKey, secretKey, action, theme);
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
