import type { KcContext } from "@keycloakify/login-ui/core/KcContext/KcContext";
import { useEffect, useRef } from "react";
import { base64url } from "rfc4648";
import { assert } from "tsafe/assert";
import { useI18n } from "../../i18n";

// see https://github.com/keycloak/keycloak/blob/main/themes/src/main/resources/theme/base/login/resources/js/webauthnAuthenticate.js

export type AuthenticateOptions = {
    isUserIdentified: boolean;

    challenge: string;

    rpId: string;

    userVerification: UserVerificationRequirement | string;

    createTimeout: number;

    authenticators: { credentialId: string }[] | undefined;

    mediation: "optional" | "conditional";

    errmsg: string | undefined;
};

export type WebAuthnResult =
    | {
          success: true;
          clientDataJSON: string;
          authenticatorData: string;
          signature: string;
          credentialId: string;
          userHandle: string;
      }
    | {
          success: false;
          error: string;
      };

let abortController: AbortController | undefined = undefined;

export interface UseLogicProps {
    isUserIdentified: "true" | "false";
    challenge: string;
    rpId: string;
    userVerification: string;
    createTimeout: string | number;
    authenticators: KcContext.WebauthnAuthenticate.WebauthnAuthenticator[] | undefined;
    loginAction: string;
}

export function useLogic(props: UseLogicProps) {
    const { msgStr } = useI18n();

    const {
        isUserIdentified,
        challenge,
        rpId,
        userVerification,
        createTimeout,
        authenticators
    } = props;

    const webAuthnFormRef = useRef<HTMLFormElement>(null);
    const submitWebAuthn = (result: WebAuthnResult) => {
        const form = webAuthnFormRef.current;
        assert(form !== null);

        const getInput = (name: string) => {
            const input = form.elements.namedItem(name);
            assert(input instanceof HTMLInputElement, `Missing hidden input: ${name}`);
            return input;
        };

        if (result.success) {
            getInput("clientDataJSON").value = result.clientDataJSON;
            getInput("authenticatorData").value = result.authenticatorData;
            getInput("signature").value = result.signature;
            getInput("credentialId").value = result.credentialId;
            getInput("userHandle").value = result.userHandle;
        } else {
            getInput("error").value = result.error;
        }

        form.submit();
    };

    const authOptions = {
        isUserIdentified: isUserIdentified === "true",
        challenge: challenge,
        userVerification: userVerification,
        rpId: rpId,
        createTimeout:
            typeof createTimeout === "string" ? Number(createTimeout) : createTimeout,
        authenticators: authenticators
    };

    const onPasskeyDoAuthenticateClick = async () => {
        const result = await authenticate({
            ...authOptions,
            mediation: "optional",
            errmsg: msgStr("webauthn-unsupported-browser-text")
        });
        if (result) submitWebAuthn(result);
    };

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (
                !window.PublicKeyCredential ||
                !PublicKeyCredential.isConditionalMediationAvailable
            )
                return;

            const isAvailable =
                await PublicKeyCredential.isConditionalMediationAvailable();
            if (!isAvailable) return;

            const result = await authenticate({
                ...authOptions,
                mediation: "conditional",
                errmsg: msgStr("passkey-unsupported-browser-text")
            });

            if (cancelled) return;
            if (result) submitWebAuthn(result);
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        webAuthnFormRef,
        onPasskeyDoAuthenticateClick
    };
}

export async function authenticate(
    options: AuthenticateOptions
): Promise<WebAuthnResult | null> {
    const {
        isUserIdentified,
        challenge,
        rpId,
        userVerification,
        createTimeout,
        authenticators,
        errmsg,
        mediation
    } = options;

    if (!window.PublicKeyCredential) {
        return { success: false, error: errmsg || "WebAuthn not supported" };
    }

    const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: new Uint8Array(base64url.parse(challenge, { loose: true })),
        rpId: rpId
    };

    if (userVerification && userVerification !== "not specified") {
        publicKey.userVerification = userVerification as UserVerificationRequirement;
    }

    if (createTimeout !== 0) publicKey.timeout = createTimeout * 1000;

    if (isUserIdentified && authenticators) {
        publicKey.allowCredentials = authenticators.map(auth => ({
            id: new Uint8Array(base64url.parse(auth.credentialId, { loose: true })),
            type: "public-key"
        }));
    }

    try {
        const credential = (await navigator.credentials.get({
            publicKey,
            signal: getWebAuthnSignal(),
            mediation
        })) as PublicKeyCredential;

        const response = credential.response as AuthenticatorAssertionResponse;

        return {
            success: true,
            clientDataJSON: base64url.stringify(new Uint8Array(response.clientDataJSON), {
                pad: false
            }),
            authenticatorData: base64url.stringify(
                new Uint8Array(response.authenticatorData),
                { pad: false }
            ),
            signature: base64url.stringify(new Uint8Array(response.signature), {
                pad: false
            }),
            credentialId: credential.id,
            userHandle: response.userHandle
                ? base64url.stringify(new Uint8Array(response.userHandle), {
                      pad: false
                  })
                : ""
        };
        // oxlint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        if (error.name === "AbortError") return null;
        return {
            success: false,
            error: error.message || "Unknown WebAuthn error"
        };
    }
}

export function getWebAuthnSignal(): AbortSignal {
    if (abortController) {
        // Abort the previous call
        const abortError = new Error("Cancelling pending WebAuthn call");
        abortError.name = "AbortError";
        abortController.abort(abortError);
    }

    abortController = new AbortController();
    return abortController.signal;
}
