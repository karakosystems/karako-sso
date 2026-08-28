package io.karako.keycloak.turnstile;

import org.keycloak.Config;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel.Requirement;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class TurnstileUsernamePasswordFormFactory implements AuthenticatorFactory {

    public static final String PROVIDER_ID = "turnstile-username-password-form";

    private static final Requirement[] REQUIREMENT_CHOICES = { Requirement.REQUIRED };

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "Username Password Form with Cloudflare Turnstile";
    }

    @Override
    public String getHelpText() {
        return "Replaces the standard username and password form with one that "
            + "carries a Cloudflare Turnstile widget, verified server-side "
            + "before the credentials are checked.";
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
        return Turnstile.configProperties("login");
    }

    @Override
    public Authenticator create(KeycloakSession session) {
        return new TurnstileUsernamePasswordForm(session);
    }

    @Override
    public void init(Config.Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}
}
