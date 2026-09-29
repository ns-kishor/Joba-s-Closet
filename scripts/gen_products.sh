#!/bin/bash
# Generate AI product images for Joba's Closet (watermark replacements)
P=/home/z/my-project/public/images/products
gen() {
  local file="$1" size="$2" prompt="$3"
  if [ -s "$P/$file" ]; then echo "SKIP $file"; return; fi
  z-ai image -p "$prompt" -o "$P/$file" -s "$size" >/dev/null 2>&1 \
    && echo "OK $file" || echo "FAIL $file"
}

gen ai-glitter-nails-1.jpg 1024x1024 "Press-on nails with fine rose gold glitter, almond shape, displayed elegantly on blush pink silk background, professional product photography, soft light, no text, no watermark" &
gen ai-manicure-kit-1.jpg 1024x1024 "Manicure tool set with nail file, buffer, clipper and cuticle pusher arranged in a blush pink pouch, flat lay product photography on warm cream background, soft light, no text, no watermark" &
wait
gen ai-silver-necklace-1.jpg 1024x1024 "Delicate silver-tone chain necklace with tiny pendant laid on soft ivory silk fabric, elegant product photography, gentle natural light, no text, no watermark" &
gen ai-pearl-bracelet-1.jpg 1024x1024 "Single strand imitation pearl bracelet with polished gold-tone clasp, product photography on white marble surface, soft diffused light, elegant, no text, no watermark" &
wait
gen ai-ring-statement-1.jpg 1024x1024 "Single adjustable gold-tone alloy statement ring with smooth polished dome, macro product photography on warm cream background, soft shadow, no text, no watermark" &
gen ai-ring-stack-1.jpg 1024x1024 "Set of four thin dainty gold-tone stackable rings arranged in a row on ivory silk fabric, flat lay product photography, soft light, no text, no watermark" &
wait
echo ALL_DONE
