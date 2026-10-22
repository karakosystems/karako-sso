# Karako SSO

[![CI](https://github.com/karakosystems/karako-sso/actions/workflows/ci.yml/badge.svg)](https://github.com/karakosystems/karako-sso/actions/workflows/ci.yml)
[![Security](https://github.com/karakosystems/karako-sso/actions/workflows/security.yml/badge.svg)](https://github.com/karakosystems/karako-sso/actions/workflows/security.yml)
[![Release](https://img.shields.io/github/v/release/karakosystems/karako-sso)](https://github.com/karakosystems/karako-sso/releases/latest)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Keycloak 26.8 with the Karako login theme, email theme and server extensions,
shipped as one container image and white-labelled per client through
environment variables or realm attributes.

## Deploy

```bash
cp .env.example .env    # fill in the database, hostname and admin values
docker run --env-file .env ghcr.io/karakosystems/karako-sso:latest
```

Each release is tagged with its version (`1.0.2`), minor (`1.0`), major (`1`)
and `latest`, and signed with cosign. Every build pulls the latest Keycloak 26.8
patch.

## Branding

All variables are optional and read when the container starts: changing one
needs a restart, not a rebuild. The login pages and the emails both follow them.

| Variable                       | Default                | Value                                                   |
| ------------------------------ | ---------------------- | ------------------------------------------------------- |
| `KARAKO_BRAND_NAME`            | `Karako`               | Short name, shown in the UI and page title              |
| `KARAKO_BRAND_LEGAL_NAME`      | `Karako Systems`       | Full company name, shown in the footer                  |
| `KARAKO_BRAND_WELCOME_MESSAGE` | _(translated default)_ | Sentence next to the logo                               |
| `KARAKO_BRAND_LOGO_URL`        | Karako logo            | Absolute `https://` URL, for light backgrounds          |
| `KARAKO_BRAND_LOGO_DARK_URL`   | Karako logo            | Variant for dark backgrounds                            |
| `KARAKO_BRAND_FAVICON_URL`     | _(bundled icons)_      | Absolute `https://` URL                                 |
| `KARAKO_BRAND_PRIMARY`         | `#635bfe`              | Hex colour for buttons, links and decor                 |
| `KARAKO_BRAND_BASE`            | `neutral`              | Neutral scale for backgrounds and cards                 |
| `KARAKO_BRAND_RADIUS`          | `0.625rem`             | Any CSS length, such as `0.25rem` or `16px`             |
| `KARAKO_BRAND_LAYOUT`          | `centered`             | Page layout                                             |
| `KARAKO_BRAND_DECOR`           | `shape`                | Background pattern, or an absolute `https://` image URL |

Accepted values:

- **base**: `neutral`, `zinc`, `stone`, `gray`, `mauve`, `olive`, `mist`, `taupe`
- **layout**: `centered`, `split`, `split-reverse`, `hero`, `minimal`, `stacked`
- **decor**: `none`, `shape`, `mesh`, `glow`

An invalid value falls back to the default instead of breaking the page. Text
colours are derived from `PRIMARY` by contrast, so a light brand colour gets
dark text. `bun storybook` previews every combination.

### One instance, several companies

The same names can be set as **realm attributes**, which override the
environment for that realm only. A realm that sets none keeps the image's
branding. The admin console has no screen for realm attributes, so use the
admin API:

```bash
kcadm.sh update realms/acme \
  -s 'attributes.KARAKO_BRAND_NAME=Acme' \
  -s 'attributes.KARAKO_BRAND_PRIMARY=#0055aa' \
  -s 'attributes.KARAKO_BRAND_LAYOUT=hero'
```

An invalid realm value falls back to the environment variable, then to the
default.

## Cloudflare Turnstile

Turnstile is enabled per realm, in _Authentication_. Three flows can be guarded:

| Flow               | Change                                                                                   |
| ------------------ | ---------------------------------------------------------------------------------------- |
| Registration       | Add the _Cloudflare Turnstile_ step to the registration form                             |
| Login              | Replace _Username Password Form_ with _Username Password Form with Cloudflare Turnstile_ |
| Forgotten password | Replace _Choose User_ with _Choose User with Cloudflare Turnstile_                       |

Each step can hold its own keys, but leaving them empty uses one pair for the
whole container:

```bash
KARAKO_TURNSTILE_SITE_KEY=0x4AAA...
KARAKO_TURNSTILE_SECRET_KEY=0x4AAA...
```

Precedence is step setting, then realm attribute of the same name, then
environment. Keep the **secret** out of realm attributes: the admin API exposes
them, while step settings and the environment stay private.

_Test mode_ switches a step to Cloudflare's always-pass keys. A step saved with
neither keys nor test mode rejects the form rather than silently accepting
everything. The token is checked before the credentials, so a failed challenge
reveals nothing about the account. Guard the forgotten-password flow first:
without it, every submission sends an email.

## LDAP regex mapper

Extracts a value from a larger LDAP string, such as `John Doe` out of
`CN=John Doe,OU=Users,DC=example,DC=com`. On the LDAP user federation provider,
add a mapper of type _regex-attribute-ldap-mapper_ and set the regex and the
capturing group. Examples and caveats: [providers/README.md](./providers/README.md).

## Develop

Requires bun, Java 21 and Maven for the theme JAR and the extensions, and
Docker for the full stack.

```bash
bun install
bun dev                      # login pages against a mocked Keycloak context
bun storybook                # every page and branding combination, port 6006
bun run test                 # Storybook render, interaction and a11y tests
bun emails:preview           # email templates, port 55420
bun build-keycloak-theme     # dist_keycloak/karako-sso-theme.jar
docker compose up --build    # full Keycloak on 127.0.0.1:8888 (admin/admin)
```

Git hooks: `brew install lefthook && lefthook install`.

## Release

Commits follow Conventional Commits: `feat:` bumps the minor, `fix:` the patch,
`!` or a `BREAKING CHANGE:` footer the major. release-please keeps a release
pull request open; merging it tags the version, updates `CHANGELOG.md`,
publishes the signed multi-architecture image to
`ghcr.io/karakosystems/karako-sso` and attaches the theme JAR to the GitHub
release. Pull requests are squash-merged.

Architecture, conventions and pitfalls: [CLAUDE.md](./CLAUDE.md).

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) and the
[code of conduct](.github/CODE_OF_CONDUCT.md). Report vulnerabilities privately,
as described in [SECURITY.md](.github/SECURITY.md).

## License

[MIT](LICENSE). The Karako name and logos used as default branding are not
covered by the license: replace them with your own through the branding
variables.
