# syntax=docker/dockerfile:1

# Stage 1: Theme Build
FROM oven/bun:1 AS theme-builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        openjdk-21-jdk-headless \
        maven \
        nodejs \
        npm \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /build
COPY . .
RUN bun install --frozen-lockfile && bun run build-keycloak-theme

# Build the custom Keycloak providers (protocol mappers, etc.)
# The cache mount keeps the Keycloak dependency tree across rebuilds.
RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f providers/pom.xml clean package -DskipTests

# Stage 2: keycloak Build
FROM quay.io/keycloak/keycloak:26.7.3 AS builder

ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true

COPY --from=theme-builder /build/dist_keycloak/karako-iam-theme.jar /opt/keycloak/providers/
COPY --from=theme-builder /build/providers/target/karako-keycloak-providers.jar /opt/keycloak/providers/

RUN /opt/keycloak/bin/kc.sh build --metrics-enabled=true --health-enabled=true

# Stage 3: Final runtime image
FROM quay.io/keycloak/keycloak:26.7.3

LABEL org.opencontainers.image.title="karako-iam" \
      org.opencontainers.image.description="Keycloak 26.7.3 packaged with the Karako IAM login theme" \
      org.opencontainers.image.source="https://github.com/karakosystems/karako-iam" \
      org.opencontainers.image.url="https://github.com/karakosystems/karako-iam" \
      org.opencontainers.image.documentation="https://github.com/karakosystems/karako-iam#readme" \
      org.opencontainers.image.vendor="Karako Systems" \
      org.opencontainers.image.authors="Louis Midson LAJEANTY <mds@karakosystems.com>" \
      org.opencontainers.image.base.name="quay.io/keycloak/keycloak:26.7.3"

COPY --from=builder /opt/keycloak/ /opt/keycloak/

# Provider selection is runtime config, not a build option: kc.sh build ignores
# it silently and every login page then fails with a null provider.
ENV KC_SPI_LOGIN_PROVIDER=karako
