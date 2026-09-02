package io.karako.keycloak.turnstile;

import jakarta.ws.rs.core.MultivaluedMap;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormContext;
import org.keycloak.authentication.ValidationContext;
import org.keycloak.events.Errors;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;

import java.util.ArrayList;
import java.util.List;

/**
 * Cloudflare Turnstile on the registration form.
 *
 * Keycloak only ships Google reCAPTCHA form actions; this is the Turnstile
 * equivalent, verified server-side against siteverify.
 */
public class TurnstileFormAction implements FormAction {

    @Override
    public void buildPage(FormContext context, LoginFormsProvider form) {
        if (!Turnstile.decorate(context.getSession(), form, context.getAuthenticatorConfig())) {
            form.addError(new FormMessage(null, Turnstile.MSG_NOT_CONFIGURED));
        }
    }

    @Override
    public void validate(ValidationContext context) {
        MultivaluedMap<String, String> formData =
            context.getHttpRequest().getDecodedFormParameters();
        List<FormMessage> errors = new ArrayList<>();

        AuthenticatorConfigModel config = context.getAuthenticatorConfig();
        String secret = Turnstile.secretKey(context.getSession(), config);

        if (secret == null) {
            errors.add(new FormMessage(null, Turnstile.MSG_NOT_CONFIGURED));
            fail(context, formData, errors);
            return;
        }

        String token = formData.getFirst(Turnstile.RESPONSE_FIELD);
        boolean valid = Turnstile.verify(
            context.getSession(),
            secret,
            token,
            context.getConnection().getRemoteAddr()
        );

        if (!valid) {
            errors.add(new FormMessage(null, Turnstile.MSG_FAILED));
            formData.remove(Turnstile.RESPONSE_FIELD);
            fail(context, formData, errors);
            return;
        }

        context.success();
    }

    private void fail(ValidationContext context,
                      MultivaluedMap<String, String> formData,
                      List<FormMessage> errors) {
        context.getEvent().error(Errors.INVALID_REGISTRATION);
        context.validationError(formData, errors);
        context.excludeOtherErrors();
    }

    @Override
    public void success(FormContext context) {}

    @Override
    public boolean requiresUser() {
        return false;
    }

    @Override
    public boolean configuredFor(KeycloakSession session, RealmModel realm, UserModel user) {
        return true;
    }

    @Override
    public void setRequiredActions(KeycloakSession session, RealmModel realm,
                                   UserModel user) {}

    @Override
    public void close() {}
}
