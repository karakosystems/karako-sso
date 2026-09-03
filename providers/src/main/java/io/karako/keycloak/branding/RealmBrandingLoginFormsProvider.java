package io.karako.keycloak.branding;

import jakarta.ws.rs.core.Response;
import org.keycloak.forms.login.freemarker.FreeMarkerLoginFormsProvider;
import org.keycloak.models.KeycloakSession;
import org.keycloak.theme.Theme;

import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

// Keycloakify drops realm.attributes from its kcContext, so the realm's
// KARAKO_BRAND_* values travel to the theme as a form attribute instead.
public class RealmBrandingLoginFormsProvider extends FreeMarkerLoginFormsProvider {

    static final String PREFIX = "KARAKO_BRAND_";
    static final String ATTRIBUTE = "brandOverrides";

    public RealmBrandingLoginFormsProvider(KeycloakSession session) {
        super(session);
    }

    @Override
    protected Response processTemplate(Theme theme, String templateName, Locale locale) {
        Map<String, String> overrides = brandAttributes();

        if (!overrides.isEmpty()) {
            setAttribute(ATTRIBUTE, overrides);
        }

        return super.processTemplate(theme, templateName, locale);
    }

    private Map<String, String> brandAttributes() {
        Map<String, String> overrides = new LinkedHashMap<>();

        if (realm == null) {
            return overrides;
        }

        realm.getAttributes().forEach((key, value) -> {
            if (key != null && key.startsWith(PREFIX) && value != null && !value.isBlank()) {
                overrides.put(key, value);
            }
        });

        return overrides;
    }
}
