/**
 * apply-images.ts
 *
 * Scans public/images/** for photos, matches them to menu items / categories / gallery
 * records by filename slug, and updates imageUrl in the DB.
 *
 * Drop photos anywhere under public/images (menu/, categories/, gallery/, inbox/, ...).
 * File naming convention: use the item's slug, e.g.
 *   public/images/inbox/party-jollof.jpg
 *   public/images/inbox/jollof-rice.jpg       (category)
 *   public/images/inbox/elegant-dining-room.jpg (gallery)
 *
 * Run: npx tsx scripts/apply-images.ts
 */

import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const ROOT = path.resolve(__dirname, "..", "public", "images");
const EXT = /\.(jpe?g|png|webp|gif|avif)$/i;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function collectFiles(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) collectFiles(full, out);
    else if (EXT.test(name)) out.push(full);
  }
  return out;
}

function toPublicUrl(absPath: string): string {
  const rel = path.relative(path.resolve(__dirname, "..", "public"), absPath);
  return "/" + rel.split(path.sep).join("/");
}

async function main() {
  const files = collectFiles(ROOT);

  // Map: normalised-filename-slug -> absolute path (first occurrence wins)
  const bySlug = new Map<string, string>();
  for (const f of files) {
    const base = slugify(path.basename(f).replace(EXT, ""));
    if (!base || base === ".gitkeep") continue;
    if (!bySlug.has(base)) bySlug.set(base, f);
  }

  console.log(`Found ${files.length} image file(s) under public/images/\n`);

  const applied: Array<{ area: string; slug: string; file: string; url: string }> = [];
  const unmatched: Array<{ area: string; slug: string; name: string }> = [];
  const unmatchedFiles: string[] = [];

  /* ── Menu items ──────────────────────────────────────────────────────────── */

  const items = await prisma.menuItem.findMany({
    select: { id: true, slug: true, name: true },
    orderBy: { createdAt: "asc" },
  });

  const usedSlugs = new Set<string>();

  for (const it of items) {
    const file = bySlug.get(it.slug);
    if (file) {
      const url = toPublicUrl(file);
      await prisma.menuItem.update({ where: { id: it.id }, data: { imageUrl: url } });
      applied.push({ area: "menu", slug: it.slug, file: path.relative(ROOT, file), url });
      usedSlugs.add(it.slug);
    } else {
      unmatched.push({ area: "menu", slug: it.slug, name: it.name });
    }
  }

  /* ── Categories ──────────────────────────────────────────────────────────── */

  const cats = await prisma.menuCategory.findMany({
    select: { id: true, slug: true, name: true },
  });

  for (const c of cats) {
    const file = bySlug.get(c.slug);
    if (file) {
      const url = toPublicUrl(file);
      await prisma.menuCategory.update({ where: { id: c.id }, data: { imageUrl: url } });
      applied.push({ area: "category", slug: c.slug, file: path.relative(ROOT, file), url });
      usedSlugs.add(c.slug);
    } else {
      unmatched.push({ area: "category", slug: c.slug, name: c.name });
    }
  }

  /* ── Gallery ─────────────────────────────────────────────────────────────── */

  const gallery = await prisma.galleryImage.findMany({
    select: { id: true, title: true, category: true, ordering: true },
    orderBy: { ordering: "asc" },
  });

  for (const g of gallery) {
    const titleSlug = slugify(g.title);
    const file = bySlug.get(titleSlug);
    if (file) {
      const url = toPublicUrl(file);
      await prisma.galleryImage.update({ where: { id: g.id }, data: { imageUrl: url } });
      applied.push({ area: "gallery", slug: titleSlug, file: path.relative(ROOT, file), url });
      usedSlugs.add(titleSlug);
    } else {
      unmatched.push({ area: "gallery", slug: titleSlug, name: g.title });
    }
  }

  /* ── Find files that didn't match anything ───────────────────────────────── */

  for (const [slug, filePath] of bySlug) {
    if (!usedSlugs.has(slug)) {
      unmatchedFiles.push(path.relative(ROOT, filePath));
    }
  }

  /* ── Report ──────────────────────────────────────────────────────────────── */

  if (applied.length) {
    console.log("✅ Applied:");
    for (const a of applied) {
      console.log(`   [${a.area}] ${a.slug} ← ${a.file}`);
    }
    console.log();
  }

  if (unmatched.length) {
    console.log("⏳ Still needed (drop these files into public/images/):");
    for (const m of unmatched) {
      const ext = m.area === "category" ? ".jpg" : ".jpg";
      console.log(`   [${m.area}] ${m.slug}${ext}  —  ${m.name}`);
    }
    console.log();
  }

  if (unmatchedFiles.length) {
    console.log("⚠️  Unrecognised files (not matched to any menu/category/gallery):");
    for (const f of unmatchedFiles) {
      console.log(`   ${f}`);
    }
    console.log();
  }

  if (!applied.length && !unmatched.length && !unmatchedFiles.length) {
    console.log("No images found and no records to update. Drop photos into public/images/inbox/ first.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
