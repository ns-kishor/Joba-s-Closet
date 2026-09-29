#!/bin/bash
# Fetch imagery for Joba's Closet: product photos (image-search) + brand editorial (image-gen)
OUT=/home/z/my-project/scripts/img-json
BRAND=/home/z/my-project/public/images/brand
mkdir -p "$OUT" "$BRAND"
echo "START $(date)" > /home/z/my-project/scripts/fetch_status.txt

run_search() {
  local key="$1" query="$2"
  if [ -s "$OUT/$key.json" ]; then echo "SKIP $key"; return; fi
  z-ai image-search -q "$query" -c 5 --gl us --no-rank -o "$OUT/$key.json" >/dev/null 2>&1 \
    && echo "OK $key" || echo "FAIL $key"
}

# ---------- product searches, 6 at a time ----------
search_batch() {
  while IFS= read -r line; do
    [ -z "$line" ] && continue
    local key="${line%%|*}" query="${line#*|}"
    run_search "$key" "$query" &
  done
  wait
}

cat <<'EOF' | search_batch
lipstick|pink lipstick makeup product photography pastel background
brushes|makeup brushes set product photography pink aesthetic
serum|skincare serum bottle product photography minimal aesthetic
lipgloss|lip gloss tube product photography pink aesthetic
beauty-palette|makeup palette cosmetic product photography flat lay pink
pearl-bracelet|pearl bracelet jewelry product photography white background
EOF

cat <<'EOF' | search_batch
necklace|dainty gold necklace pendant product photography
earrings|gold hoop earrings jewelry product photography
rings|dainty gold rings jewelry product photography flat lay
anklet|gold anklet bracelet jewelry product photography
jewelry-set|pearl jewelry set necklace earrings product photography
chain|silver chain bracelet jewelry product photography
EOF

cat <<'EOF' | search_batch
presson|press on nails set product photography
nailtools|nail art tools accessories product photography
handbag|small elegant handbag product photography beige aesthetic
hairclips|hair clips claw accessories product photography pastel
sunglasses|women sunglasses product photography beige aesthetic
scarf|silk scarf product photography flat lay pastel
EOF

cat <<'EOF' | search_batch
candle|scented candle product photography aesthetic minimal
mirror|vanity mirror product photography aesthetic
pouch|cosmetic bag pouch product photography pink
tumbler|pink tumbler water bottle product photography
scrunchie|satin scrunchies hair ties product photography pastel
EOF

# ---------- generated brand images (parallel) ----------
gen() {
  local file="$1" size="$2" prompt="$3"
  if [ -s "$BRAND/$file" ]; then echo "SKIP $file"; return; fi
  z-ai image -p "$prompt" -o "$BRAND/$file" -s "$size" >/dev/null 2>&1 \
    && echo "OK $file" || echo "FAIL $file"
}

gen hero.jpg 864x1152 "Editorial fashion photography, elegant young woman with soft natural makeup wearing blush pink silk blouse, delicate gold-tone necklace, gentle smile, warm ivory studio background, soft diffused window light, minimal premium boutique aesthetic, muted rose and cream tones, high quality, no text" &
gen promo-jewelry.jpg 1440x720 "Luxurious flat lay of delicate gold-tone fashion jewelry, imitation pearl necklaces, rings and earrings arranged on cream silk fabric with soft rose petals, gentle natural light, blush and ivory color palette, elegant editorial product photography, high quality, no text" &
gen promo-beauty.jpg 1344x768 "Flat lay of pink and nude cosmetics, lipsticks and beauty products on ivory marble surface, scattered rose petals, soft shadows, minimal editorial style, blush cream palette, feminine aesthetic, high quality, no text" &
gen about.jpg 864x1152 "Cozy feminine vanity desk corner with cosmetics, small perfume bottle, jewelry dish with rings, dried flowers and soft linen, cream and blush tones, soft morning light, editorial lifestyle photography, warm and personal, high quality, no text" &
wait

echo "DONE $(date)" >> /home/z/my-project/scripts/fetch_status.txt
ls "$OUT" | wc -l >> /home/z/my-project/scripts/fetch_status.txt
