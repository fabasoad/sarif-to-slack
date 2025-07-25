#!/usr/bin/env sh

main() {
  tsc
  api-extractor run --local --verbose
  tsup src/index.ts --format cjs --target es2024 --out-dir dist-cjs --clean
  mv dist-cjs/index.js dist/index.cjs
  rm -rf dist-cjs
}

main "$@"
