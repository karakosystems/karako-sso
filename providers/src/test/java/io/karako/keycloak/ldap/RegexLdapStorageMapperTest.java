package io.karako.keycloak.ldap;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RegexLdapStorageMapperTest {

    private static final String CN = "^CN=([^,]+)";

    @Test
    void extractsTheFirstCnOfADn() {
        assertEquals(
            List.of("John Doe"),
            RegexLdapStorageMapper.extractAll(
                CN, "1", List.of("CN=John Doe,OU=Users,DC=example,DC=com"))
        );
    }

    @Test
    void keepsEveryValueOfAMultiValuedAttribute() {
        List<String> result = RegexLdapStorageMapper.extractAll(CN, "1", List.of(
            "CN=Alice,OU=Users,DC=example,DC=com",
            "CN=Bob,OU=Users,DC=example,DC=com",
            "CN=Carol,OU=Users,DC=example,DC=com"
        ));
        assertEquals(List.of("Alice", "Bob", "Carol"), result);
    }

    @Test
    void keepsAValueThatDoesNotMatchInsteadOfDroppingIt() {
        assertEquals(
            List.of("Alice", "not-a-dn"),
            RegexLdapStorageMapper.extractAll(
                CN, "1", List.of("CN=Alice,DC=example", "not-a-dn"))
        );
    }

    @Test
    void ignoresBlankValues() {
        assertEquals(
            List.of("Alice"),
            RegexLdapStorageMapper.extractAll(CN, "1", List.of("CN=Alice,DC=x", "", "   "))
        );
    }

    @Test
    void isCaseInsensitive() {
        assertEquals(
            List.of("Alice"),
            RegexLdapStorageMapper.extractAll(CN, "1", List.of("cn=Alice,dc=example"))
        );
    }

    @Test
    void returnsNothingOnAnInvalidRegex() {
        assertTrue(RegexLdapStorageMapper.extractAll("([", "1", List.of("CN=Alice")).isEmpty());
    }

    @Test
    void returnsNothingOnANonNumericGroup() {
        assertTrue(RegexLdapStorageMapper.extractAll(CN, "abc", List.of("CN=Alice")).isEmpty());
    }

    @Test
    void keepsTheValueWhenTheCapturingGroupDoesNotExist() {
        assertEquals(
            List.of("CN=Alice,DC=x"),
            RegexLdapStorageMapper.extractAll(CN, "9", List.of("CN=Alice,DC=x"))
        );
    }

    @Test
    void supportsAnotherGroupIndex() {
        assertEquals(
            List.of("Users"),
            RegexLdapStorageMapper.extractAll(
                "^CN=([^,]+),OU=([^,]+)", "2", List.of("CN=John,OU=Users,DC=x"))
        );
    }
}
