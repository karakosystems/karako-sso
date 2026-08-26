package io.karako.keycloak.turnstile;

import jakarta.ws.rs.core.MultivaluedMap;
import org.jboss.logging.Logger;
import org.keycloak.authentication.FormAction;
import org.keycloak.authentication.FormContext;
import org.keycloak.authentication.ValidationContext;
import org.keycloak.broker.provider.util.SimpleHttp;
import org.keycloak.events.Errors;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.models.utils.FormMessage;
import org.keycloak.services.messages.Messages;
import org.keycloak.services.validation.Validation;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Cloudflare Turnstile on the registration form.
 *
 * Keycloak only ships Google reCAPTCHA form actions; this is the Turnstile
 * equivalent, verified server-side against siteverify.
 */
public class TurnstileFormAction implements FormAction {

    private static final Logger LOG = Logger.getLogger(TurnstileFormAction.class);

    static final String RESPONSE_FIELD = "cf-turnstile-response";
    static final String SCRIPT_URL =
        "https://challenges.cloudflare.com/turnstile/v0/api.js";
    static final String SITEVERIFY_URL =
        "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    @Override
    public void buildPage(FormContext context, LoginFormsProvider form) {
        AuthenticatorConfigModel config = context.getAuthenticatorConfig();
        String siteKey = configValue(config, TurnstileFormActionFactory.SITE_KEY);

        if (siteKey == null) {
            form.addError(new FormMessage(null, Messages.RECAPTCHA_NOT_CONFIGURED));
            return;
        }

        form.setAttribute("turnstileRequired", true);
        form.setAttribute("turnstileSiteKey", siteKey);
        form.setAttribute(
            "turnstileAction",
            configValue(config, TurnstileFormActionFactory.ACTION)
        );
        form.setAttribute(
            "turnstileTheme",
            configValue(config, TurnstileFormActionFactory.THEME, "auto")
        );
        form.addScript(SCRIPT_URL);
    }

    @Override
    public void validate(ValidationContext context) {
        MultivaluedMap<String, String> formData =
            context.getHttpRequest().getDecodedFormParameters();
        List<FormMessage> errors = new ArrayList<>();

        String token = formData.getFirst(RESPONSE_FIELD);
        AuthenticatorConfigModel config = context.getAuthenticatorConfig();
        String secret = configValue(config, TurnstileFormActionFactory.SECRET_KEY);

        if (secret == null) {
            errors.add(new FormMessage(null, Messages.RECAPTCHA_NOT_CONFIGURED));
            fail(context, formData, errors, Errors.INVALID_REGISTRATION);
            return;
        }

        if (Validation.isBlank(token) || !isTokenValid(context.getSession(), secret, token,
                context.getConnection().getRemoteAddr())) {
            errors.add(new FormMessage(null, Messages.RECAPTCHA_FAILED));
            formData.remove(RESPONSE_FIELD);
            fail(context, formData, errors, Errors.INVALID_REGISTRATION);
            return;
        }

        context.success();
    }

    private void fail(ValidationContext context,
                      MultivaluedMap<String, String> formData,
                      List<FormMessage> errors,
                      String error) {
        context.getEvent().error(error);
        context.validationError(formData, errors);
        context.excludeOtherErrors();
    }

    private boolean isTokenValid(KeycloakSession session, String secret, String token,
                                 String remoteAddr) {
        try {
            SimpleHttp request = SimpleHttp.doPost(SITEVERIFY_URL, session)
                .param("secret", secret)
                .param("response", token);
            if (remoteAddr != null) {
                request = request.param("remoteip", remoteAddr);
            }
            Map<?, ?> result = request.asJson(Map.class);
            return Boolean.TRUE.equals(result.get("success"));
        } catch (IOException e) {
            LOG.warnf("Turnstile verification failed: %s", e.getMessage());
            return false;
        }
    }

    private static String configValue(AuthenticatorConfigModel config, String key) {
        return configValue(config, key, null);
    }

    private static String configValue(AuthenticatorConfigModel config, String key,
                                      String fallback) {
        if (config == null || config.getConfig() == null) {
            return fallback;
        }
        String value = config.getConfig().get(key);
        return Validation.isBlank(value) ? fallback : value;
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
