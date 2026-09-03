package io.karako.keycloak.turnstile;

import org.jboss.logging.Logger;
import org.keycloak.broker.provider.util.SimpleHttp;
import org.keycloak.forms.login.LoginFormsProvider;
import org.keycloak.models.AuthenticatorConfigModel;
import org.keycloak.models.KeycloakSession;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.services.validation.Validation;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public final class Turnstile {

    private static final Logger LOG = Logger.getLogger(Turnstile.class);

    public static final String SITE_KEY = "turnstile.site.key";
    public static final String SHARED_SITE_KEY = "KARAKO_TURNSTILE_SITE_KEY";
    public static final String SHARED_SECRET_KEY = "KARAKO_TURNSTILE_SECRET_KEY";
    public static final String SECRET_KEY = "turnstile.secret.key";
    public static final String ACTION = "turnstile.action";
    public static final String THEME = "turnstile.theme";
    public static final String TEST_MODE = "turnstile.test.mode";

    public static final String RESPONSE_FIELD = "cf-turnstile-response";

    public static final String MSG_FAILED = "turnstileFailed";
    public static final String MSG_NOT_CONFIGURED = "turnstileNotConfigured";

    static final String SCRIPT_URL =
        "https://challenges.cloudflare.com/turnstile/v0/api.js";
    static final String SITEVERIFY_URL =
        "https://challenges.cloudflare.com/turnstile/v0/siteverify";

    // Cloudflare's public test keys: the widget always passes and siteverify
    // always succeeds. They protect nothing - replace them before going live.
    static final String TEST_SITE_KEY = "1x00000000000000000000AA";
    static final String TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";

    private Turnstile() {}

    /** False when no site key is available: the caller must reject the form. */
    public static boolean decorate(KeycloakSession session, LoginFormsProvider form,
                                   AuthenticatorConfigModel config) {
        String siteKey = siteKey(session, config);

        if (siteKey == null) {
            return false;
        }

        form.setAttribute("turnstileRequired", true);
        form.setAttribute("turnstileSiteKey", siteKey);
        form.setAttribute("turnstileAction", value(config, ACTION));
        form.setAttribute("turnstileTheme", value(config, THEME, "auto"));
        form.addScript(SCRIPT_URL);

        return true;
    }

    public static String siteKey(KeycloakSession session, AuthenticatorConfigModel config) {
        if (isTestMode(config)) {
            return TEST_SITE_KEY;
        }
        return shared(session, value(config, SITE_KEY), SHARED_SITE_KEY);
    }

    public static String secretKey(KeycloakSession session, AuthenticatorConfigModel config) {
        if (isTestMode(config)) {
            return TEST_SECRET_KEY;
        }
        return shared(session, value(config, SECRET_KEY), SHARED_SECRET_KEY);
    }

    /** The step's own value wins, then the realm attribute, then the environment. */
    private static String shared(KeycloakSession session, String fromConfig, String key) {
        String fromRealm = null;

        if (session != null && session.getContext() != null
                && session.getContext().getRealm() != null) {
            fromRealm = session.getContext().getRealm().getAttribute(key);
        }

        return firstNonBlank(fromConfig, fromRealm, System.getenv(key));
    }

    static String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }
        return null;
    }

    public static boolean verify(KeycloakSession session, String secret, String token,
                                 String remoteAddr) {
        if (secret == null || Validation.isBlank(token)) {
            return false;
        }

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

    public static List<ProviderConfigProperty> configProperties(String defaultAction) {
        ProviderConfigProperty siteKey = new ProviderConfigProperty();
        siteKey.setName(SITE_KEY);
        siteKey.setLabel("Site key");
        siteKey.setHelpText(
            "Public key from the Turnstile dashboard. Leave empty to use the "
                + "realm attribute " + SHARED_SITE_KEY + ", then the environment "
                + "variable of the same name."
        );
        siteKey.setType(ProviderConfigProperty.STRING_TYPE);

        ProviderConfigProperty secretKey = new ProviderConfigProperty();
        secretKey.setName(SECRET_KEY);
        secretKey.setLabel("Secret key");
        secretKey.setHelpText(
            "Private key, used server-side only. Leave empty to use the realm "
                + "attribute " + SHARED_SECRET_KEY + ", then the environment "
                + "variable of the same name - which is where a secret belongs, "
                + "since realm attributes are readable through the admin API."
        );
        secretKey.setType(ProviderConfigProperty.PASSWORD);
        secretKey.setSecret(true);

        ProviderConfigProperty action = new ProviderConfigProperty();
        action.setName(ACTION);
        action.setLabel("Action");
        action.setHelpText("Optional label reported in the Turnstile analytics.");
        action.setType(ProviderConfigProperty.STRING_TYPE);
        action.setDefaultValue(defaultAction);

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

    static boolean isTestMode(AuthenticatorConfigModel config) {
        return Boolean.parseBoolean(value(config, TEST_MODE, "false"));
    }

    static String value(AuthenticatorConfigModel config, String key) {
        return value(config, key, null);
    }

    static String value(AuthenticatorConfigModel config, String key, String fallback) {
        if (config == null || config.getConfig() == null) {
            return fallback;
        }
        String value = config.getConfig().get(key);
        return Validation.isBlank(value) ? fallback : value;
    }
}
