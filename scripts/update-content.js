#!/usr/bin/env node
/**
 * update-content.js
 *
 * Helper functions Claude calls to update site content without the user
 * touching any HTML or CSS.
 *
 * Usage (Claude calls these directly, you just describe the change):
 *   node scripts/update-content.js updateField home name "Maxwell Fleming"
 *   node scripts/update-content.js updateLink home 0 label "Ring me"
 *   node scripts/update-content.js addLink home '{"icon":"🌐","label":"Website",...}'
 *   node scripts/update-content.js removeLink home 2
 *   node scripts/update-content.js addMood home "Riding the chaos with dignity."
 */

const fs   = require('fs');
const path = require('path');

const CONTENT_DIR = path.join(__dirname, '..', 'content');

// ── Helpers ───────────────────────────────────────────────────────────────────

function readContent(pageSlug) {
  const base = path.resolve(CONTENT_DIR);
  const target = path.resolve(base, `${pageSlug}.json`);
  const relative = path.relative(base, target);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Invalid path');
  if (!fs.existsSync(target)) throw new Error(`Content file not found: ${target}`);
  return JSON.parse(fs.readFileSync(target, 'utf8'));
}

function writeContent(pageSlug, data) {
  const file = path.join(CONTENT_DIR, `${pageSlug}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
  console.log(`✅  Saved ${file}`);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Update a top-level string field on a page.
 * Supports dot-notation for nested fields: "sections.links.title"
 *
 * Example: updateField('home', 'subtitle', 'New subtitle here')
 */
function updateField(pageSlug, fieldPath, newValue) {
  const data   = readContent(pageSlug);
  const parts  = fieldPath.split('.');
  let   target = data;
  for (let i = 0; i < parts.length - 1; i++) {
    if (target[parts[i]] === undefined) throw new Error(`Path not found: ${fieldPath}`);
    target = target[parts[i]];
  }
  const lastKey = parts[parts.length - 1];
  const oldVal  = target[lastKey];
  target[lastKey] = newValue;
  writeContent(pageSlug, data);
  console.log(`  ${fieldPath}: "${oldVal}" → "${newValue}"`);
}

/**
 * Replace all copy on a page (bulk update).
 * newCopy is a partial object — only the keys provided are updated.
 *
 * Example: updatePageContent('home', { subtitle: '...', tagline: '...' })
 */
function updatePageContent(pageSlug, newCopy) {
  const data = readContent(pageSlug);
  Object.assign(data, newCopy);
  writeContent(pageSlug, data);
}

/**
 * Update a specific link in the links array by index.
 * Only the provided fields are changed.
 *
 * Example: updateLink('home', 0, { label: 'Ring me', description: 'Call anytime' })
 */
function updateLink(pageSlug, index, fields) {
  const data = readContent(pageSlug);
  if (!Array.isArray(data.links)) throw new Error('No links array found');
  if (index < 0 || index >= data.links.length)
    throw new Error(`Link index ${index} out of range (0–${data.links.length - 1})`);
  Object.assign(data.links[index], fields);
  writeContent(pageSlug, data);
  console.log(`  Updated link[${index}]:`, data.links[index]);
}

/**
 * Add a new link to the links array.
 *
 * Example: addLink('home', { icon: '🌐', label: 'Website', description: 'My site',
 *                             href: 'https://example.com', arrow: '↗', external: true })
 */
function addLink(pageSlug, linkObj) {
  const data = readContent(pageSlug);
  if (!Array.isArray(data.links)) data.links = [];
  data.links.push(linkObj);
  writeContent(pageSlug, data);
  console.log(`  Added link: ${linkObj.label}`);
}

/**
 * Remove a link by index.
 *
 * Example: removeLink('home', 3)
 */
function removeLink(pageSlug, index) {
  const data = readContent(pageSlug);
  if (!Array.isArray(data.links)) throw new Error('No links array found');
  const [removed] = data.links.splice(index, 1);
  writeContent(pageSlug, data);
  console.log(`  Removed link[${index}]: ${removed.label}`);
}

/**
 * Add a mood string to the random mood list.
 *
 * Example: addMood('home', 'Professionally caffeinated.')
 */
function addMood(pageSlug, moodText) {
  const data = readContent(pageSlug);
  if (!Array.isArray(data.moods)) data.moods = [];
  data.moods.push(moodText);
  writeContent(pageSlug, data);
  console.log(`  Added mood: "${moodText}"`);
}

/**
 * Replace the entire moods array.
 */
function setMoods(pageSlug, moodsArray) {
  const data = readContent(pageSlug);
  data.moods = moodsArray;
  writeContent(pageSlug, data);
}

/**
 * Add an image reference to a page's images list (for future use).
 * The actual image file should be placed in assets/images/ first.
 */
function addImage(pageSlug, imageObj) {
  // imageObj: { key: 'avatar', path: '/assets/images/avatar.jpg', alt: 'Maxwell' }
  const data = readContent(pageSlug);
  if (!data.images) data.images = {};
  data.images[imageObj.key] = { path: imageObj.path, alt: imageObj.alt || '' };
  writeContent(pageSlug, data);
  console.log(`  Registered image "${imageObj.key}": ${imageObj.path}`);
}

// ── CLI entry point ───────────────────────────────────────────────────────────

if (require.main === module) {
  const [,, fn, ...args] = process.argv;
  const fns = { updateField, updatePageContent, updateLink, addLink,
                removeLink, addMood, setMoods, addImage };
  if (!fn || !fns[fn]) {
    console.log('Available functions:', Object.keys(fns).join(', '));
    process.exit(0);
  }
  // Parse JSON args where appropriate
  const parsed = args.map(a => { try { return JSON.parse(a); } catch { return a; } });
  fns[fn](...parsed);
}

module.exports = { updateField, updatePageContent, updateLink, addLink,
                   removeLink, addMood, setMoods, addImage, readContent, writeContent };
