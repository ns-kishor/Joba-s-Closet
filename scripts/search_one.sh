#!/bin/bash
# One search: z-ai image-search → extract JSON (strip SDK banner lines) → save
OUT=/home/z/my-project/scripts/img-json
mkdir -p "$OUT"
key="$1"; shift
if [ -s "$OUT/$key.json" ]; then echo "SKIP $key"; exit 0; fi
tmp=$(mktemp)
if timeout 160 z-ai image-search -q "$*" -c 4 --gl us --no-rank > "$tmp" 2>&1; then
  # keep from first line that begins with { to end
  sed -n '/^{/,$p' "$tmp" > "$OUT/$key.json"
  if [ -s "$OUT/$key.json" ]; then echo "OK $key"; else echo "EMPTY $key"; fi
else
  echo "FAIL $key (exit $?)"
fi
rm -f "$tmp"
