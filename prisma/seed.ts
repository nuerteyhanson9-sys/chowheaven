/**
 * Chow Heaven — comprehensive seed script.
 *
 * Run: npx prisma db seed
 * (package.json → "seed": "tsx prisma/seed.ts")
 */
import { PrismaClient, Prisma, Role, OrderStatus, PaymentStatus, ReservationStatus, Occasion, GalleryCategory, CouponType } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

/* ─── Local image resolution (public/images/**) ──────────────────────────── */

const IMAGES_ROOT = path.resolve(__dirname, "..", "public", "images");
const IMG_EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function localImage(area: "menu" | "categories" | "gallery", key: string): string | null {
  const dir = path.join(IMAGES_ROOT, area);
  if (!fs.existsSync(dir)) return null;
  const slug = slugify(key);
  for (const name of fs.readdirSync(dir)) {
    if (!IMG_EXT.test(name)) continue;
    const fileSlug = name.replace(IMG_EXT, "").toLowerCase();
    if (fileSlug === slug || fileSlug === slug.replace(/-+/g, "-")) {
      return `/images/${area}/${name}`;
    }
  }
  return null;
}

/* ─── Remote image URLs (fallback when local files not yet provided) ─────── */

const IMG = {
  // Jollof
  jollofClassic:    "https://upload.wikimedia.org/wikipedia/commons/7/70/Jollof_rice.jpg",
  jollofChicken:    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/960px-A_plate_of_jollof_rice_and_chicken.jpg",
  jollofEgg:        "https://upload.wikimedia.org/wikipedia/commons/e/ec/Jollof_rice_with_boiled_egg_and_fried_chicken.jpg",
  jollofVeg:        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Jollof_rice_with_vegetable.jpg/960px-Jollof_rice_with_vegetable.jpg",
  jollofGhana:      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Ghana_Jollof_Rice_with_Chicken.jpg/960px-Ghana_Jollof_Rice_with_Chicken.jpg",
  jollofStew:       "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Jollof_rice_and_tomato_stew.jpg/960px-Jollof_rice_and_tomato_stew.jpg",
  jollofPlantain:   "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Jollof_Rice_and_fried_plantain_with_diced-beef_sauce_and_cucumber.jpg/960px-Jollof_Rice_and_fried_plantain_with_diced-beef_sauce_and_cucumber.jpg",

  // Fried rice
  friedRiceChicken: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Fried_rice_with_chicken_%2817234644521%29.jpg/960px-Fried_rice_with_chicken_%2817234644521%29.jpg",
  friedRiceVeg:     "https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Vegetable_Fried_Rice.jpg/960px-Vegetable_Fried_Rice.jpg",
  friedRiceYang:    "https://upload.wikimedia.org/wikipedia/commons/4/44/Yangzhou_fried_rice_and_drinks_06-09-2019.jpg",

  // Soups & Swallows
  egusi:            "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Plates_of_Egusi_Soup_with_vegetables_and_wrapped_Pounded_Yam.jpg/960px-Plates_of_Egusi_Soup_with_vegetables_and_wrapped_Pounded_Yam.jpg",
  okro:             "https://upload.wikimedia.org/wikipedia/commons/4/41/Okro_soup.jpg",
  banga:            "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Banga_Soup.jpg/960px-Banga_Soup.jpg",
  afang:            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Afang_soup_and_pounded_yam_03.jpg/960px-Afang_soup_and_pounded_yam_03.jpg",

  // Grills
  suya:             "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Suya_with_pepper_sauce.jpg/1200px-Suya_with_pepper_sauce.jpg",

  // Sides
  dodo:             "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Dodo_fried.jpg/960px-Dodo_fried.jpg",
  plantainChips:    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Plantain_chips.jpg/960px-Plantain_chips.jpg",

  // Drinks
  mangoSmoothie:    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Fresh-mango-smoothie_01.jpg/960px-Fresh-mango-smoothie_01.jpg",
  pineapple:        "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Batido_de_pi%C3%B1a.jpg/960px-Batido_de_pi%C3%B1a.jpg",
  bananaSmoothie:   "https://upload.wikimedia.org/wikipedia/commons/d/d8/Banana_and_strawberry_smoothie.jpg",

  // Desserts
  brownie:          "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Brownie_IMG_001.jpg/960px-Brownie_IMG_001.jpg",
  brownieSundae:    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BROWNIE_SUNDAE.jpg/960px-BROWNIE_SUNDAE.jpg",

  // Small chops
  puffPuff:         "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Puff_Puff.jpg/960px-Puff_Puff.jpg",
  chinChin:         "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Chin-chin.jpg/960px-Chin-chin.jpg",
  puffPuffAlt:      "https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg",

  // Gallery / Unsplash
  interior1:  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=70",
  interior2:  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=70",
  chef1:      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=70",
  foodPlate1: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=70",
  foodPlate2: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=70",
  foodPlate3: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=70",
  team1:      "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=70",
  event1:     "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=70",
  drink1:     "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=70",
};

/* ─── Helpers ────────────────────────────────────────────────────────────────── */

const hash = (pw: string) => bcrypt.hashSync(pw, 12);
const dec = (n: number) => new Prisma.Decimal(n);
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const minsAgo = (n: number) => new Date(Date.now() - n * 60_000);

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/* ─── Main ───────────────────────────────────────────────────────────────────── */

async function main() {
  console.log("🌱  Seeding Chow Heaven database …");

  /* ── Users ────────────────────────────────────────────────────────────────── */

  const pw = hash("password123");

  const admin = await prisma.user.upsert({
    where: { email: "admin@chowheaven.ng" },
    update: {},
    create: {
      email: "admin@chowheaven.ng",
      fullName: "Chioma Nwosu",
      phone: "+234 801 234 5678",
      role: Role.ADMIN,
      passwordHash: pw,
      customer: { create: {} },
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@chowheaven.ng" },
    update: {},
    create: {
      email: "staff@chowheaven.ng",
      fullName: "Emeka Okoro",
      phone: "+234 802 345 6789",
      role: Role.STAFF,
      passwordHash: pw,
      customer: { create: {} },
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "chiamaka@example.com" },
    update: {},
    create: {
      email: "chiamaka@example.com",
      fullName: "Chiamaka Eze",
      phone: "+234 803 456 7890",
      role: Role.CUSTOMER,
      passwordHash: pw,
      customer: { create: { loyaltyPoints: 240, ordersCount: 4, totalSpent: dec(12800) } },
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { email: "fatima@example.com" },
    update: {},
    create: {
      email: "fatima@example.com",
      fullName: "Fatima Abubakar",
      phone: "+234 804 567 8901",
      role: Role.CUSTOMER,
      passwordHash: pw,
      customer: { create: { loyaltyPoints: 80, ordersCount: 1, totalSpent: dec(4200) } },
    },
  });

  const customer3 = await prisma.user.upsert({
    where: { email: "tunde@example.com" },
    update: {},
    create: {
      email: "tunde@example.com",
      fullName: "Tunde Williams",
      phone: "+234 805 678 9012",
      role: Role.CUSTOMER,
      passwordHash: pw,
      customer: { create: { loyaltyPoints: 160, ordersCount: 3, totalSpent: dec(9500) } },
    },
  });

  // Set password resets expiry to required — add required field
  await prisma.user.update({ where: { id: customer.id }, data: { updatedAt: new Date() } });

  console.log("  ✓ Users created");

  /* ── Addresses ─────────────────────────────────────────────────────────────── */

  const addr1 = await prisma.address.upsert({
    where: { id: "addr_chiamaka_home" },
    update: {},
    create: {
      id: "addr_chiamaka_home",
      userId: customer.id,
      label: "Home",
      street: "15 Admiralty Way, Lekki Phase 1",
      city: "Lagos",
      state: "Lagos",
      zip: "101241",
      isDefault: true,
    },
  });

  await prisma.address.upsert({
    where: { id: "addr_fatima_office" },
    update: {},
    create: {
      id: "addr_fatima_office",
      userId: customer2.id,
      label: "Office",
      street: "22 Marina, Lagos Island",
      city: "Lagos",
      state: "Lagos",
      zip: "102273",
      isDefault: true,
    },
  });

  console.log("  ✓ Addresses created");

  /* ── Categories ────────────────────────────────────────────────────────────── */

  const categories = await Promise.all(
    [
      { name: "Jollof & Rice",    slug: "jollof-rice",    description: "The heart of the party — smoky party jollof, fragrant fried rice and more.", ordering: 1, imageUrl: localImage("categories", "jollof-rice") ?? IMG.jollofChicken },
      { name: "Soups & Swallows", slug: "soups-swallows", description: "Slow-simmered Nigerian soups paired with pounded yam, eba or fufu.", ordering: 2, imageUrl: localImage("categories", "soups-swallows") ?? IMG.egusi },
      { name: "Starters",         slug: "starters",       description: "Small chops, suya and plates to share.", ordering: 3, imageUrl: localImage("categories", "starters") ?? IMG.suya },
      { name: "Grills & Suya",    slug: "grills-suya",    description: "Charcoal-grilled meats, catfish and suya from the live grill.", ordering: 4, imageUrl: localImage("categories", "grills-suya") ?? IMG.suya },
      { name: "Sides & Extras",   slug: "sides-extras",   description: "Plantain, chips, coleslaw and extra protein.", ordering: 5, imageUrl: localImage("categories", "sides-extras") ?? IMG.dodo },
      { name: "Drinks & Smoothies", slug: "drinks",       description: "Fresh-pressed juices, smoothies and cocktails.", ordering: 6, imageUrl: localImage("categories", "drinks") ?? IMG.mangoSmoothie },
      { name: "Desserts",         slug: "desserts",       description: "Sweet endings — brownies, sundaes and puff puff.", ordering: 7, imageUrl: localImage("categories", "desserts") ?? IMG.brownieSundae },
    ].map((c) =>
      prisma.menuCategory.upsert({ where: { slug: c.slug }, update: c, create: c })
    ),
  );

  const [catJollof, catSoups, catStarters, catGrills, catSides, catDrinks, catDesserts] = categories;

  console.log("  ✓ Categories created");

  /* ── Menu items ────────────────────────────────────────────────────────────── */

  type ItemInput = {
    name: string; slug: string; description: string; price: number;
    categoryId: string; imageUrl: string; ingredients?: string[];
    spiceLevel?: number; isVegetarian?: boolean; isFeatured?: boolean;
    tags?: string[];
    options?: Array<{ groupName: string; optionName: string; priceModifier: number; isDefault?: boolean }>;
  };

  const itemsData: ItemInput[] = [
    // ── Jollof ──
    { name: "Party Jollof Rice", slug: "party-jollof", description: "Smoky, tomato-rich party jollof — the dish that started it all. Cooked over wood fire the way Lagos does best.", price: 4500, categoryId: catJollof.id, imageUrl: IMG.jollofClassic, ingredients: ["Parboiled rice", "Tomato", "Scotch bonnet", "Onion", "Bay leaf", "Thyme"], spiceLevel: 2, isFeatured: true, tags: ["signature", "party style"], options: [{ groupName: "Protein", optionName: "Grilled chicken", priceModifier: 800, isDefault: true }, { groupName: "Protein", optionName: "Fried chicken", priceModifier: 800 }, { groupName: "Protein", optionName: "Grilled fish", priceModifier: 1200 }, { groupName: "Protein", optionName: "Beef suya", priceModifier: 1500 }, { groupName: "Protein", optionName: "No protein", priceModifier: 0 }] },
    { name: "Jollof Rice & Egg", slug: "jollof-egg", description: "Classic jollof served with a boiled egg and a side of garden salad.", price: 3800, categoryId: catJollof.id, imageUrl: IMG.jollofEgg, ingredients: ["Rice", "Tomato", "Egg", "Lettuce", "Carrot"], spiceLevel: 1, options: [] },
    { name: "Ghana Jollof", slug: "ghana-jollof", description: "Basmati-based Ghanaian-style jollof served with a side of coleslaw and fried plantain.", price: 5200, categoryId: catJollof.id, imageUrl: IMG.jollofGhana, ingredients: ["Basmati rice", "Tomato", "Bay leaf", "Plantain"], spiceLevel: 1, options: [{ groupName: "Protein", optionName: "Chicken", priceModifier: 900 }, { groupName: "Protein", optionName: "Goat meat", priceModifier: 1500 }] },
    { name: "Vegetable Jollof", slug: "veg-jollof", description: "Garden-vegetable jollof with bell peppers, courgette and carrots — a lighter take.", price: 4000, categoryId: catJollof.id, imageUrl: IMG.jollofVeg, ingredients: ["Rice", "Tomato", "Bell pepper", "Courgette", "Carrot"], spiceLevel: 1, isVegetarian: true, options: [] },
    { name: "Jollof & Tomato Stew", slug: "jollof-stew", description: "Jollof served alongside a separate bowl of rich tomato stew for extra flavour.", price: 4800, categoryId: catJollof.id, imageUrl: IMG.jollofStew, ingredients: ["Rice", "Tomato", "Scotch bonnet", "Onion"], spiceLevel: 2, options: [] },
    { name: "Special Fried Rice", slug: "special-fried-rice", description: "Nigerian-style fried rice loaded with mixed vegetables and served with pepper sauce.", price: 4800, categoryId: catJollof.id, imageUrl: IMG.friedRiceChicken, ingredients: ["Rice", "Mixed vegetables", "Liver", "Curry", "Thyme"], spiceLevel: 1, options: [{ groupName: "Protein", optionName: "Chicken", priceModifier: 800, isDefault: true }, { groupName: "Protein", optionName: "Shrimp", priceModifier: 1500 }] },
    { name: "Yangzhou Fried Rice", slug: "yangzhou-rice", description: "A Chow Heaven twist on Chinese-style fried rice with prawns, egg and spring onions.", price: 5500, categoryId: catJollof.id, imageUrl: IMG.friedRiceYang, ingredients: ["Rice", "Prawns", "Egg", "Spring onion", "Sesame oil"], spiceLevel: 0, options: [] },

    // ── Soups & Swallows ──
    { name: "Egusi Soup & Pounded Yam", slug: "egusi-pounded-yam", description: "Rich ground-melon soup with spinach, assorted meats and stockfish, served with soft pounded yam.", price: 5800, categoryId: catSoups.id, imageUrl: IMG.egusi, ingredients: ["Egusi", "Spinach", "Crayfish", "Stockfish", "Assorted meat", "Yam"], spiceLevel: 2, isFeatured: true, tags: ["popular"], options: [{ groupName: "Swallow", optionName: "Pounded yam", priceModifier: 0, isDefault: true }, { groupName: "Swallow", optionName: "Eba (garri)", priceModifier: 0 }, { groupName: "Swallow", optionName: "Fufu", priceModifier: 0 }, { groupName: "Swallow", optionName: "Wheat", priceModifier: 200 }] },
    { name: "Okro Soup & Eba", slug: "okro-eba", description: "Slippery okra soup with fresh catfish, prawns and locust beans, paired with smooth eba.", price: 5200, categoryId: catSoups.id, imageUrl: IMG.okro, ingredients: ["Okra", "Catfish", "Prawns", "Locust beans", "Garri"], spiceLevel: 2, options: [{ groupName: "Swallow", optionName: "Eba", priceModifier: 0, isDefault: true }, { groupName: "Swallow", optionName: "Pounded yam", priceModifier: 0 }] },
    { name: "Banga Soup & Starch", slug: "banga-starch", description: "Rich palm-fruit soup from the Niger Delta, served with native starch.", price: 6200, categoryId: catSoups.id, imageUrl: IMG.banga, ingredients: ["Palm fruit", "Catfish", "Banga spice", "Starch"], spiceLevel: 2, options: [] },
    { name: "Afang Soup & Fufu", slug: "afang-fufu", description: "Cross River-style afang soup with periwinkle, bushmeat and fresh vegetables.", price: 6500, categoryId: catSoups.id, imageUrl: IMG.afang, ingredients: ["Afang leaf", "Periwinkle", "Bushmeat", "Crayfish", "Fufu"], spiceLevel: 2, options: [] },

    // ── Starters ──
    { name: "Suya Platter", slug: "suya-platter", description: "Smoky beef suya skewers with pepper sauce, onions and tomatoes — grilled live over charcoal.", price: 3500, categoryId: catStarters.id, imageUrl: IMG.suya, ingredients: ["Beef", "Yaji spice", "Groundnut", "Onion", "Tomato"], spiceLevel: 3, isFeatured: true, tags: ["signature", "grilled"], options: [{ groupName: "Size", optionName: "Regular", priceModifier: 0, isDefault: true }, { groupName: "Size", optionName: "Large (2×)", priceModifier: 2500 }] },
    { name: "Puff Puff (6 pcs)", slug: "puff-puff", description: "Golden fried dough balls — lightly dusted with sugar. Perfect for sharing.", price: 1500, categoryId: catStarters.id, imageUrl: IMG.puffPuff, ingredients: ["Flour", "Yeast", "Sugar", "Nutmeg"], spiceLevel: 0, isVegetarian: true, options: [{ groupName: "Dip", optionName: "Chocolate sauce", priceModifier: 200 }, { groupName: "Dip", optionName: "Vanilla cream", priceModifier: 200 }] },
    { name: "Chin Chin (large bowl)", slug: "chin-chin", description: "Crunchy fried pastry bites — lightly spiced with nutmeg.", price: 1800, categoryId: catStarters.id, imageUrl: IMG.chinChin, ingredients: ["Flour", "Sugar", "Butter", "Nutmeg"], spiceLevel: 0, isVegetarian: true, options: [] },

    // ── Grills ──
    { name: "Grilled Whole Catfish", slug: "grilled-catfish", description: "Whole catfish grilled in foil with pepper sauce, onions and garden eggs.", price: 8500, categoryId: catGrills.id, imageUrl: IMG.suya, ingredients: ["Catfish", "Pepper sauce", "Onion", "Garden egg"], spiceLevel: 2, isFeatured: true, tags: ["popular", "grilled"], options: [{ groupName: "Style", optionName: "Peppered", priceModifier: 0, isDefault: true }, { groupName: "Style", optionName: "Azongbo (smoked)", priceModifier: 500 }] },
    { name: "Peppered Chicken", slug: "peppered-chicken", description: "Half chicken grilled and tossed in a fiery pepper sauce.", price: 5500, categoryId: catGrills.id, imageUrl: IMG.suya, ingredients: ["Chicken", "Scotch bonnet", "Onion", "Spice blend"], spiceLevel: 3, options: [{ groupName: "Cut", optionName: "Half chicken", priceModifier: 0, isDefault: true }, { groupName: "Cut", optionName: "Full chicken", priceModifier: 4500 }] },
    { name: "Beef Shawarma", slug: "beef-shawarma", description: "Spiced beef, coleslaw and cheese wrapped in a toasted pita with garlic sauce.", price: 4200, categoryId: catGrills.id, imageUrl: IMG.suya, ingredients: ["Beef", "Pita", "Coleslaw", "Cheese", "Garlic sauce"], spiceLevel: 1, options: [] },

    // ── Sides ──
    { name: "Fried Plantain (Dodo)", slug: "fried-plantain", description: "Sweet ripe plantain, fried golden and served with a pepper sauce.", price: 1800, categoryId: catSides.id, imageUrl: IMG.dodo, ingredients: ["Plantain", "Vegetable oil"], spiceLevel: 0, isVegetarian: true, options: [] },
    { name: "Plantain Chips", slug: "plantain-chips", description: "Thinly sliced and lightly salted — freshly made in-house.", price: 1200, categoryId: catSides.id, imageUrl: IMG.plantainChips, ingredients: ["Plantain", "Salt"], spiceLevel: 0, isVegetarian: true, options: [] },
    { name: "Coleslaw", slug: "coleslaw", description: "Crisp cabbage and carrot in a creamy dressing.", price: 800, categoryId: catSides.id, imageUrl: IMG.friedRiceVeg, ingredients: ["Cabbage", "Carrot", "Mayo"], spiceLevel: 0, isVegetarian: true, options: [] },
    { name: "Extra Jollof Rice", slug: "extra-jollof", description: "An extra portion of our signature party jollof.", price: 2500, categoryId: catSides.id, imageUrl: IMG.jollofClassic, ingredients: ["Rice", "Tomato", "Scotch bonnet"], spiceLevel: 1, isVegetarian: true, options: [] },

    // ── Drinks ──
    { name: "Mango Smoothie", slug: "mango-smoothie", description: "Fresh mango blended with a hint of lime and ginger.", price: 2200, categoryId: catDrinks.id, imageUrl: IMG.mangoSmoothie, ingredients: ["Mango", "Lime", "Ginger"], spiceLevel: 0, isVegetarian: true, options: [] },
    { name: "Pineapple Smoothie", slug: "pineapple-smoothie", description: "Sweet pineapple blended with a touch of mint.", price: 2200, categoryId: catDrinks.id, imageUrl: IMG.pineapple, ingredients: ["Pineapple", "Mint"], spiceLevel: 0, isVegetarian: true, options: [] },
    { name: "Strawberry Banana Smoothie", slug: "strawberry-banana", description: "Strawberries and ripe banana blended until silky smooth.", price: 2500, categoryId: catDrinks.id, imageUrl: IMG.bananaSmoothie, ingredients: ["Strawberry", "Banana", "Yoghurt"], spiceLevel: 0, isVegetarian: true, options: [] },
    { name: "Chapman Cocktail", slug: "chapman", description: "A refreshing non-alcoholic blend of Fanta, Sprite, Angostura bitters and grenadine.", price: 2800, categoryId: catDrinks.id, imageUrl: IMG.drink1, ingredients: ["Fanta", "Sprite", "Angostura bitters", "Grenadine", "Cucumber"], spiceLevel: 0, isVegetarian: true, options: [] },

    // ── Desserts ──
    { name: "Chocolate Brownie", slug: "chocolate-brownie", description: "Warm, fudgy chocolate brownie served with a scoop of vanilla ice cream.", price: 2800, categoryId: catDesserts.id, imageUrl: IMG.brownie, ingredients: ["Chocolate", "Butter", "Flour", "Egg", "Sugar"], spiceLevel: 0, isVegetarian: true, isFeatured: true, options: [{ groupName: "Add-on", optionName: "Extra ice cream", priceModifier: 500 }, { groupName: "Add-on", optionName: "Whipped cream", priceModifier: 300 }] },
    { name: "Brownie Sundae", slug: "brownie-sundae", description: "Chocolate brownie topped with ice cream, chocolate sauce and crushed nuts.", price: 3500, categoryId: catDesserts.id, imageUrl: IMG.brownieSundae, ingredients: ["Brownie", "Ice cream", "Chocolate sauce", "Peanuts"], spiceLevel: 0, isVegetarian: true, options: [] },
  ];

  const createdItems: Array<{ id: string; name: string; slug: string; categoryId: string; price: Prisma.Decimal }> = [];

  for (const item of itemsData) {
    const { options, ...data } = item;
    const local = localImage("menu", item.slug);
    const created = await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: { ...data, imageUrl: local ?? data.imageUrl, price: dec(data.price) },
      create: { ...data, imageUrl: local ?? data.imageUrl, price: dec(data.price) },
    });
    // Upsert options
    if (options) {
      for (const opt of options) {
        const existing = await prisma.menuItemOption.findFirst({ where: { menuItemId: created.id, groupName: opt.groupName, optionName: opt.optionName } });
        if (existing) {
          await prisma.menuItemOption.update({ where: { id: existing.id }, data: { priceModifier: dec(opt.priceModifier), isDefault: opt.isDefault ?? false } });
        } else {
          await prisma.menuItemOption.create({ data: { menuItemId: created.id, ...opt, priceModifier: dec(opt.priceModifier) } });
        }
      }
    }
    createdItems.push({ id: created.id, name: created.name, slug: created.slug, categoryId: created.categoryId, price: created.price });
  }

  console.log("  ✓ Menu items created");

  /* ── Gallery ───────────────────────────────────────────────────────────────── */

  const galleryData = [
    { title: "Elegant dining room", category: GalleryCategory.RESTAURANT, imageUrl: IMG.interior1, alt: "Warm lighting over wooden tables", ordering: 1 },
    { title: "Open kitchen pass", category: GalleryCategory.BEHIND_THE_SCENES, imageUrl: IMG.chef1, alt: "Chef plating a dish with precision", ordering: 2 },
    { title: "Jollof Rice & Chicken", category: GalleryCategory.FOOD, imageUrl: IMG.jollofChicken, alt: "Plate of smoky jollof rice with grilled chicken", ordering: 3 },
    { title: "Grilled catfish platter", category: GalleryCategory.FOOD, imageUrl: IMG.foodPlate2, alt: "Whole grilled catfish on a black plate", ordering: 4 },
    { title: "Suya night atmosphere", category: GalleryCategory.EVENTS, imageUrl: IMG.interior2, alt: "Guests enjoying suya at the outdoor grill", ordering: 5 },
    { title: "Plated fine dining dish", category: GalleryCategory.FOOD, imageUrl: IMG.foodPlate1, alt: "Elegantly plated dish with garnish", ordering: 6 },
    { title: "Our team in action", category: GalleryCategory.PEOPLE, imageUrl: IMG.team1, alt: "Kitchen team working during evening service", ordering: 7 },
    { title: "Beautifully plated salad", category: GalleryCategory.FOOD, imageUrl: IMG.foodPlate3, alt: "Fresh salad with vibrant colours", ordering: 8 },
  ];

  for (const g of galleryData) {
    const local = localImage("gallery", g.title);
    await prisma.galleryImage.create({ data: { ...g, imageUrl: local ?? g.imageUrl } });
  }

  console.log("  ✓ Gallery images created");

  /* ── Coupons ───────────────────────────────────────────────────────────────── */

  const couponData = [
    { code: "WELCOME15", discountType: CouponType.PERCENTAGE, discountValue: dec(15), expiryDate: new Date("2027-12-31"), minOrderValue: dec(3000), usageLimit: 500, active: true },
    { code: "FREEDELIVERY", discountType: CouponType.FREE_DELIVERY, discountValue: dec(0), expiryDate: new Date("2026-12-31"), minOrderValue: dec(5000), usageLimit: 200, active: true },
    { code: "FLAT500", discountType: CouponType.FIXED, discountValue: dec(500), expiryDate: new Date("2027-06-30"), minOrderValue: dec(3500), usageLimit: 100, active: true },
    { code: "PARTY20", discountType: CouponType.PERCENTAGE, discountValue: dec(20), expiryDate: new Date("2026-08-31"), minOrderValue: dec(10000), usageLimit: 50, active: false },
  ];

  for (const c of couponData) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: c, create: c });
  }

  console.log("  ✓ Coupons created");

  /* ── Restaurant settings ───────────────────────────────────────────────────── */

  const settingsData: Record<string, string> = {
    restaurant_name: "Chow Heaven",
    address: "42 Market Street, Lagos Island, Lagos, Nigeria",
    phone: "+234 803 555 0199",
    email: "hello@chowheaven.ng",
    hours: "Mon – Sun, 11am – 11pm",
    delivery_fee: "500",
    free_delivery_min_order: "5000",
    currency: "NGN",
    social_instagram: "https://instagram.com/chowheaven",
    social_tiktok: "https://tiktok.com/@chowheaven",
    social_twitter: "https://x.com/chowheaven",
  };

  for (const [key, value] of Object.entries(settingsData)) {
    await prisma.restaurantSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  console.log("  ✓ Restaurant settings created");

  /* ── Sample orders ─────────────────────────────────────────────────────────── */

  // Helper to create a realistic order with payment
  async function createOrder(userId: string, items: Array<{ id: string; qty: number; price: number }>, status: OrderStatus, paymentStatus: PaymentStatus, daysOld: number, orderType: "DELIVERY" | "PICKUP" = "DELIVERY") {
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
    const deliveryFee = orderType === "DELIVERY" ? 500 : 0;
    const total = subtotal + deliveryFee;

    const order = await prisma.order.create({
      data: {
        userId,
        orderType,
        status,
        customerName: (await prisma.user.findUnique({ where: { id: userId } }))?.fullName ?? "Guest",
        customerPhone: (await prisma.user.findUnique({ where: { id: userId } }))?.phone ?? "+234 800 000 0000",
        customerEmail: (await prisma.user.findUnique({ where: { id: userId } }))?.email,
        addressId: orderType === "DELIVERY" ? (userId === customer.id ? addr1.id : null) : null,
        addressText: orderType === "DELIVERY" ? "15 Admiralty Way, Lekki Phase 1, Lagos" : null,
        subtotal: dec(subtotal),
        deliveryFee: dec(deliveryFee),
        discount: dec(0),
        total: dec(total),
        statusHistory: JSON.stringify([{ status, at: daysAgo(daysOld).toISOString(), msg: "Order placed" }]),
        createdAt: daysAgo(daysOld),
        items: {
          create: items.map((i) => ({
            menuItemId: i.id,
            name: createdItems.find((ci) => ci.id === i.id)?.name ?? "Item",
            categoryName: "Menu",
            price: dec(i.price),
            quantity: i.qty,
          })),
        },
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: dec(total),
        status: paymentStatus,
        provider: "DEMO",
        method: "card",
        reference: `ref_${order.id.slice(-8)}`,
        createdAt: daysAgo(daysOld),
      },
    });

    return order;
  }

  const jollofChicken = createdItems.find((i) => i.slug === "party-jollof")!;
  const egusi = createdItems.find((i) => i.slug === "egusi-pounded-yam")!;
  const suya = createdItems.find((i) => i.slug === "suya-platter")!;
  const catfish = createdItems.find((i) => i.slug === "grilled-catfish")!;
  const friedRice = createdItems.find((i) => i.slug === "special-fried-rice")!;
  const puffPuff = createdItems.find((i) => i.slug === "puff-puff")!;
  const brownie = createdItems.find((i) => i.slug === "chocolate-brownie")!;
  const mangoSmoothie = createdItems.find((i) => i.slug === "mango-smoothie")!;
  const dodo = createdItems.find((i) => i.slug === "fried-plantain")!;

  // Past orders for Chiamaka
  const o1 = await createOrder(customer.id, [{ id: jollofChicken.id, qty: 2, price: 4500 }, { id: puffPuff.id, qty: 1, price: 1500 }], "DELIVERED", "SUCCESSFUL", 12);
  const o2 = await createOrder(customer.id, [{ id: egusi.id, qty: 1, price: 5800 }, { id: dodo.id, qty: 1, price: 1800 }], "DELIVERED", "SUCCESSFUL", 5);
  const o3 = await createOrder(customer.id, [{ id: suya.id, qty: 1, price: 3500 }, { id: mangoSmoothie.id, qty: 2, price: 2200 }], "DELIVERED", "SUCCESSFUL", 3);
  const o4 = await createOrder(customer.id, [{ id: catfish.id, qty: 1, price: 8500 }, { id: friedRice.id, qty: 1, price: 4800 }], "PREPARING", "SUCCESSFUL", 0);

  // Past order for Fatima
  await createOrder(customer2.id, [{ id: jollofChicken.id, qty: 1, price: 4200 }, { id: mangoSmoothie.id, qty: 1, price: 2200 }], "DELIVERED", "SUCCESSFUL", 7);

  // Past order for Tunde
  const o6 = await createOrder(customer3.id, [{ id: catfish.id, qty: 1, price: 8500 }], "DELIVERED", "SUCCESSFUL", 4);
  const o7 = await createOrder(customer3.id, [{ id: egusi.id, qty: 2, price: 5800 }], "DELIVERED", "SUCCESSFUL", 1);

  console.log("  ✓ Sample orders created");

  /* ── Reviews ───────────────────────────────────────────────────────────────── */

  const reviewData = [
    { userId: customer.id, orderId: o1.id, rating: 5, comment: "That party jollof is exactly what I grew up eating at my grandmother's house. Absolutely incredible — the smoky flavour is unreal.", customerName: "Chiamaka Eze", approved: true },
    { userId: customer.id, orderId: o2.id, rating: 5, comment: "The egusi soup is rich, hearty and full of flavour. Pounded yam was soft and perfectly cooked. Will definitely order again.", customerName: "Chiamaka Eze", approved: true },
    { userId: customer2.id, orderId: null, rating: 4, comment: "Great food and fast delivery. The suya platter was generous and the pepper sauce was just right. Small chop could have been a bit warmer.", customerName: "Fatima Abubakar", approved: true },
    { userId: customer3.id, orderId: o6.id, rating: 5, comment: "The grilled catfish is the best I've had in Lagos. Peppered style with garden eggs — perfection. Five stars.", customerName: "Tunde Williams", approved: true },
    { userId: customer3.id, orderId: o7.id, rating: 4, comment: "Really enjoyed the egusi and fufu combo. Service was friendly and delivery was on time. Will try the suya next.", customerName: "Tunde Williams", approved: false },
  ];

  for (const r of reviewData) {
    const exists = await prisma.review.findFirst({ where: { userId: r.userId, orderId: r.orderId } });
    if (!exists) {
      await prisma.review.create({ data: r });
    }
  }

  console.log("  ✓ Reviews created");

  /* ── Favorites ─────────────────────────────────────────────────────────────── */

  const favSlugs = ["party-jollof", "egusi-pounded-yam", "suya-platter", "chocolate-brownie"];
  for (const slug of favSlugs) {
    const item = createdItems.find((i) => i.slug === slug);
    if (item) {
      await prisma.favorite.upsert({
        where: { userId_menuItemId: { userId: customer.id, menuItemId: item.id } },
        update: {},
        create: { userId: customer.id, menuItemId: item.id },
      });
    }
  }

  console.log("  ✓ Favorites created");

  /* ── Reservations ──────────────────────────────────────────────────────────── */

  const reservationData = [
    { userId: customer.id, name: "Chiamaka Eze", phone: "+234 803 456 7890", email: "chiamaka@example.com", date: new Date(), time: "19:00", guests: 4, occasion: Occasion.ANNIVERSARY as Occasion, specialRequest: "Window seat if possible, and a cake for dessert.", status: ReservationStatus.CONFIRMED as ReservationStatus },
    { userId: customer2.id, name: "Fatima Abubakar", phone: "+234 804 567 8901", email: "fatima@example.com", date: new Date(Date.now() + 3 * 86400000), time: "18:30", guests: 2, occasion: Occasion.BUSINESS as Occasion, status: ReservationStatus.PENDING as ReservationStatus },
    { userId: customer3.id, name: "Tunde Williams", phone: "+234 805 678 9012", email: "tunde@example.com", date: new Date(Date.now() + 7 * 86400000), time: "20:00", guests: 6, occasion: Occasion.BIRTHDAY as Occasion, specialRequest: "Surprise cake for my wife — please keep it a secret!", status: ReservationStatus.CONFIRMED as ReservationStatus },
    { userId: null, name: "Guest User", phone: "+234 806 789 0123", email: null, date: new Date(Date.now() - 5 * 86400000), time: "19:30", guests: 8, occasion: Occasion.FAMILY_DINNER as Occasion, status: ReservationStatus.COMPLETED as ReservationStatus },
  ];

  for (const r of reservationData) {
    await prisma.reservation.create({ data: r });
  }

  console.log("  ✓ Reservations created");

  /* ── Done ──────────────────────────────────────────────────────────────────── */

  console.log("\n✅  Seed complete — Chow Heaven is ready.\n");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());