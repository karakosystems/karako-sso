# Karako Keycloak Providers

Keycloak server extensions for Karako SSO, packaged as
`karako-keycloak-providers.jar` and dropped into Keycloak's `providers/`
directory by the image build:

- **Realm branding**: a login-forms provider that passes a realm's
  `KARAKO_BRAND_*` attributes to the theme.
- **Cloudflare Turnstile**: a registration form action and login and
  forgotten-password authenticators. Setup is in the root README.
- **Regex Attribute Extractor (LDAP)**: an LDAP federation mapper that extracts
  a value from an LDAP attribute with a configurable regex at import and sync
  time (the default pattern pulls the first CN out of a DN) and stores it as a
  Keycloak user attribute, which any standard mapper can then expose in tokens.
  The rest of this file documents it.

---

## Regex examples

| Goal                        | Regex                 | Group |
| --------------------------- | --------------------- | ----- |
| Extract the CN (default)    | `^CN=([^,]+)`         | `1`   |
| Extract the first OU        | `CN=[^,]+,OU=([^,]+)` | `1`   |
| Extract the domain (DC)     | `DC=([^,]+),DC=`      | `1`   |
| Extract the domain in a UPN | `([^@]+)@(.+)`        | `2`   |

---

## Regex Attribute Extractor (LDAP federation mapper)

Runs during LDAP import/sync. Reads an LDAP attribute holding a DN, applies the
regex, and writes the captured value into a Keycloak user attribute of your
choice.

It **extends the native `user-attribute-ldap-mapper`** (the same way Keycloak's
own `certificate-ldap-mapper` does), so it inherits all of its fields and
behavior and adds the regex on top. The **User model attribute** field is a
dropdown of the realm's User Profile attributes.

> Designed for LDAP providers in **import mode** (the default). The attribute is
> materialized on import; in no-import mode it is not synthesized on the fly.

### Configuration in the Keycloak Admin console

1. **Realm settings** → **User federation** → your **LDAP** provider → **Mappers** → **Add mapper**
2. Select mapper type **"regex-attribute-ldap-mapper"** (Regex Attribute Extractor)
3. Fill in the fields:

| Field                       | Example        | Notes                               |
| --------------------------- | -------------- | ----------------------------------- |
| LDAP attribute              | `manager`      | source DN attribute                 |
| User model attribute        | `manager_name` | dropdown of User Profile attributes |
| Extraction regex            | `^CN=([^,]+)`  | added by this mapper                |
| Capturing group (index)     | `1`            | added by this mapper                |
| Read Only                   | `On`           | inherited                           |
| Always Read Value From LDAP | `Off`          | **keep Off**, see caveat below      |
| Is Mandatory In LDAP        | `Off`          | inherited                           |
| Attribute default value     | _(optional)_   | inherited                           |
| Is Binary Attribute         | `Off`          | inherited                           |

4. Use **Sync LDAP users to Keycloak** (or trigger a sync) to populate the
   attribute on existing users; new logins pick it up automatically.

The same regex examples as above apply.

> **Caveats (by design):**
>
> - The extracted value is **never written back to LDAP**: `onRegisterUserToLDAP`
>   is a no-op, so even with _Read Only_ off it cannot overwrite the source DN.
> - Keep **Always Read Value From LDAP** off: when on, the value is re-read raw
>   from LDAP on access, bypassing the regex.

---

## Build

### Prerequisites

- Java 21+
- Maven 3.9+

### Compile

```bash
mvn -f providers/pom.xml clean package -DskipTests
# → providers/target/karako-keycloak-providers.jar
```

The Docker image builds this automatically (see the repository `Dockerfile`)
and copies the JAR into `/opt/keycloak/providers/`.

---

## Manual deployment in Keycloak (Kubernetes)

```bash
# Copy the JAR into the Keycloak pod
kubectl cp providers/target/karako-keycloak-providers.jar \
  <namespace>/<keycloak-pod>:/opt/keycloak/providers/

# Restart Keycloak to load the provider
kubectl rollout restart deployment/keycloak -n <namespace>
```

Or via an `initContainer` / ConfigMap mounted into `/opt/keycloak/providers/`.

---

## Project structure

```
providers/
├── pom.xml
└── src/main/
    ├── java/io/karako/keycloak/ldap/
    │   ├── RegexLdapStorageMapper.java            # LDAP federation mapper
    │   └── RegexLdapStorageMapperFactory.java
    └── resources/META-INF/services/
        └── org.keycloak.storage.ldap.mappers.LDAPStorageMapperFactory
```
