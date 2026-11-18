#!/usr/bin/env sh
# Phase 2 — plugins d'administration (après validation T1 via seed.sh).
# Usage : sh setup.sh
set -e
cd "$(dirname "$0")"
cli() { docker compose -p togoexpo run --rm wpcli "$@"; }
plugins="advanced-custom-fields polylang seo-by-rank-math fluentform enable-media-replace redirection query-monitor"
for p in $plugins; do
  cli plugin is-installed "$p" >/dev/null 2>&1 || cli plugin install "$p" >/dev/null
  cli plugin activate "$p" >/dev/null || echo "manuel: $p"
  echo "OK: $p"
done
echo "Phase 2 OK. Configurer ensuite : ACF field groups (Show in GraphQL=true), Polylang FR/EN, RankMath, FluentForm."
