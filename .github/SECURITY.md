# Security policy

## Supported versions

Only the latest release receives security fixes. Every image build pulls the
latest Keycloak 26.8 patch, so upgrading to the latest image also picks up
upstream Keycloak fixes.

## Reporting a vulnerability

Do not open a public issue. Report it privately through
[GitHub private vulnerability reporting](https://github.com/karakosystems/karako-sso/security/advisories/new),
or by email to [info@karakosystems.com](mailto:info@karakosystems.com).

Include the affected version or image digest, the steps to reproduce and the
impact you observed. We acknowledge reports within 3 business days and keep you
informed until a fix is released. Once fixed, the advisory is published and you
are credited unless you prefer otherwise.

Vulnerabilities in Keycloak itself belong upstream: see the
[Keycloak security policy](https://github.com/keycloak/keycloak/security/policy).

## Verifying the image

Release images are signed with cosign (keyless) and ship an SBOM and build
provenance:

```bash
cosign verify ghcr.io/karakosystems/karako-sso:latest \
  --certificate-identity-regexp '^https://github.com/karakosystems/karako-sso/' \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com
```
