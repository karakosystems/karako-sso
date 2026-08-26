package io.karako.keycloak.ldap;

import org.jboss.logging.Logger;
import org.keycloak.component.ComponentModel;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.keycloak.storage.ldap.LDAPStorageProvider;
import org.keycloak.storage.ldap.idm.model.LDAPObject;
import org.keycloak.storage.ldap.mappers.UserAttributeLDAPStorageMapper;

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

        String current = user.getFirstAttribute(userAttr);
        if (current == null || current.isBlank()) {
            return;
        }

        String regexStr = getConfig(RegexLdapStorageMapperFactory.REGEX_PATTERN, RegexLdapStorageMapperFactory.DEFAULT_REGEX);
        String groupStr = getConfig(RegexLdapStorageMapperFactory.REGEX_GROUP,   RegexLdapStorageMapperFactory.DEFAULT_REGEX_GROUP);

        String extracted = extract(regexStr, groupStr, current.trim());
        if (extracted != null && !extracted.isBlank()) {
            user.setSingleAttribute(userAttr, extracted.trim());
        }
    }

    @Override
    public void onRegisterUserToLDAP(LDAPObject ldapUser, UserModel localUser, RealmModel realm) {}

    private String extract(String regexStr, String groupStr, String value) {
        try {
            Matcher matcher = Pattern.compile(regexStr, Pattern.CASE_INSENSITIVE).matcher(value);
            if (!matcher.find()) {
                return null;
            }
            return matcher.group(Integer.parseInt(groupStr.trim()));
        } catch (PatternSyntaxException e) {
            LOG.warnf("Invalid regex: %s — %s", regexStr, e.getMessage());
        } catch (NumberFormatException e) {
            LOG.warnf("Invalid group index: %s", groupStr);
        } catch (IndexOutOfBoundsException e) {
            LOG.warnf("Capturing group not found (index=%s)", groupStr);
        }
        return null;
    }

    private String getConfig(String key, String defaultValue) {
        String val = mapperModel.get(key);
        return (val != null && !val.isBlank()) ? val : defaultValue;
    }
}
