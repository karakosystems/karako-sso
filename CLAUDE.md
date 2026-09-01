# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`karako-iam` - a Keycloak distribution: a Keycloakify v11 login theme (React 19,
TypeScript, Tailwind v4, shadcn/ui) plus a Maven module of Keycloak server
extensions, baked together into a single container image. The theme build
artifact is `karako-iam-theme.jar`; the extensions build to
`karako-keycloak-providers.jar`. Both are dropped into Keycloak's `providers/`
directory by the Dockerfile.

The theme is derived from the `keycloakify-shadcn-starter` layout but is not
published as an npm package - it is only ever consumed as a JAR.

## Commands

`packageManager` is `bun` and `bun.lock` is committed. CI uses bun as well.

- `bun dev` - Vite dev server. Renders `KcPage` against a mocked `kcContext` (see "Dev mode" below). Change which page renders by editing `pageId` in `src/main-kc.dev.tsx`.
- `bun storybook` - Storybook on port 6006. Stories live next to pages (e.g. `src/login/pages/login/Page.stories.tsx`) and use `createKcPageStory` from `src/login/mocks/KcPageStory.tsx`.
- `bun build` - `tsc && vite build`. Type errors fail the build.
- `bun build-keycloak-theme` - full `bun build` then `keycloakify build`; outputs `karako-iam-theme.jar` under `dist_keycloak/`. Requires Maven on PATH.
- `bun start` - build then boot a throwaway Keycloak 26 with the theme loaded.
- `bun lint` / `bun lint:fix` - ESLint (flat config in `eslint.config.js`).
- `bun format` / `bun format:check` - Prettier (with `prettier-plugin-tailwindcss`).
- `bun emails:preview` / `bun emails:check` - preview/lint jsx-email templates in `src/email/templates/`.
- `mvn -f providers/pom.xml package` - build the server-extension JAR.
- `bun sync:brand` - re-download the favicon set from the Karako CDN into `public/` and verify that every CDN URL hardcoded in `src/` still exists. Run it after uploading new brand assets.

`postinstall` runs `keycloakify sync-extensions`, which regenerates
`src/kc.gen.tsx` from installed Keycloakify extensions. Treat `src/kc.gen.tsx` as
generated - don't hand-edit it.

## Local Keycloak for end-to-end testing

`compose.yml` builds the local Dockerfile and boots Keycloak 26.7.3 on
`127.0.0.1:8888` (admin/admin) via `docker compose up --build`. The build runs the
theme build _and_ the Maven build inside the image, so every change forces a full
multi-stage rebuild - for fast iteration use `bun dev` or Storybook; reserve
compose for full end-to-end Keycloak validation.

## Architecture

### Entry points

`src/main.tsx` branches on `window.kcContext`:

- Set (real Keycloak runtime) -> `src/main-kc.tsx`, which renders `KcPage` from `src/kc.gen.tsx`.
- Unset (Vite dev) -> `src/main-kc.dev.tsx`, which builds a mock context via `getKcContextMock` and renders the same `KcPage`.

Dev and prod render the exact same component tree - only the source of
`kcContext` differs.

### Page routing

`src/login/KcPage.tsx` wraps the tree in `KcContextProvider` -> `I18nProvider` ->
`StyleLevelCustomization` -> `<PageIndex />`. `src/login/pages/PageIndex.tsx` is a
`switch (kcContext.pageId)` over all 38 Keycloak `.ftl` page IDs, each lazy-imported
from `src/login/pages/<page-name>/`. **To add or modify a page, edit the matching
folder under `src/login/pages/` and (if new) add it to the switch.** Each page
folder contains `Page.tsx`, supporting components, and `Page.stories.tsx`.

### Template layer

Shared chrome (logo, language switcher, theme toggle, footer, error display) lives
in `src/login/components/Template/`. `Template.tsx` is a thin dispatcher: it reads
`useTemplateVariant()` and renders either `TemplateCentered` or `TemplateSplit`.
Both variants accept the same props, so pages never care which one is active.
The variant currently defaults to `centered` in `TemplateVariantContext.tsx`.

### Brand assets

Logos are referenced by absolute CDN URL (`cdn.karakosystems.com/karako/logos/...`)
from the two Template variants and from `src/email/constants.ts`. Favicons are the
exception: they are **copied** into `public/` rather than linked, because Keycloak
serves theme resources with `Cache-Control: no-cache` (a change ships on the next
build) while the CDN serves `immutable, max-age=31536000` (a replaced asset stays
stale for up to a year for returning visitors). `bun sync:brand` refreshes those
copies and fails if a CDN URL referenced from `src/` has gone missing.

Note that favicon `<link>` hrefs in `index.html` must start with `/` - Keycloakify
only rewrites root-absolute paths to `resourcesPath`, and relative ones 404 in
production.

### Styling layer

`useStyleLevelCustomization` (`src/login/styleLevelCustomization.tsx`) returns
`doUseDefaultCss: false` - Keycloak's default CSS is **not** loaded; everything is
styled from scratch with Tailwind + shadcn. It also injects a `ThemeProvider`
(`src/components/theme-provider.tsx`) whose initial value comes from
`kcContext.darkMode` via `shared/getColorScheme.ts`. The shadcn CSS variables live
in `src/login/index.css`.

shadcn config (`components.json`): style `radix-vega`, base color `neutral`, alias
`@/components` -> `src/components`, icon library `lucide`. New shadcn components go
under `src/components/ui/`.

### KcContext extension

`src/login/KcContext.ts` extends Keycloakify's base context with `themeName`,
`properties`, `client.baseUrl` and `darkMode`. If a Keycloak value you need isn't
on `kcContext`, extend `KcContextExtension` here. Mocks in
`src/login/mocks/getKcContextMock.ts` must be updated to match.

`properties` is typed `Record<KcEnvName, string>`; `KcEnvName` is generated from
the `environmentVariables` declared in `vite.config.ts`. That is the mechanism for
passing runtime configuration from the container's environment into the theme.

### i18n

Two separate i18n systems:

- **Login pages**: `src/login/i18n.ts` uses `@keycloakify/login-ui`'s `i18nBuilder.withCustomTranslations(...)`, with `en` and `fr` overrides on top of Keycloakify's built-in dictionaries.
- **Emails**: `src/email/i18n.ts` uses `i18next` + `react-i18next` with per-locale JSON files under `src/email/locales/` (`en`, `es`, `fr`). The `getMessages` export maps Keycloak's `requiredAction.*` and time-unit keys; extend it when adding new email-side keys.

The locale list passed to `buildEmailTheme` in `vite.config.ts` must include every
locale you ship - locales not listed there won't be bundled even if their JSON
exists.

### Email theme build

`vite.config.ts` calls `buildEmailTheme` from `keycloakify-emails` in the
Keycloakify `postBuild` hook. Templates: `src/email/templates/*.tsx` (jsx-email);
shared layout `src/email/layout.tsx`; shared style constants
`src/email/constants.ts`. After `bun build-keycloak-theme`, both the login theme
and the email theme end up in the same JAR.

### Server extensions (`providers/`)

Maven module, group `io.karako.keycloak`, artifact `karako-keycloak-providers`,
targeting Keycloak 26.7.3 with all Keycloak deps `provided`. Currently ships
`RegexLdapStorageMapper`, which extends the native `UserAttributeLDAPStorageMapper`
and overlays a regex extraction on the imported value (e.g. pulling `John Doe` out
of `CN=John Doe,OU=Users,DC=example,DC=com`). SPI registration is via
`META-INF/services/org.keycloak.storage.ldap.mappers.LDAPStorageMapperFactory`.

## CI / release flow

- `.github/workflows/ci.yml` (push/PR on `main`): actionlint, then lint + format check + `emails:check`, then a theme build, then a Trivy filesystem scan that fails on CRITICAL/HIGH.
- `.github/workflows/release.yml` (on `v*.*.*` tags): multi-arch image build pushed to `ghcr.io/karakosystems/karako-iam` with SBOM and provenance, cosign signing, a Trivy image scan, and a GitHub release with the theme JAR attached.

Releases are cut by pushing a `v*.*.*` tag - there is no release-on-version-bump.

## Conventions worth knowing

- Path alias `@/*` -> `src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- `eslint.config.js` disables `react-hooks/exhaustive-deps` and `@typescript-eslint/no-redeclare` globally - don't expect the linter to flag those.
- Keycloakify `themeName` and `keycloakVersionTargets` are pinned in `vite.config.ts`; the `22-to-25` target is disabled (only "all-other-versions" emits a JAR).
- When adding a new Keycloak page, you must (1) create `src/login/pages/<name>/Page.tsx`, (2) add a `case "<name>.ftl":` to `PageIndex.tsx`, and (3) ensure `getKcContextMock` can produce a mock for it so the dev server and Storybook still work.
