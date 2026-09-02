# Karako IAM

Keycloak 26.7.3 packaged with the Karako login theme, email theme and server
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

### One instance, several companies

The same variables can be set as **realm attributes**, which take precedence over
the environment for that realm only. A realm that sets none keeps the image's
branding, so one deployment can serve a company per realm.

```bash
# there is no admin console screen for realm attributes; use the admin API
kcadm.sh update realms/acme \
  -s 'attributes.KARAKO_BRAND_NAME=Acme' \
  -s 'attributes.KARAKO_BRAND_PRIMARY=#0055aa' \
  -s 'attributes.KARAKO_BRAND_LAYOUT=hero'
```

Same names, same accepted values, same fallback on an invalid one — it drops to
the environment variable, then to the default.

## Cloudflare Turnstile

Not an environment variable: it is configured per realm, in _Authentication_.
Three flows can be guarded, each with its own keys and its own on/off switch.

| Flow               | What to do                                                                               |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Registration       | Add the step _Cloudflare Turnstile_ to the registration form                             |
| Login              | Replace _Username Password Form_ with _Username Password Form with Cloudflare Turnstile_ |
| Forgotten password | Replace _Choose User_ with _Choose User with Cloudflare Turnstile_                       |

### One pair of keys for all three

Keycloak attaches configuration to each step, so filling the keys three times is
the default. Leave them empty instead and set them once for the whole container:

```bash
KARAKO_TURNSTILE_SITE_KEY=0x4AAA...
KARAKO_TURNSTILE_SECRET_KEY=0x4AAA...
```

A realm attribute of the same name overrides the environment for that realm, and
a step's own setting overrides both — useful when one tenant has its own
Cloudflare account. Put the **secret** in the environment rather than in a realm
attribute: realm attributes are readable through the admin API, the step setting
and the environment are not.

_Test mode_ swaps in Cloudflare's always-pass pair. Nothing is prefilled with it,
so a step saved without keys and without test mode refuses the form rather than
looking protected while accepting anything.

The token is verified server-side before the credentials are checked, so a
failed challenge reveals nothing about the account. Guarding the forgotten
password flow matters most: without it the form accepts unlimited submissions
and each one sends an email.

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
