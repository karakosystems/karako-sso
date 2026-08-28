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
        return Turnstile.configProperties("register");
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
