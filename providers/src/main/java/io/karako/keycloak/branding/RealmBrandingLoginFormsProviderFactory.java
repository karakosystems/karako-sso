package io.karako.keycloak.branding;

import org.keycloak.Config;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.forms.login.LoginFormsProviderFactory;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.KeycloakSessionFactory;

/**
 * Selected with --spi-login-forms-provider=karako, set at image build time.
 */
public class RealmBrandingLoginFormsProviderFactory implements LoginFormsProviderFactory {

    public static final String PROVIDER_ID = "karako";

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public LoginFormsProvider create(KeycloakSession session) {
        return new RealmBrandingLoginFormsProvider(session);
    }

    @Override
    public void init(Config.Scope config) {}

    @Override
    public void postInit(KeycloakSessionFactory factory) {}

    @Override
    public void close() {}
}
