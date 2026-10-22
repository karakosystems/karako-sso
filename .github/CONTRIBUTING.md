# Contributing

Thanks for helping improve Karako SSO. Bug reports, fixes and documentation
improvements are welcome. For a new feature, open an issue first so we can
agree on the approach before you write code.

## Setup

Requires [bun](https://bun.sh), Java 21 and Maven, and Docker for the full
stack.

```bash
bun install
lefthook install             # git hooks: lint, format and commit message
bun storybook                # every page, layout and decor, port 6006
```

[CLAUDE.md](../CLAUDE.md) describes the architecture, the branding flow and the
toolchain pitfalls. Read it before changing the build.

## Before opening a pull request

```bash
bun lint
bun format:check
bun run build                # the only step that type-checks
bun run test                 # Storybook tests in Playwright Chromium
bun emails:check
mvn -f providers/pom.xml verify
```

- Keep each pull request to one change, with tests or stories when behaviour
  changes.
- A new login page needs a story; a new `KcContext` field needs a mock value.
- Repository content is in English. Translations go in the i18n files only.
- New dependencies must be free and open source.

## Commits and pull requests

Commits follow [Conventional Commits](https://www.conventionalcommits.org):
`type: description` on one line (`feat`, `fix`, `docs`, `build`, `ci`,
`refactor`, `test`, `chore`). Pull requests are squash-merged and the PR title
becomes the commit subject, so it must follow the same format: release-please
builds the changelog and the version number from it.

## Security

Never report a vulnerability in a public issue. See [SECURITY.md](SECURITY.md).

## Licence

By contributing, you agree that your contributions are licensed under the
[MIT License](../LICENSE).
