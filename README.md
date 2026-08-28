# Karako IAM

Keycloak 26.7.2 packaged with the Karako login theme, email theme and server
extensions. One image, white-labelled per client through environment variables.

## Deploy

```bash
docker run --env-file .env ghcr.io/karakosystems/karako-iam:latest
```

`.env.exemple` lists the Keycloak variables (database, hostname, proxy, admin
bootstrap). The branding variables below go in the same file.

## Branding

Every variable is optional and read when the container starts, so changing one
means a restart, not a rebuild. Both the login pages and the emails follow them.

| Variable                       | Default                | Value                                                   |
| ------------------------------ | ---------------------- | ------------------------------------------------------- |
| `KARAKO_BRAND_NAME`            | `Karako`               | Short name, shown in the UI and page title              |
| `KARAKO_BRAND_LEGAL_NAME`      | `Karako Systems`       | Full company name, shown in the footer                  |
| `KARAKO_BRAND_WELCOME_MESSAGE` | _(translated default)_ | Sentence next to the logo                               |
| `KARAKO_BRAND_LOGO_URL`        | Karako logo            | Absolute `https://` URL, light backgrounds              |
| `KARAKO_BRAND_LOGO_DARK_URL`   | Karako logo            | Variant for dark backgrounds                            |
| `KARAKO_BRAND_FAVICON_URL`     | _(bundled icons)_      | Absolute `https://` URL                                 |
| `KARAKO_BRAND_PRIMARY`         | `#635bfe`              | Hex colour for buttons, links and decor                 |
| `KARAKO_BRAND_BASE`            | `neutral`              | Neutral scale for backgrounds and cards                 |
| `KARAKO_BRAND_RADIUS`          | `0.625rem`             | Any CSS length, e.g. `0.25rem` or `16px`                |
| `KARAKO_BRAND_LAYOUT`          | `centered`             | Page layout                                             |
| `KARAKO_BRAND_DECOR`           | `shape`                | Background pattern, or an absolute `https://` image URL |

An invalid value falls back to the default rather than breaking the page.

- **base**: `neutral`, `zinc`, `stone`, `gray`, `mauve`, `olive`, `mist`, `taupe`
- **layout**: `centered`, `split`, `split-reverse`, `hero`, `minimal`, `stacked`
- **decor**: `none`, `shape`, `waves`, `aurora`, `mesh`, `grid`, `dots`, `rings`,
  `diagonals`, `arcs`, `blobs`, `topography`, `hexagons`, `beams`, `gradient`,
  `glow`, `columns`, `scatter`

Text colours are derived from `PRIMARY` by contrast, so a light brand colour
gets dark text automatically. `bun storybook` previews every combination.

## Cloudflare Turnstile

Not an environment variable: it is a registration form action, configured per
realm. In _Authentication_, open the registration flow, add the step
_Cloudflare Turnstile_ and fill its settings with the site and secret keys from
the Cloudflare dashboard. Leave _Test mode_ on to use Cloudflare's always-pass
test keys, which are prefilled.

## LDAP regex mapper

For directories that store a value inside a larger string — pulling `John Doe`
out of `CN=John Doe,OU=Users,DC=example,DC=com`. On the LDAP user federation
provider, add a mapper of type _regex-attribute-ldap-mapper_ and set the
extraction regex and the capturing group index. The default pattern extracts
the first CN of a DN.

## Develop

```bash
bun install
bun dev            # login pages against a mocked Keycloak context
bun storybook      # all 38 pages, port 6006
bun run test       # render, interaction and accessibility checks
bun sync:brand     # refresh brand assets from the CDN
```

## Build

```bash
bun build-keycloak-theme     # dist_keycloak/karako-iam-theme.jar
docker compose up --build    # full Keycloak on 127.0.0.1:8888 (admin/admin)
```

## Release

Push a `v*.*.*` tag. The image is published to `ghcr.io/karakosystems/karako-iam`.

---

Architecture, conventions and gotchas: [CLAUDE.md](./CLAUDE.md).
