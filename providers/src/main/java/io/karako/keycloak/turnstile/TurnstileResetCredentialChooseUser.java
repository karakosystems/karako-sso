package io.karako.keycloak.turnstile;

import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.keycloak.authentication.AuthenticationFlowContext;
import org.keycloak.authentication.AuthenticationFlowError;
import org.keycloak.authentication.authenticators.resetcred.ResetCredentialChooseUser;
import org.keycloak.events.Errors;
import org.keycloak.models.AuthenticatorConfigModel;

public class TurnstileResetCredentialChooseUser extends ResetCredentialChooseUser {

    @Override
    public void authenticate(AuthenticationFlowContext context) {
        AuthenticatorConfigModel config = context.getAuthenticatorConfig();

        // The provider is cached per session, so the attributes survive until
        // the parent builds the page from it.
        if (!Turnstile.decorate(context.getSession(), context.form(), config)) {
            context.form().setError(Turnstile.MSG_NOT_CONFIGURED);
        }

        super.authenticate(context);
    }

    @Override
    public void action(AuthenticationFlowContext context) {
        AuthenticatorConfigModel config = context.getAuthenticatorConfig();

        MultivaluedMap<String, String> formData =
            context.getHttpRequest().getDecodedFormParameters();
        String secret = Turnstile.secretKey(context.getSession(), config);

        if (secret == null) {
            challengeWithError(context, config, Turnstile.MSG_NOT_CONFIGURED);
            return;
        }

        boolean valid = Turnstile.verify(
            context.getSession(),
            secret,
            formData.getFirst(Turnstile.RESPONSE_FIELD),
            context.getConnection().getRemoteAddr()
        );

        if (!valid) {
            challengeWithError(context, config, Turnstile.MSG_FAILED);
            return;
        }

        super.action(context);
    }

    private void challengeWithError(AuthenticationFlowContext context,
                                    AuthenticatorConfigModel config,
                                    String message) {
        context.getEvent().error(Errors.INVALID_USER_CREDENTIALS);

        Turnstile.decorate(context.getSession(), context.form(), config);
        Response challenge = context.form().setError(message).createPasswordReset();

        context.failureChallenge(AuthenticationFlowError.INVALID_CREDENTIALS, challenge);
    }
}
