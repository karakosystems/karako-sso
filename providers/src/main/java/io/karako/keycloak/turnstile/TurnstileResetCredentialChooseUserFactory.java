package io.karako.keycloak.turnstile;

import org.keycloak.Config;
import org.keycloak.authentication.Authenticator;
import org.keycloak.authentication.AuthenticatorFactory;
import org.keycloak.models.AuthenticationExecutionModel.Requirement;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;
import org.keycloak.provider.ProviderConfigProperty;

import java.util.List;

public class TurnstileResetCredentialChooseUserFactory implements AuthenticatorFactory {

    public static final String PROVIDER_ID = "turnstile-reset-choose-user";

    private static final Requirement[] REQUIREMENT_CHOICES = { Requirement.REQUIRED };

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getDisplayType() {
        return "Choose User with Cloudflare Turnstile";
    }

    @Override
    public String getHelpText() {
        return "Replaces the forgotten-password form with one that carries a "
            + "Cloudflare Turnstile widget, so the reset emails cannot be "
            + "triggered in bulk.";
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
        return Turnstile.configProperties("reset-password");
    }

    @Override
    public Authenticator create(KeycloakSession session) {
        return new TurnstileResetCredentialChooseUser();
    }

    @Override
    public void init(Config.Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}
}
