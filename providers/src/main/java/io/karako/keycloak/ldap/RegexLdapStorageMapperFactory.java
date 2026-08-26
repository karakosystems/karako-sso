package io.karako.keycloak.ldap;

import org.keycloak.component.ComponentModel;
import org.keycloak.provider.ProviderConfigProperty;
import org.keycloak.storage.ldap.LDAPStorageProvider;
import org.keycloak.storage.ldap.mappers.AbstractLDAPStorageMapper;
import org.keycloak.storage.ldap.mappers.UserAttributeLDAPStorageMapperFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * LDAP Storage Mapper factory - Regex Attribute Extractor.
 *
 * Extends the native user-attribute-ldap-mapper factory (the same way Keycloak's
 * own certificate-ldap-mapper does) to inherit all its config and behavior
 * (read-only, always-read-from-ldap, mandatory, default value, binary, the
 * User Profile attribute dropdown), and adds a regex extraction step on top.
 *
 * Shows up under: Realm → User federation → LDAP → Mappers.
 */
public class RegexLdapStorageMapperFactory extends UserAttributeLDAPStorageMapperFactory {

    public static final String PROVIDER_ID = "regex-attribute-ldap-mapper";

    public static final String REGEX_PATTERN = "regex.pattern";
    public static final String REGEX_GROUP   = "regex.group";

    static final String DEFAULT_REGEX       = "^CN=([^,]+)";
    static final String DEFAULT_REGEX_GROUP = "1";

    @Override
    public String getId() {
        return PROVIDER_ID;
    }

    @Override
    public String getHelpText() {
        return "Like the user-attribute mapper, but applies a configurable regex to the " +
               "LDAP attribute value before storing it as a Keycloak user attribute. " +
               "The default pattern extracts the first CN of a DN.";
    }

    @Override
    public List<ProviderConfigProperty> getConfigProperties() {
        List<ProviderConfigProperty> props = new ArrayList<>(super.getConfigProperties());

        ProviderConfigProperty regex = new ProviderConfigProperty();
        regex.setName(REGEX_PATTERN);
        regex.setLabel("Extraction regex");
        regex.setHelpText(
            "Java regular expression applied to the LDAP attribute value. " +
            "Use a capturing group ( ) to isolate the value to extract. " +
            "Example: ^CN=([^,]+)  →  extracts the first CN of the DN."
        );
        regex.setType(ProviderConfigProperty.STRING_TYPE);
        regex.setDefaultValue(DEFAULT_REGEX);
        props.add(regex);

        ProviderConfigProperty group = new ProviderConfigProperty();
        group.setName(REGEX_GROUP);
        group.setLabel("Capturing group (index)");
        group.setHelpText(
            "Index of the capturing group to use (1 = first group). Example: 1"
        );
        group.setType(ProviderConfigProperty.STRING_TYPE);
        group.setDefaultValue(DEFAULT_REGEX_GROUP);
        props.add(group);

        return props;
    }

    @Override
    protected AbstractLDAPStorageMapper createMapper(ComponentModel mapperModel,
                                                     LDAPStorageProvider federationProvider) {
        return new RegexLdapStorageMapper(mapperModel, federationProvider);
    }
}
