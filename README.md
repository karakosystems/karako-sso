# Karako IAM

Keycloak 26.7.2 packaged with the Karako login theme, email theme and server
extensions.

## Develop

```bash
bun install
bun dev            # login pages against a mocked Keycloak context
bun storybook      # all 38 pages, port 6006
bun sync:brand     # refresh brand assets from the CDN
```

## Build

```bash
bun build-keycloak-theme     # dist_keycloak/karako-iam-theme.jar
docker compose up --build    # full Keycloak on 127.0.0.1:8888 (admin/admin)
```

## Release

Push a `v*.*.*` tag. The image is published to `ghcr.io/karakosystems/karako-iam`.
Runtime environment variables: see `.env.exemple`.

---

Architecture, conventions and gotchas: [CLAUDE.md](./CLAUDE.md).
