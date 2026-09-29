/**
 * Joba's Closet — product catalog.
 *
 * Jewelry is ALWAYS described as artificial / imitation / fashion /
 * gold-tone / silver-tone / alloy — never as real gold or silver. (PRD §19)
 */

export type CategoryId = "beauty" | "jewelry" | "nails" | "accessories" | "lifestyle";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategoryId;
  subcategory: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  badge?: "new" | "bestseller";
  short: string;
  description: string;
  details: { material?: string; size?: string; color?: string; care?: string };
  stock: "in" | "low" | "out";
  featured?: boolean;
  newArrival?: boolean;
  popular: number; // higher = more popular
};

export type Category = {
  id: CategoryId;
  name: string;
  tagline: string;
  image: string;
  subcategories: string[];
};

const img = (key: string, n: number) => `/images/products/${key}-${n}.jpg`;

export const CATEGORIES: Category[] = [
  {
    id: "beauty",
    name: "Beauty",
    tagline: "Everyday glam, made easy",
    image: img("beauty-palette", 3),
    subcategories: ["Makeup", "Skincare", "Beauty Tools", "Hair Accessories", "Beauty Essentials"],
  },
  {
    id: "jewelry",
    name: "Jewelry",
    tagline: "A little sparkle, every day",
    image: img("necklace", 1),
    subcategories: ["Necklaces", "Chains", "Bracelets", "Rings", "Earrings", "Anklets", "Jewelry Sets"],
  },
  {
    id: "nails",
    name: "Nails",
    tagline: "Salon-style nails at home",
    image: img("presson", 1),
    subcategories: ["Press-on Nails", "Artificial Nails", "Nail Sets", "Nail Accessories"],
  },
  {
    id: "accessories",
    name: "Accessories",
    tagline: "The finishing touches",
    image: img("handbag", 1),
    subcategories: ["Hair Accessories", "Bags", "Fashion Accessories", "Everyday Accessories"],
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    tagline: "Little joys for every day",
    image: img("candle", 1),
    subcategories: ["Daily-use Products", "Personal Accessories", "Women's Essentials", "Other Lifestyle Products"],
  },
];

const JEWELRY_CARE =
  "Keep away from water, perfume and sweat. Wipe gently with a soft dry cloth after use and store in the pouch provided to keep the shine longer.";

type Base = {
  badge?: Product["badge"];
  stock?: Product["stock"];
  featured?: boolean;
  newArrival?: boolean;
  popular?: number;
};

function make(
  id: string,
  name: string,
  category: CategoryId,
  subcategory: string,
  price: number,
  originalPrice: number | undefined,
  rating: number,
  reviews: number,
  images: string[],
  short: string,
  description: string,
  details: Product["details"],
  o: Base = {},
): Product {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return {
    id,
    slug,
    name,
    category,
    subcategory,
    price,
    originalPrice,
    rating,
    reviews,
    images,
    badge: o.badge,
    short,
    description,
    details,
    stock: o.stock ?? "in",
    featured: o.featured,
    newArrival: o.newArrival,
    popular: o.popular ?? 10,
  };
}

export const PRODUCTS: Product[] = [
  // ─────────────────────────── BEAUTY ───────────────────────────
  make("b01", "Velvet Matte Lipstick — Rosewood", "beauty", "Makeup", 180, 250, 4.7, 41, [img("lipstick", 2), img("lipstick", 4)],
    "Smooth matte lipstick with a soft rosewood finish that stays comfortable all day.",
    "A creamy matte lipstick that glides on smoothly and gives your lips a soft, velvety finish. The rosewood shade suits both everyday wear and special occasions. Enriched with vitamin E to keep lips feeling comfortable for hours.",
    { material: "Cosmetic-grade matte formula with vitamin E", size: "3.8 g", color: "Rosewood", care: "Store in a cool, dry place away from direct sunlight." },
    { badge: "bestseller", featured: true, popular: 95 }),
  make("b02", "Glow Lip Gloss — Berry Shine", "beauty", "Makeup", 150, undefined, 4.5, 28, [img("lipgloss", 1), img("lipgloss", 2)],
    "A juicy berry gloss with a non-sticky, mirror-shine finish.",
    "Give your lips a juicy burst of color with this lightweight berry lip gloss. The non-sticky formula adds a glossy shine without feeling heavy, and the sweet scent makes reapplying a little treat.",
    { material: "Glossy non-stick formula", size: "6 ml", color: "Berry", care: "Keep the cap tightly closed after use." },
    { newArrival: true, popular: 70 }),
  make("b03", "Everyday Lipstick Trio Set", "beauty", "Makeup", 320, 450, 4.8, 36, [img("ai-lipstick-trio", 1), img("lipgloss", 4)],
    "Three everyday shades — nude, pink and red — in one pretty set.",
    "Three hand-picked shades that cover every mood: a soft nude for day, a rosy pink for brunch and a classic red for evenings. Each lipstick has a smooth, satin-matte finish that feels light and looks polished.",
    { material: "Satin-matte cosmetic formula", size: "3 × 3.5 g", color: "Nude / Pink / Red", care: "Store away from heat and direct sunlight." },
    { featured: true, popular: 88 }),
  make("b04", "Tinted Lip Balm — Peach", "beauty", "Beauty Essentials", 120, undefined, 4.6, 33, [img("lipgloss", 3)],
    "A hint of peachy color with all-day moisture.",
    "This tinted lip balm keeps your lips soft and hydrated while adding a natural peachy tint. Perfect for school, office or no-makeup days, and small enough to slip into any pocket.",
    { material: "Shea butter & vitamin E balm", size: "4 g", color: "Peach", care: "Keep below 30°C." },
    { popular: 64 }),
  make("b05", "Soft Touch Makeup Brush Set (5 pcs)", "beauty", "Beauty Tools", 280, 380, 4.7, 25, [img("brushes", 2), img("brushes", 3)],
    "Five silky-soft brushes for face and eyes, with a blush-pink handle.",
    "Everything you need for a smooth base: foundation, powder, blush and two blending brushes. The synthetic bristles are soft on skin and easy to wash, with comfortable pink handles that look lovely on any vanity.",
    { material: "Synthetic bristles, wooden handle", size: "5 pieces", color: "Blush Pink", care: "Wash gently with mild soap and air-dry." },
    { featured: true, popular: 81 }),
  make("b06", "Blush & Powder Brush", "beauty", "Beauty Tools", 160, undefined, 4.4, 19, [img("brushes", 3)],
    "One fluffy brush for blush, powder and highlighter.",
    "A single, well-made brush that does the job of three. The dome shape picks up just the right amount of powder and blends blush beautifully for a natural, healthy glow.",
    { material: "Synthetic bristles", size: "1 piece", color: "Rose Gold-tone ferrule", care: "Clean weekly for best results." },
    { popular: 55 }),
  make("b07", "Hydrating Face Serum 30ml", "beauty", "Skincare", 240, 320, 4.6, 47, [img("serum", 1), img("serum", 2)],
    "A lightweight hyaluronic serum for soft, dewy skin.",
    "A few drops morning and night help your skin hold onto moisture, leaving it plump and dewy. The lightweight formula absorbs quickly and sits nicely under makeup or sunscreen.",
    { material: "Hyaluronic acid + glycerin serum", size: "30 ml", color: "Clear", care: "Patch test before first use. For external use only." },
    { badge: "bestseller", featured: true, popular: 92 }),
  make("b08", "Aloe Soothing Gel 150ml", "beauty", "Skincare", 190, undefined, 4.5, 30, [img("serum", 3)],
    "Cooling aloe gel for face, body and hair.",
    "A multi-use aloe gel that calms sun-exposed skin, hydrates dry patches and can even smooth flyaway hair. Keep a jar in the fridge for an extra cooling treat on warm days.",
    { material: "99% aloe vera extract gel", size: "150 ml", care: "Store in a cool place." },
    { popular: 60 }),
  make("b09", "Everyday Eyeshadow Palette", "beauty", "Makeup", 350, 480, 4.5, 22, [img("beauty-palette", 3), img("beauty-palette", 4)],
    "Nine soft rose and nude shades for effortless eye looks.",
    "Nine blendable shades — from soft champagne to warm mauve — that take you from day to night. The powders are pigmented but easy to build, so even beginners can create a pretty, polished look.",
    { material: "Pressed powder eyeshadow", size: "9 shades × 1.2 g", color: "Rose & Nude tones", care: "Keep palette closed to prevent drying." },
    { featured: true, popular: 78 }),
  make("b10", "Blush & Contour Palette", "beauty", "Makeup", 300, undefined, 4.3, 15, [img("beauty-palette", 3)],
    "Blush, contour and highlight in one compact palette.",
    "Sculpt, flush and glow with this all-in-one face palette. The shades are soft and buildable, made to flatter warm South Asian skin tones without looking patchy.",
    { material: "Pressed powder", size: "4 pans", color: "Warm blush tones", care: "Clean brushes between uses." },
    { newArrival: true, popular: 52 }),
  make("b11", "Satin Scrunchie Set (3 pcs)", "beauty", "Hair Accessories", 130, 180, 4.8, 52, [img("scrunchie", 1), img("scrunchie", 2)],
    "Gentle satin scrunchies that don't tug or crease.",
    "Three satin scrunchies in soft blush and cream tones that hold your hair without leaving dents. The smooth fabric is gentle on strands, reducing breakage and frizz.",
    { material: "Satin fabric, elastic core", size: "3 pieces", color: "Blush / Cream / Rose", care: "Hand wash if needed, air-dry." },
    { badge: "bestseller", popular: 86 }),
  make("b12", "Silk-Touch Hair Tie Duo", "beauty", "Hair Accessories", 90, undefined, 4.4, 21, [img("scrunchie", 4)],
    "Two slim silk-touch ties for ponytails with zero snag.",
    "Slim, silky ties that secure your ponytail firmly without snagging or pulling. Perfect for everyday wear and gentle enough for fine hair.",
    { material: "Silk-touch fabric", size: "2 pieces", color: "Neutral tones", care: "Air-dry after washing." },
    { newArrival: true, popular: 48 }),

  // ─────────────────────────── JEWELRY (all artificial / fashion) ───────────────────────────
  make("j01", "Elegant Imitation Pearl Bracelet", "jewelry", "Bracelets", 180, 250, 4.8, 34, [img("pearl-bracelet", 1), img("pearl-bracelet", 2)],
    "A classic imitation pearl bracelet with a gold-tone clasp.",
    "Round imitation pearls strung on a sturdy cord with a polished gold-tone clasp. This artificial pearl bracelet adds quiet elegance to both sarees and everyday outfits — at a price that makes gifting easy.",
    { material: "Imitation (artificial) pearls, gold-tone alloy clasp — fashion jewelry, not real pearls or gold", size: "Fits wrists 15–18 cm", color: "Ivory & Gold-tone", care: JEWELRY_CARE },
    { badge: "bestseller", featured: true, popular: 97 }),
  make("j02", "Classic Faux Pearl Strand Bracelet", "jewelry", "Bracelets", 200, undefined, 4.6, 18, [img("ai-pearl-bracelet", 1)],
    "A single strand of lustrous faux pearls for timeless style.",
    "A simple, single-strand bracelet made with glossy faux pearls. Understated and elegant — the kind of piece that goes with everything from kurtas to cocktail dresses.",
    { material: "Faux (imitation) pearls on elastic cord — fashion jewelry", size: "Stretch fit", color: "Ivory", care: JEWELRY_CARE },
    { popular: 63 }),
  make("j03", "Minimal Gold-Tone Butterfly Necklace", "jewelry", "Necklaces", 150, 220, 4.8, 24, [img("necklace", 1), img("necklace", 2)],
    "A dainty gold-tone butterfly pendant on a fine chain.",
    "A little butterfly done in warm gold-tone alloy, hanging from a fine 40 cm chain. Sweet on its own, even prettier layered — and light enough to wear all day without noticing it's there.",
    { material: "Gold-tone plated alloy (artificial jewelry, nickel-safe)", size: "Chain 40 cm + 5 cm extender", color: "Gold-tone", care: JEWELRY_CARE },
    { badge: "bestseller", featured: true, popular: 94 }),
  make("j04", "Dainty Gold-Tone Pendant Necklace", "jewelry", "Necklaces", 190, undefined, 4.5, 27, [img("necklace", 3)],
    "A delicate everyday pendant with a soft shine.",
    "A small, meaningful pendant that sits right at the collarbone. The gold-tone finish catches the light gently, making it an easy everyday signature piece.",
    { material: "Gold-tone alloy with zircon-style stone — artificial jewelry", size: "Chain 45 cm", color: "Gold-tone", care: JEWELRY_CARE },
    { popular: 71 }),
  make("j05", "Layered Fashion Chain Necklace", "jewelry", "Chains", 220, 300, 4.4, 16, [img("necklace", 4), img("necklace", 3)],
    "Pre-layered gold-tone chains — no tangling, no fuss.",
    "Two or three delicate chains layered perfectly in one piece, so you get the stacked look without the morning tangle. A clasp at the back keeps everything in place all day.",
    { material: "Gold-tone alloy chains — fashion jewelry", size: "Layered 40/45/50 cm", color: "Gold-tone", care: JEWELRY_CARE },
    { newArrival: true, popular: 66 }),
  make("j06", "Everyday Gold-Tone Hoop Earrings", "jewelry", "Earrings", 140, undefined, 4.7, 45, [img("earrings", 3), img("earrings", 4)],
    "Lightweight hoops you can wear from morning to night.",
    "Classic medium hoops in warm gold-tone with a comfortable hinged closure. They're feather-light, so even all-day wear feels effortless — a true everyday staple.",
    { material: "Gold-tone alloy, hinged hoop — artificial jewelry", size: "Outer diameter 2.5 cm", color: "Gold-tone", care: JEWELRY_CARE },
    { badge: "bestseller", featured: true, popular: 93 }),
  make("j07", "Pearl Drop Earrings — Gold-Tone", "jewelry", "Earrings", 170, 230, 4.6, 23, [img("earrings", 2), img("earrings", 1)],
    "Imitation pearl drops that sway with every step.",
    "A small imitation pearl suspended from a gold-tone hook — simple, graceful and always appropriate. These drop earrings dress up a plain kurta in seconds.",
    { material: "Imitation pearls, gold-tone alloy hooks — fashion jewelry", size: "Drop length 3 cm", color: "Ivory & Gold-tone", care: JEWELRY_CARE },
    { popular: 69 }),
  make("j08", "Minimal Stud Earrings Set (6 pairs)", "jewelry", "Earrings", 210, 290, 4.5, 31, [img("earrings", 4)],
    "Six pairs of tiny gold-tone studs for every day of the week.",
    "Flowers, hearts, stars and classic dots — six pairs of mini studs in warm gold-tone. Mix them, rotate them, gift a pair to your best friend.",
    { material: "Gold-tone alloy studs — artificial jewelry", size: "Studs 4–6 mm, 6 pairs", color: "Gold-tone", care: JEWELRY_CARE },
    { popular: 74 }),
  make("j09", "Dainty Gold-Tone Ring Set (4 pcs)", "jewelry", "Rings", 160, undefined, 4.4, 20, [img("ai-ring-stack", 1), img("rings", 1)],
    "Stackable thin rings with a soft, modern shine.",
    "Four thin, stackable rings in slightly different textures. Wear one for minimal days or stack all four for a trendy, curated look.",
    { material: "Gold-tone alloy rings — fashion jewelry", size: "Adjustable, fits most fingers", color: "Gold-tone", care: JEWELRY_CARE },
    { newArrival: true, popular: 62 }),
  make("j10", "Adjustable Alloy Statement Ring", "jewelry", "Rings", 130, 180, 4.3, 14, [img("ai-ring-statement", 1)],
    "One bold ring that finishes any outfit.",
    "A chunky-but-wearable statement ring with a smooth polished face. The open band adjusts to fit comfortably, making it an easy signature piece.",
    { material: "Alloy, polished finish — artificial jewelry", size: "Adjustable open band", color: "Gold-tone", care: JEWELRY_CARE },
    { popular: 50 }),
  make("j11", "Gold-Tone Chain Anklet", "jewelry", "Anklets", 120, 170, 4.5, 26, [img("anklet", 1), img("anklet", 2)],
    "A fine gold-tone anklet with tiny dangling charms.",
    "A delicate chain anklet with little charms that catch the light as you walk. Adjustable to 24 cm so it sits just right above your ankle.",
    { material: "Gold-tone alloy chain — artificial jewelry", size: "Adjustable up to 24 cm", color: "Gold-tone", care: JEWELRY_CARE },
    { popular: 58 }),
  make("j12", "Beaded Charm Anklet", "jewelry", "Anklets", 110, undefined, 4.2, 12, [img("anklet", 3)],
    "Colorful little beads on a summer-ready anklet.",
    "Tiny rose and cream beads strung with gold-tone accents — a playful anklet for sandals, mehendi nights and beach days.",
    { material: "Beads with alloy accents — fashion jewelry", size: "Adjustable up to 23 cm", color: "Blush & Gold-tone", care: JEWELRY_CARE },
    { newArrival: true, popular: 44 }),
  make("j13", "Imitation Pearl Jewelry Set", "jewelry", "Jewelry Sets", 380, 490, 4.8, 29, [img("jewelry-set", 1), img("jewelry-set", 2)],
    "Matching necklace and earring set with imitation pearls.",
    "A coordinated set: an imitation pearl necklace with matching drop earrings. Gift-boxed and ready — perfect for weddings, eid dinners and giving to someone special.",
    { material: "Imitation pearls with gold-tone alloy accents — fashion jewelry", size: "Necklace 45 cm", color: "Ivory & Gold-tone", care: JEWELRY_CARE },
    { featured: true, popular: 87 }),
  make("j14", "Gold-Tone Celebration Jewelry Set", "jewelry", "Jewelry Sets", 450, undefined, 4.6, 17, [img("jewelry-set", 3)],
    "A dressier gold-tone set for big days and big smiles.",
    "A little more sparkle for the big days — a gold-tone necklace with matching earrings, designed to complement sarees and lehengas beautifully. Comes in a gift-ready box.",
    { material: "Gold-tone alloy with stones — artificial jewelry", size: "Necklace 42 cm + extender", color: "Gold-tone", care: JEWELRY_CARE },
    { popular: 72 }),
  make("j15", "Silver-Tone Chain Bracelet", "jewelry", "Chains", 150, 200, 4.4, 22, [img("chain", 1), img("chain", 4)],
    "A clean silver-tone chain for effortless stacking.",
    "A slim silver-tone chain bracelet that layers beautifully with watches or bangles. Simple, shiny and easy to love.",
    { material: "Silver-tone alloy — artificial jewelry", size: "17 cm + 3 cm extender", color: "Silver-tone", care: JEWELRY_CARE },
    { popular: 61 }),
  make("j16", "Silver-Tone Chain Necklace", "jewelry", "Chains", 180, 240, 4.3, 13, [img("ai-silver-necklace", 1)],
    "A minimalist silver-tone necklace, made for layering.",
    "Wear it alone for a clean minimal look or layer it with pendants. The silver-tone finish is polished to a soft, everyday shine.",
    { material: "Silver-tone alloy — fashion jewelry", size: "Chain 45 cm", color: "Silver-tone", care: JEWELRY_CARE },
    { newArrival: true, popular: 49 }),

  // ─────────────────────────── NAILS ───────────────────────────
  make("n01", "Glossy Press-On Nails — Almond (24 pcs)", "nails", "Press-on Nails", 160, 220, 4.6, 38, [img("presson", 4)],
    "Salon-style almond nails at home in under 10 minutes.",
    "24 glossy press-on nails in a soft almond shape, with 12 sizes for a snug fit. The kit includes adhesive tabs and a mini file so you can get a salon look without the salon bill.",
    { material: "ABS artificial nails, adhesive tabs included", size: "24 nails, 12 sizes", color: "Soft nude gloss", care: "Apply on clean, dry nails for the longest wear." },
    { badge: "bestseller", featured: true, popular: 90 }),
  make("n02", "French Tip Artificial Nails Set", "nails", "Artificial Nails", 170, undefined, 4.5, 24, [img("presson", 2)],
    "The timeless French manicure, ready to press on.",
    "Classic white-tipped artificial nails with a clean square shape. Instantly tidy and elegant — perfect for interviews, weddings or just because.",
    { material: "ABS artificial nails", size: "24 nails", color: "French nude & white", care: "Avoid soaking in hot water for hours." },
    { popular: 67 }),
  make("n03", "Glitter Press-On Nail Kit", "nails", "Press-on Nails", 190, 260, 4.4, 16, [img("ai-glitter-nails", 1)],
    "A touch of sparkle for parties and celebrations.",
    "Short-length press-ons scattered with fine glitter that catches the light beautifully. Comes with prep tools and glue for wear that lasts days.",
    { material: "ABS artificial nails with glitter finish", size: "24 nails", color: "Rose glitter", care: "Remove gently — never force off." },
    { newArrival: true, popular: 56 }),
  make("n04", "Nail Art Accessories Set", "nails", "Nail Accessories", 140, undefined, 4.3, 11, [img("nailtools", 1)],
    "Charms, stickers and rhinestones for DIY nail art.",
    "A little box of creativity: tiny charms, pearl accents and stick-on rhinestones to decorate your nails (or your friends'!). Pairs perfectly with our press-on sets.",
    { material: "Mixed nail art decorations", size: "Assorted pack", care: "Store the box flat to keep pieces organized." },
    { popular: 42 }),
  make("n05", "Mini Manicure Tool Kit (4 pcs)", "nails", "Nail Sets", 180, 240, 4.5, 19, [img("ai-manicure-kit", 1)],
    "File, buffer, clipper and cuticle pusher in a pouch.",
    "The four basics of tidy nails, in a rose-toned pouch that lives happily in any bag. Good steel, comfortable grips and everything stays put with an elastic holder.",
    { material: "Stainless steel tools, PU pouch", size: "4 pieces + pouch", care: "Keep tools dry after use." },
    { popular: 47 }),

  // ─────────────────────────── ACCESSORIES ───────────────────────────
  make("a01", "Pearl Hair Claw Clips (2 pcs)", "accessories", "Hair Accessories", 150, 200, 4.7, 35, [img("hairclips", 1), img("hairclips", 4)],
    "Two sturdy claw clips with elegant pearl tops.",
    "Strong springs, smooth teeth and pretty imitation-pearl detailing — these claws hold thick buns securely all day. Two sizes so you always have the right one nearby.",
    { material: "Acetate-style resin with imitation pearl decor", size: "2 clips (10 cm & 8 cm)", color: "Cream & Blush", care: "Do not over-stretch the spring." },
    { badge: "bestseller", featured: true, popular: 89 }),
  make("a02", "Pastel Snap Clip Set (6 pcs)", "accessories", "Hair Accessories", 110, undefined, 4.4, 18, [img("hairclips", 2)],
    "Six little snap clips in soft pastel shades.",
    "Small snap clips that tame flyaways and frame your face prettily. Six pastel shades to mix and match with your outfits.",
    { material: "Metal core, enamel finish", size: "6 pieces, 5 cm", color: "Pastel mix", care: "Wipe dry if wet." },
    { popular: 46 }),
  make("a03", "Mini Elegance Handbag — Nude", "accessories", "Bags", 420, 560, 4.6, 21, [img("handbag", 1)],
    "A structured mini bag in warm nude, just big enough.",
    "Fits your phone, lip balm, cards and keys — everything that matters — in a neat, structured silhouette. The warm nude tone matches almost everything you own, and the strap converts from shoulder to crossbody.",
    { material: "PU leather, gold-tone hardware", size: "20 × 14 × 8 cm", color: "Nude", care: "Wipe with a soft dry cloth; keep away from rain." },
    { featured: true, popular: 84 }),
  make("a04", "Everyday Sling Bag — Powder Blue", "accessories", "Bags", 380, undefined, 4.5, 16, [img("handbag", 4)],
    "A soft powder-blue sling for errands, classes and chai runs.",
    "Lightweight but roomy, with a front zip pocket for the things you grab most. The powder-blue shade goes from campus to café without missing a beat.",
    { material: "PU leather, fabric lining", size: "22 × 15 × 7 cm", color: "Powder Blue", care: "Spot clean only." },
    { newArrival: true, popular: 57 }),
  make("a05", "Retro Oval Sunglasses — UV400", "accessories", "Fashion Accessories", 250, 330, 4.5, 27, [img("sunglasses", 1), img("sunglasses", 2)],
    "Narrow retro frames with full UV400 protection.",
    "Style and safety in one: UV400 lenses block harmful rays while the lightweight oval frames keep the look soft and feminine. Comes with a pouch and cleaning cloth.",
    { material: "PC frame, UV400 lenses", size: "Free size", color: "Blush frame / gradient lens", care: "Store in the pouch to avoid scratches." },
    { popular: 68 }),
  make("a06", "Classic Cat-Eye Sunglasses", "accessories", "Fashion Accessories", 270, undefined, 4.4, 14, [img("sunglasses", 3)],
    "A gentle cat-eye lift, day or evening.",
    "The subtle wing of a cat-eye frame flatters every face shape. Tinted lenses cut glare comfortably for bright Dhaka afternoons.",
    { material: "PC frame, tinted UV lenses", size: "Free size", color: "Mauve", care: "Clean with the cloth provided." },
    { popular: 51 }),
  make("a07", "Soft Satin Scarf — Blush Print", "accessories", "Fashion Accessories", 190, 260, 4.6, 20, [img("scarf", 2), img("scarf", 4)],
    "A silky square scarf — wear it in your hair or on your bag.",
    "One scarf, many moods: tie it around a ponytail, your wrist, or the handle of your tote. The satin touch feels lovely and the blush print lifts neutral outfits instantly.",
    { material: "Satin-touch polyester", size: "70 × 70 cm", color: "Blush print", care: "Hand wash cold, hang to dry." },
    { popular: 59 }),
  make("a08", "Lightweight Everyday Scarf", "accessories", "Everyday Accessories", 170, undefined, 4.5, 23, [img("scarf", 1)],
    "A breathable everyday scarf in soft neutral tones.",
    "Feather-light viscose that drapes beautifully and keeps you comfortable all day. A wardrobe workhorse in colors that go with everything.",
    { material: "Viscose blend", size: "180 × 70 cm", color: "Warm neutral", care: "Gentle machine wash in a laundry bag." },
    { popular: 54 }),

  // ─────────────────────────── LIFESTYLE ───────────────────────────
  make("l01", "Vanilla Cream Scented Candle", "lifestyle", "Daily-use Products", 220, 300, 4.7, 32, [img("candle", 1), img("candle", 2)],
    "Warm vanilla and cream notes for cozy evenings.",
    "Light it while you study, journal or unwind — the soft vanilla-cream scent makes any room feel instantly calmer. About 20 hours of burn time in a reusable glass jar.",
    { material: "Soy-blend wax, cotton wick", size: "120 g, ~20 hr burn", color: "Cream", care: "Trim the wick before each burn; never leave unattended." },
    { featured: true, popular: 80 }),
  make("l02", "Rose & Jasmine Mini Candle", "lifestyle", "Daily-use Products", 180, undefined, 4.5, 15, [img("candle", 4)],
    "A floral mini candle that gifts beautifully.",
    "Rose and jasmine notes in a petite jar — sweet on your own desk and even sweeter as a small gift. Pairs nicely with our jewelry sets for birthday boxes.",
    { material: "Soy-blend wax, cotton wick", size: "80 g, ~12 hr burn", color: "Blush", care: "Place on a heat-safe surface." },
    { newArrival: true, popular: 45 }),
  make("l03", "Round Tabletop Vanity Mirror", "lifestyle", "Women's Essentials", 260, 350, 4.6, 24, [img("mirror", 4), img("mirror", 1)],
    "A freestanding round mirror with a soft gold-tone rim.",
    "Proper makeup needs proper light and a proper mirror. This freestanding round mirror has a clear glass face, a warm gold-tone rim and a stable base — pretty enough to leave out on your vanity.",
    { material: "Glass mirror, metal rim", size: "Diameter 20 cm", color: "Gold-tone & cream", care: "Clean glass with a soft damp cloth." },
    { popular: 65 }),
  make("l04", "Travel Cosmetic Pouch — Blush", "lifestyle", "Personal Accessories", 240, undefined, 4.5, 17, [img("pouch", 1), img("pouch", 2)],
    "A wipe-clean pouch for makeup, meds or chargers.",
    "One pouch, endless uses. The wipe-clean lining handles foundation spills gracefully and the blush shade is easy to spot inside any bag.",
    { material: "Water-resistant PU, fabric lining", size: "22 × 12 × 7 cm", color: "Blush", care: "Wipe clean with a damp cloth." },
    { popular: 53 }),
  make("l05", "Quilted Makeup Bag — Cream", "lifestyle", "Personal Accessories", 260, 340, 4.6, 13, [img("pouch", 3)],
    "Softly quilted, gently structured, endlessly useful.",
    "A quilted exterior gives this bag its lovely texture, while the wide zip opening keeps your brushes and palettes easy to see. Fits perfectly inside our Mini Elegance Handbag.",
    { material: "Quilted PU with lining", size: "24 × 15 × 8 cm", color: "Cream", care: "Spot clean only." },
    { newArrival: true, popular: 43 }),
  make("l06", "Pastel Insulated Tumbler 500ml", "lifestyle", "Daily-use Products", 320, 420, 4.7, 26, [img("tumbler", 2), img("tumbler", 3)],
    "Keeps water cool for hours — hydration, but make it pretty.",
    "Double-wall insulation keeps drinks cold through long classes and commute days. The pastel finish and slim profile slip easily into your bag's side pocket.",
    { material: "Stainless steel, double-wall", size: "500 ml", color: "Pastel pink", care: "Hand wash; do not microwave." },
    { badge: "new", popular: 73 }),
];

export function getProduct(idOrSlug: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
}

export function featuredProducts() {
  return PRODUCTS.filter((p) => p.featured && p.stock !== "out");
}

export function newArrivals(limit = 8) {
  return PRODUCTS.filter((p) => p.newArrival).slice(0, limit);
}

export function byCategory(cat: CategoryId) {
  return PRODUCTS.filter((p) => p.category === cat);
}

export function relatedProducts(p: Product, limit = 4) {
  return PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id)
    .sort((a, b) => b.popular - a.popular)
    .slice(0, limit);
}

export function searchProducts(q: string): Product[] {
  const query = q.trim().toLowerCase();
  if (!query) return [];
  const words = query.split(/\s+/);
  return PRODUCTS.filter((p) => {
    const hay = `${p.name} ${p.category} ${p.subcategory} ${p.short}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}

export function priceBounds() {
  let min = Infinity;
  let max = 0;
  for (const p of PRODUCTS) {
    if (p.price < min) min = p.price;
    if (p.price > max) max = p.price;
  }
  return { min, max };
}

export const DELIVERY = { inside: 60, outside: 120 };
export const FREE_DELIVERY_THRESHOLD = 1500;

export function deliveryFor(zone: "inside" | "outside", subtotal: number): number {
  if (subtotal >= FREE_DELIVERY_THRESHOLD) return 0;
  return zone === "inside" ? DELIVERY.inside : DELIVERY.outside;
}

export const REVIEW_HIGHLIGHTS = [
  {
    name: "Nusrat J.",
    rating: 5,
    text: "Beautiful product and exactly as shown. The necklace finish is lovely — you really can't beat this price.",
    product: "Minimal Gold-Tone Butterfly Necklace",
  },
  {
    name: "Farhana A.",
    rating: 5,
    text: "Delivery was quick inside Dhaka and everything was packed so prettily. Will definitely order again.",
    product: "Imitation Pearl Jewelry Set",
  },
  {
    name: "Tanzina R.",
    rating: 5,
    text: "The press-on nails fit perfectly and lasted more than a week. My friends all asked where I got them!",
    product: "Glossy Press-On Nails — Almond",
  },
  {
    name: "Mim Akter",
    rating: 4,
    text: "Cute scrunchies, super soft fabric. Colors are exactly like the photos.",
    product: "Satin Scrunchie Set",
  },
  {
    name: "Sadia I.",
    rating: 5,
    text: "I was worried about ordering online, but the team called to confirm and the bracelet arrived in two days.",
    product: "Elegant Imitation Pearl Bracelet",
  },
  {
    name: "Ayesha H.",
    rating: 5,
    text: "The candle smells amazing and the handbag feels much more expensive than it was. Obsessed!",
    product: "Mini Elegance Handbag — Nude",
  },
];
