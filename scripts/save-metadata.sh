#!/usr/bin/env sh

version=$(jq -r '.version' package.json)
sha=$(git rev-parse --verify HEAD)
build_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

jq -n \
  --arg v "${version}" \
  --arg s "${sha}" \
  --arg b "${build_at}" \
  '{
    version: $v,
    sha: $s,
    buildAt: $b
  }' > src/metadata.json
