package io.karako.keycloak.ldap;

import org.jboss.logging.Logger;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.storage.ldap.LDAPStorageProvider;
import org.keycloak.storage.ldap.idm.model.LDAPObject;
import org.keycloak.storage.ldap.mappers.UserAttributeLDAPStorageMapper;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;

/**
 * LDAP Storage Mapper - Regex Attribute Extractor.
 *
 * Reuses the native user-attribute mapper to copy the LDAP attribute into the
 * chosen Keycloak user attribute (with default value, mandatory, binary and
 * read-only handling), then overlays a regex extraction on the imported value.
 *
 * Example:
 *   Source attribute : manager
 *   Value            : CN=John Doe,OU=Users,DC=exemple,DC=com
 *   Regex            : ^CN=([^,]+)
 *   Resulting claim  : manager = "John Doe"
 */
public class RegexLdapStorageMapper extends UserAttributeLDAPStorageMapper {

    private static final Logger LOG = Logger.getLogger(RegexLdapStorageMapper.class);

    public RegexLdapStorageMapper(ComponentModel mapperModel, LDAPStorageProvider ldapProvider) {
        super(mapperModel, ldapProvider);
    }

    @Override
    public void onImportUserFromLDAP(LDAPObject ldapUser, UserModel user, RealmModel realm, boolean isCreate) {
        super.onImportUserFromLDAP(ldapUser, user, realm, isCreate);

        String userAttr = mapperModel.get(UserAttributeLDAPStorageMapper.USER_MODEL_ATTRIBUTE);
        if (userAttr == null || userAttr.isBlank()) {
            return;
        }

        List<String> current = user.getAttributeStream(userAttr).toList();
        if (current.isEmpty()) {
            return;
        }

        String regexStr = getConfig(RegexLdapStorageMapperFactory.REGEX_PATTERN, RegexLdapStorageMapperFactory.DEFAULT_REGEX);
        String groupStr = getConfig(RegexLdapStorageMapperFactory.REGEX_GROUP,   RegexLdapStorageMapperFactory.DEFAULT_REGEX_GROUP);

        List<String> extracted = extractAll(regexStr, groupStr, current);
        if (!extracted.isEmpty()) {
            user.setAttribute(userAttr, extracted);
        }
    }

    /** Applies the regex to every value; a value that does not match is kept as-is. */
    static List<String> extractAll(String regexStr, String groupStr, List<String> values) {
        Pattern pattern = compile(regexStr);
        if (pattern == null) {
            return List.of();
        }

        Integer group = parseGroup(groupStr);
        if (group == null) {
            return List.of();
        }

        List<String> out = new ArrayList<>(values.size());
        for (String value : values) {
            if (value == null || value.isBlank()) {
                continue;
            }
            String extracted = extract(pattern, group, value.trim());
            out.add(extracted != null && !extracted.isBlank() ? extracted.trim() : value.trim());
        }
        return out;
    }

    /**
     * Deliberately a no-op: the extracted value is a transformation of what LDAP
     * holds, so writing it back would overwrite the source with its own excerpt.
     */
    @Override
    public void onRegisterUserToLDAP(LDAPObject ldapUser, UserModel localUser, RealmModel realm) {}

    private static Pattern compile(String regexStr) {
        try {
            return Pattern.compile(regexStr, Pattern.CASE_INSENSITIVE);
        } catch (PatternSyntaxException e) {
            LOG.warnf("Invalid regex: %s - %s", regexStr, e.getMessage());
            return null;
        }
    }

    private static Integer parseGroup(String groupStr) {
        try {
            return Integer.parseInt(groupStr.trim());
        } catch (NumberFormatException e) {
            LOG.warnf("Invalid group index: %s", groupStr);
            return null;
        }
    }

    private static String extract(Pattern pattern, int group, String value) {
        Matcher matcher = pattern.matcher(value);
        if (!matcher.find()) {
            return null;
        }
        try {
            return matcher.group(group);
        } catch (IndexOutOfBoundsException e) {
            LOG.warnf("Capturing group not found (index=%s)", group);
            return null;
        }
    }

    private String getConfig(String key, String defaultValue) {
        String val = mapperModel.get(key);
        return (val != null && !val.isBlank()) ? val : defaultValue;
    }
}
