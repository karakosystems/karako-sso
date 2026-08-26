# Karako IAM

Keycloak 26.7.2 packaged with the Karako IAM login theme (Keycloakify v11 + React 19 +
Tailwind v4 + shadcn/ui) and the Karako Keycloak server extensions.

## Quick start

```bash
bun install              # install deps (postinstall syncs Keycloakify extensions)
bun dev                  # Vite dev server with a mocked kcContext
bun storybook            # Storybook on :6006
bun build-keycloak-theme # produces dist_keycloak/karako-iam-theme.jar
```

## Brand assets

```bash
bun sync:brand   # pull the favicon set from the Karako CDN, check logo URLs
```

Run it after uploading new assets to `cdn.karakosystems.com`. See CLAUDE.md for
why favicons are copied locally rather than linked.

## End-to-end with Keycloak

```bash
docker compose up --build   # builds the image and runs Keycloak on 127.0.0.1:8888
```

Admin: `admin` / `admin` (local dev only).

The image build is multi-stage: it builds the login theme JAR, builds the Java
provider JAR (`providers/`), drops both into `/opt/keycloak/providers/` and runs
`kc.sh build`.

## Server extensions

`providers/` is a Maven module holding the custom Keycloak SPI implementations
(currently the DN LDAP attribute mapper). See [providers/README.md](./providers/README.md).

```bash
mvn -f providers/pom.xml package   # produces providers/target/karako-keycloak-providers.jar
```

## Production

The container image is published to `ghcr.io/karakosystems/karako-iam` by
`.github/workflows/release.yml`, which triggers on `v*.*.*` tags. It builds for
linux/amd64 and linux/arm64, attaches an SBOM and provenance, signs the image
with cosign and creates the GitHub release with the theme JAR attached.

See `.env.exemple` for the environment variables Keycloak expects at runtime.

## Developer guide

See [CLAUDE.md](./CLAUDE.md) for architecture, page routing, styling, i18n and
email-theme details.
