package io.karako.keycloak.turnstile;

import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.authenticators.browser.UsernamePasswordForm;
import org.keycloak.events.Errors;
import org.keycloak.models.KeycloakSession;

/**
 * The standard username and password form, guarded by Cloudflare Turnstile.
 *
 * The token is verified before the credentials are, so a failed challenge
 * costs nothing and reveals nothing about the account.
 */
public class TurnstileUsernamePasswordForm extends UsernamePasswordForm {

    public TurnstileUsernamePasswordForm(KeycloakSession session) {
        super(session);
    }

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        decorate(context);
        super.authenticate(context);
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        decorate(context);

        MultivaluedMap<String, String> formData =
            context.getHttpRequest().getDecodedFormParameters();
        String secret =
            Turnstile.secretKey(context.getSession(), context.getAuthenticatorConfig());

        if (secret == null) {
            challengeWithError(context, formData, Turnstile.MSG_NOT_CONFIGURED);
            return;
        }

        boolean valid = Turnstile.verify(
            context.getSession(),
            secret,
            formData.getFirst(Turnstile.RESPONSE_FIELD),
            context.getConnection().getRemoteAddr()
        );

        if (!valid) {
            challengeWithError(context, formData, Turnstile.MSG_FAILED);
            return;
        }

        super.action(context);
    }

    /**
     * The parent builds the page through context.form(), which is cached per
     * session, so the attributes set here survive until it renders.
     */
    private void decorate(AuthenticationFlowContext context) {
        if (!Turnstile.decorate(
                context.getSession(), context.form(), context.getAuthenticatorConfig())) {
            context.form().setError(Turnstile.MSG_NOT_CONFIGURED);
        }
    }

    private void challengeWithError(AuthenticationFlowContext context,
                                    MultivaluedMap<String, String> formData,
                                    String message) {
        context.getEvent().error(Errors.INVALID_USER_CREDENTIALS);
        formData.remove(Turnstile.RESPONSE_FIELD);

        Response challenge = context.form()
            .setFormData(formData)
            .setError(message)
            .createLoginUsernamePassword();

        context.failureChallenge(AuthenticationFlowError.INVALID_CREDENTIALS, challenge);
    }
}
