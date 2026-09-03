package io.karako.keycloak.turnstile;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

// The step's own value wins, then the realm attribute, then the environment.
class TurnstileKeyResolutionTest {

    @Test
    void stepConfigWins() {
        assertEquals("step", Turnstile.firstNonBlank("step", "realm", "env"));
    }

    @Test
    void realmAttributeUsedWhenStepIsEmpty() {
        assertEquals("realm", Turnstile.firstNonBlank(null, "realm", "env"));
    }

    @Test
    void environmentUsedWhenNothingElseIsSet() {
        assertEquals("env", Turnstile.firstNonBlank(null, null, "env"));
    }

    @Test
    void blankIsTreatedAsUnset() {
        assertEquals("env", Turnstile.firstNonBlank("", "   ", "env"));
    }

    @Test
    void nullWhenNoSourceProvidesAKey() {
        assertNull(Turnstile.firstNonBlank(null, "", "  "));
    }
}
