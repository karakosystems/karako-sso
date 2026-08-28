package io.karako.keycloak.turnstile;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * AUTHENTICATION_EXECUTION.AUTHENTICATOR is a VARCHAR(36): a longer provider id
 * only fails when the execution is saved, not when the provider is loaded.
 */
class ProviderIdLengthTest {

    private static final int MAX = 36;

    @Test
    void registrationFormActionIdFits() {
        assertFits(TurnstileFormActionFactory.PROVIDER_ID);
    }

    @Test
    void usernamePasswordFormIdFits() {
        assertFits(TurnstileUsernamePasswordFormFactory.PROVIDER_ID);
    }

    @Test
    void resetChooseUserIdFits() {
        assertFits(TurnstileResetCredentialChooseUserFactory.PROVIDER_ID);
    }

    private static void assertFits(String providerId) {
        assertTrue(
            providerId.length() <= MAX,
            providerId + " is " + providerId.length() + " characters, max is " + MAX
        );
    }
}
