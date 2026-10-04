# Changelog

## [1.0.2](https://github.com/karakosystems/karako-sso/compare/v1.0.1...v1.0.2) (2026-10-04)


### Build and image

* bump @storybook/addon-a11y from 10.5.10 to 10.6.1 ([9778b95](https://github.com/karakosystems/karako-sso/commit/9778b9558b32eae875e90d4ee205dd65d58fb0ef))
* bump @storybook/addon-vitest from 10.5.10 to 10.6.1 ([0c54f1e](https://github.com/karakosystems/karako-sso/commit/0c54f1ed777b7f83ce87da4326fb0ace1be304fd))
* bump @types/node from 26.4.1 to 26.6.3 ([7f2ebf2](https://github.com/karakosystems/karako-sso/commit/7f2ebf248a999fe5bb8857c2c5b131f6ec348bb0))
* bump the react group across 1 directory with 4 updates ([064ef06](https://github.com/karakosystems/karako-sso/commit/064ef06b7c05409f63d8a9d399196d55f54d9150))
* bump the vite-plus group across 1 directory with 3 updates ([50f0e14](https://github.com/karakosystems/karako-sso/commit/50f0e1492b4c473160703bbbc4627f91ec94fc32))
* upgrade vite-plus to 1.0.0 and vitest to 5.0.1 ([b3c3c60](https://github.com/karakosystems/karako-sso/commit/b3c3c609ee9174f361267ba57c3ef562eebed393))


### Continuous integration

* update vite-plus together with vitest in Dependabot ([e31b89f](https://github.com/karakosystems/karako-sso/commit/e31b89fe5536d767240dc3c66d438ccdf6216d4a))

## [1.0.1](https://github.com/karakosystems/karako-sso/compare/v1.0.0...v1.0.1) (2026-10-04)


### Bug fixes

* **ci:** point the release notes pull command at a published tag ([4864757](https://github.com/karakosystems/karako-sso/commit/4864757793c99f7630c587dbf3c1d15aa58190e0))
* **deps:** patch vulnerable transitive npm dependencies ([39c5fea](https://github.com/karakosystems/karako-sso/commit/39c5feaac0193764d3827b931ed66018fe9a4569))
* rename the local dev image the repository rename missed ([0f04c0e](https://github.com/karakosystems/karako-sso/commit/0f04c0e7135a23b19ad92fca973214458b59a8c8))
* silence the Semgrep false positive on sanitized terms HTML ([e091abb](https://github.com/karakosystems/karako-sso/commit/e091abb61e0fd6565f19925fdda9d1563477cd3f))


### Build and image

* track the latest Keycloak 26.8 patch on every build ([a416de9](https://github.com/karakosystems/karako-sso/commit/a416de98225e84636ea6ba4bda0bda3eee4da8b5))
* upgrade TypeScript to 7.0.2 ([d297c81](https://github.com/karakosystems/karako-sso/commit/d297c8176303a2e51cb151baa2e6c0985bc96df0))


### Continuous integration

* bump lucide-react from 1.39.0 to 1.49.0 ([4ccf6a8](https://github.com/karakosystems/karako-sso/commit/4ccf6a812cff4aaf539e514a8df605d23932b186))
* bump playwright from 1.62.1 to 1.63.0 ([e7acabe](https://github.com/karakosystems/karako-sso/commit/e7acabefc2e7eebbeaf88f67c4bae4d919f07a66))
* bump storybook from 10.5.10 to 10.6.1 ([d7fa122](https://github.com/karakosystems/karako-sso/commit/d7fa12248ca88843f305ee547e74f5323871b365))
* bump the actions-minor-patch group across 1 directory with 5 updates ([1d376e7](https://github.com/karakosystems/karako-sso/commit/1d376e7fb365d23359e08eb961734a563303d089))
* group react and vitest packages in Dependabot updates ([9571588](https://github.com/karakosystems/karako-sso/commit/95715885cb3875c783ea19a629c0c750ed87393e))
* let Dependabot propose TypeScript major updates ([178c36a](https://github.com/karakosystems/karako-sso/commit/178c36a8321056f570bf8edfcc3fb5a7ab352d32))
* prefix Dependabot dependency updates with build ([c780a6d](https://github.com/karakosystems/karako-sso/commit/c780a6df72d4f1035dec753fb10c2aebe40d4da9))
* replace CodeQL and Trivy with Semgrep, OSV-Scanner, Gitleaks and zizmor ([fb93f5a](https://github.com/karakosystems/karako-sso/commit/fb93f5a8c06a01f15b9e240db29bb90c9f6bc3dc))
* scope OSV-Scanner to dependencies the image actually ships ([d6f40c4](https://github.com/karakosystems/karako-sso/commit/d6f40c447f95ae575c266b23d13cf6b74a123299))
* stop persisting checkout credentials ([ed4d16b](https://github.com/karakosystems/karako-sso/commit/ed4d16b0dd0db2acfef7e8f6b585dfecb8be5fd9))
* switch Dependabot to the bun ecosystem ([d6d85cb](https://github.com/karakosystems/karako-sso/commit/d6d85cb3f943d516517d222579dd5d99ff12326a))


### Documentation

* replace em dashes with plain punctuation ([aef57fe](https://github.com/karakosystems/karako-sso/commit/aef57fee7be02cb86093b68a79b6187266cdc74a))

## 1.0.0 (2026-09-06)


### Features

* **branding:** add a configurable base colour with the eight shadcn neutral scales ([9c3b420](https://github.com/karakosystems/karako-sso/commit/9c3b4200bc47cf973a5120d23b544f7c4c40d0ec))
* **branding:** let realm attributes override the image branding for multi-tenant instances ([1d92922](https://github.com/karakosystems/karako-sso/commit/1d92922a539d5cb6979e6f73ef850e765338a84c))
* **email:** follow the KARAKO_BRAND_* variables instead of hardcoded Karako values ([2b3c1e4](https://github.com/karakosystems/karako-sso/commit/2b3c1e45fc144e4d73a0ee3b2a65ea9804cfe338))
* **i18n:** add turnstile error messages resolved from the theme bundles ([dd2f697](https://github.com/karakosystems/karako-sso/commit/dd2f697a1e75797a1b10f30de32b847ce6b7e9f2))
* **providers:** add a Cloudflare Turnstile form action for registration ([24738a8](https://github.com/karakosystems/karako-sso/commit/24738a88672a35bfca96ae85b4c1fcc0bac3ea96))
* **providers:** add a test-keys toggle and prefill the Turnstile keys ([5c395a0](https://github.com/karakosystems/karako-sso/commit/5c395a03e53920afb4ec4679492d66d81b0cf9a3))
* **register:** render the Turnstile widget and follow the page theme ([a3f6919](https://github.com/karakosystems/karako-sso/commit/a3f69194efee0b53e53673b8c73f0bfe430bdefd))
* **turnstile:** guard the login and forgotten-password flows, not just registration ([48ae850](https://github.com/karakosystems/karako-sso/commit/48ae8505265a6c992b9df7a6657989af5d862f67))
* **turnstile:** share one pair of keys across the three flows instead of repeating them ([25dc6c6](https://github.com/karakosystems/karako-sso/commit/25dc6c64d3c2577db5b12daf07cd197a6e46e61f))


### Bug fixes

* **a11y:** correct heading levels, name the organization select and make the terms box focusable ([7d7a5e0](https://github.com/karakosystems/karako-sso/commit/7d7a5e0f633b9b026bd821a8abb227870ddd8e1f))
* **a11y:** darken secondary text on all eight scales to clear 4.5:1 on input backgrounds ([2ddc53b](https://github.com/karakosystems/karako-sso/commit/2ddc53b2ba0ddb0264b18880b580748bc57da4a8))
* **a11y:** darken the light-mode destructive colour to clear the 4.5:1 threshold ([eb3c084](https://github.com/karakosystems/karako-sso/commit/eb3c0848cc53c980556c8fb69dd125e20f5854c9))
* **a11y:** drop positive tabindex values and make field error ids unique ([ff1453a](https://github.com/karakosystems/karako-sso/commit/ff1453aff474385e638546523eb6290f75d01149))
* **a11y:** drop the forced white label that left destructive buttons at 1.2:1 ([af78ce7](https://github.com/karakosystems/karako-sso/commit/af78ce70ae09f04c8a8208089b52ef1369ed007d))
* **a11y:** give the theme toggle an accessible name ([d3139d1](https://github.com/karakosystems/karako-sso/commit/d3139d1487c1e7309d5c1460aed0b7892f142fd0))
* **a11y:** unwrap links from buttons and labels so no interactive element nests another ([c1595a5](https://github.com/karakosystems/karako-sso/commit/c1595a577d299c742138bf69477a361cb7efbe6d))
* **branding:** restore css variables on unmount so stories stop leaking into each other ([87f77fe](https://github.com/karakosystems/karako-sso/commit/87f77fe3da5ac2d765baa899159a4047295bee29))
* **build:** drop the duplicate vitest config and the __dirname shim flagged by Vite ([c2920b0](https://github.com/karakosystems/karako-sso/commit/c2920b0f586e7112a187edfdb40046eca06a5284))
* **ci:** cap vitest workers so chromium survives the runner ([bc9847c](https://github.com/karakosystems/karako-sso/commit/bc9847cfcfc0c8810d79d1ba675c206bbce55ae6))
* **ci:** launch chromium with no-sandbox and disable-dev-shm-usage for the runner ([8eb80bb](https://github.com/karakosystems/karako-sso/commit/8eb80bbb4e846998ad380190375a7b61dff278d7))
* **deps:** pin brace-expansion to 5.0.9, which ESLint used to pull in ([299f7cc](https://github.com/karakosystems/karako-sso/commit/299f7cc48edfccd6a7a5dd5e348b95a2f7dd4b57))
* **email:** set width auto so the action button stops overflowing its container ([a2dc610](https://github.com/karakosystems/karako-sso/commit/a2dc610fa4828bf2b77f475f880c7592468eccc2))
* **email:** size buttons to their label instead of a fixed 240px width ([4b2d8de](https://github.com/karakosystems/karako-sso/commit/4b2d8deff0b6442021f06d4c9eeaf68967847f00))
* **i18n:** hold the page back until the language dictionary lands instead of flashing empty labels ([f77e3cf](https://github.com/karakosystems/karako-sso/commit/f77e3cfb972f5760759ee99b2db1d85fd21c90ce))
* **ldap:** keep every value of a multi-valued attribute and add unit tests ([b96c46f](https://github.com/karakosystems/karako-sso/commit/b96c46fef68d3bcf35ba974a37055736fb159592))
* **types:** make the build actually type-check, and fix the two errors it was hiding ([721ac3f](https://github.com/karakosystems/karako-sso/commit/721ac3fa571534df61a7b02047adcbf713c179e1))


### Build and image

* adopt the Vite+ toolchain for dev, build and test ([250365b](https://github.com/karakosystems/karako-sso/commit/250365b04da7acc6f95abfc47c9de0496fc09dda))
* replace ESLint and Prettier with Oxlint and Oxfmt ([ee1e934](https://github.com/karakosystems/karako-sso/commit/ee1e9344d9b2c0209bb6581b04d95e8771f61883))


### Continuous integration

* align release and security workflows with karako-dc ([7d658f8](https://github.com/karakosystems/karako-sso/commit/7d658f89f6985bcdbeabe94767f7bddf24009ba8))
* build and test the Java module, add a compose healthcheck ([1d7f6c7](https://github.com/karakosystems/karako-sso/commit/1d7f6c7c4b21ad2259a15f18ddcd39279db9931e))
* bump actions/checkout from 6.0.3 to 7.0.1 ([a32f511](https://github.com/karakosystems/karako-sso/commit/a32f511728251ec2d22165cfbd730db6880e5306))
* bump actions/setup-java from 5.2.0 to 6.0.0 ([8e50b81](https://github.com/karakosystems/karako-sso/commit/8e50b8121191e6b26e88be45cab04542798af6e6))
* bump the actions-minor-patch group with 7 updates ([a982074](https://github.com/karakosystems/karako-sso/commit/a9820741846c86220950085730c6384966a9caad))
* run the story test suite on pull requests ([1d4f2a9](https://github.com/karakosystems/karako-sso/commit/1d4f2a94035be7c67d349dab61110bf8bb705571))


### Tests

* **a11y:** fail the suite on violations now that the pre-existing ones are fixed ([d04a01e](https://github.com/karakosystems/karako-sso/commit/d04a01e01e363e69bf394c03a13702e630a43389))
* **a11y:** report violations without failing until the 27 pre-existing ones are fixed ([b6660c0](https://github.com/karakosystems/karako-sso/commit/b6660c06036c42d3025073db4f958de1a7163173))
* clear Keycloakify's one-shot effect registry between stories so it stops reloading the iframe ([34ba9e1](https://github.com/karakosystems/karako-sso/commit/34ba9e1972d85cc8ba1b099612f9daabb7ed58b2))
* declare the theme dependencies so Vite prebundles them all up front ([83d362d](https://github.com/karakosystems/karako-sso/commit/83d362d6fdde5f14883d8bb7bf6ca017577e4932))
* pin the browser viewport so a11y results do not depend on the host ([dcf5097](https://github.com/karakosystems/karako-sso/commit/dcf5097407c19fb5ee82966df6ce364fe3b4e2a6))
* prescan stories so Vite stops reloading the iframe mid-run ([de230bb](https://github.com/karakosystems/karako-sso/commit/de230bbbe5a46dd462f495498e0302587a1623e7))
* retry browser tests twice to absorb iframe reload flakes ([2c35900](https://github.com/karakosystems/karako-sso/commit/2c35900e27aaa08dd27867e32043eedc65e41dc4))
* run every story in chromium with a11y and interaction checks ([b1b3e74](https://github.com/karakosystems/karako-sso/commit/b1b3e740e303e62cb13511c8651b250a45051b2b))
* skip the reCAPTCHA stories that reload the story iframe ([98fe7d9](https://github.com/karakosystems/karako-sso/commit/98fe7d948c47f5c11e2ba2036644c2c0c08f1f2a))
* skip WebAuthn stories that hang or kill a headless page ([b963f2e](https://github.com/karakosystems/karako-sso/commit/b963f2e49fb9a1f8eb362732abec686230e4007b))


### Refactoring

* **email:** drop the card radius and keep the logo in the footer ([71bbd43](https://github.com/karakosystems/karako-sso/commit/71bbd4395dd52d997f310471faec8bfc64e59b6d))
* **email:** lead with the logo and frame the message in a card ([1e9e0ff](https://github.com/karakosystems/karako-sso/commit/1e9e0ff97b1c346f55715443d72921ba364c4ac8))


### Documentation

* document the branding variables and the two server extensions in the README ([474f808](https://github.com/karakosystems/karako-sso/commit/474f808d28e55f4de0e441d19efb70f34476e2b7))
* document the white-label configuration in Storybook ([16ea6ac](https://github.com/karakosystems/karako-sso/commit/16ea6acb96c853053b4cb002a43d1ce6b52f151c))
* **storybook:** enable GFM so markdown tables render in MDX ([f79c975](https://github.com/karakosystems/karako-sso/commit/f79c975e7458ed89e5cf8ceba9d17f1324f59966))
