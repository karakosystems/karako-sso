# syntax=docker/dockerfile:1

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

RUN --mount=type=cache,target=/root/.m2/repository \
    mvn -f providers/pom.xml clean package -DskipTests

FROM quay.io/keycloak/keycloak:26.8.0 AS builder

ENV KC_DB=postgres
ENV KC_HEALTH_ENABLED=true

COPY --from=theme-builder /build/dist_keycloak/karako-sso-theme.jar /opt/keycloak/providers/
COPY --from=theme-builder /build/providers/target/karako-keycloak-providers.jar /opt/keycloak/providers/

RUN /opt/keycloak/bin/kc.sh build --metrics-enabled=true --health-enabled=true

FROM quay.io/keycloak/keycloak:26.8.0

LABEL org.opencontainers.image.title="karako-sso" \
      org.opencontainers.image.description="Keycloak 26.7.3 packaged with the Karako IAM login theme" \
      org.opencontainers.image.source="https://github.com/karakosystems/karako-sso" \
      org.opencontainers.image.url="https://github.com/karakosystems/karako-sso" \
      org.opencontainers.image.documentation="https://github.com/karakosystems/karako-sso#readme" \
      org.opencontainers.image.vendor="Karako Systems" \
      org.opencontainers.image.authors="Louis Midson LAJEANTY <mds@karakosystems.com>" \
      org.opencontainers.image.base.name="quay.io/keycloak/keycloak:26.7.3"

COPY --from=builder /opt/keycloak/ /opt/keycloak/

ENV KC_SPI_LOGIN_PROVIDER=karako
