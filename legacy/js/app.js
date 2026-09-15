/* ============================================================================
   Chow Heaven — single-file app (data + store + order engine + UI)
   ========================================================================== */

/* ============================ Data ============================ */
// Categories: Fried Rice, Jollof Rice, Smoothies, Desserts

const MENU = [
  // ---- Fried Rice ----
  { id: 'fr1', cat: 'Fried Rice',   name: 'Chicken Fried Rice',  emoji: '🍛', price: 4500, desc: 'Wok-tossed rice, tender chicken, sweet peppers & egg.', tags: ['spicy', 'popular'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Fried_rice_with_chicken_%2817234644521%29.jpg/960px-Fried_rice_with_chicken_%2817234644521%29.jpg' },
  { id: 'fr2', cat: 'Fried Rice',   name: 'Special Chow Rice',   emoji: '🍤', price: 6000, desc: 'Prawns, chicken, beef & egg in our signature sauce.', tags: ['signature'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Yangzhou_fried_rice_and_drinks_06-09-2019.jpg/500px-Yangzhou_fried_rice_and_drinks_06-09-2019.jpg' },
  { id: 'fr3', cat: 'Fried Rice',   name: 'Veggie Fried Rice',   emoji: '🥦', price: 4000, desc: 'Garden veg, mushrooms, egg fried with sesame oil.', tags: ['veg'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Vegetable_Fried_Rice.jpg/960px-Vegetable_Fried_Rice.jpg' },
  { id: 'fr4', cat: 'Fried Rice',   name: 'Beef Fried Rice',     emoji: '🥩', price: 5000, desc: 'Succulent beef strips, caramelised onions & rice.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Cumin_beef_fried_rice.jpg/960px-Cumin_beef_fried_rice.jpg' },

  // ---- Jollof Rice ----
  { id: 'jr1', cat: 'Jollof Rice',  name: 'Classic Jollof Rice', emoji: '🍚', price: 4000, desc: 'Smoky party jollof, slowly simmered to perfection.', tags: ['popular'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Jollof_rice_and_tomato_stew.jpg/960px-Jollof_rice_and_tomato_stew.jpg' },
  { id: 'jr2', cat: 'Jollof Rice',  name: 'Jollof & Grilled Chicken', emoji: '🍗', price: 6000, desc: 'Jollof served with flame-grilled chicken & plantain.', tags: ['signature'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/A_plate_of_jollof_rice_and_chicken.jpg/960px-A_plate_of_jollof_rice_and_chicken.jpg' },
  { id: 'jr3', cat: 'Jollof Rice',  name: 'Jollof & Fried Plantain', emoji: '🍌', price: 4800, desc: 'Sweet fried plantains alongside rich jollof rice.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Jollof_Rice_and_fried_plantain_with_diced-beef_sauce_and_cucumber.jpg/960px-Jollof_Rice_and_fried_plantain_with_diced-beef_sauce_and_cucumber.jpg' },
  { id: 'jr4', cat: 'Jollof Rice',  name: 'Spicy Pepper Jollof', emoji: '🌶️', price: 4500, desc: 'Our house pepper sauce swirled into the rice. Bold heat.', tags: ['spicy'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Spicy_jollof_rice_and_fried_beef.jpg/500px-Spicy_jollof_rice_and_fried_beef.jpg' },

  // ---- Smoothies ----
  { id: 'sm1', cat: 'Smoothies',    name: 'Mango Smoothie',      emoji: '🥭', price: 2500, desc: 'Blended ripe mango, banana & yoghurt.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Fresh-mango-smoothie_01.jpg/960px-Fresh-mango-smoothie_01.jpg' },
  { id: 'sm2', cat: 'Smoothies',    name: 'Pineapple Fizz',      emoji: '🍍', price: 2500, desc: 'Pineapple, citrus & crushed ice. Fresh & zingy.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Batido_de_pi%C3%B1a.jpg/960px-Batido_de_pi%C3%B1a.jpg' },
  { id: 'sm3', cat: 'Smoothies',    name: 'Strawberry Banana',   emoji: '🍓', price: 2800, desc: 'Strawberries, banana & oat milk.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Banana_and_strawberry_smoothie.jpg/500px-Banana_and_strawberry_smoothie.jpg' },
  { id: 'sm4', cat: 'Smoothies',    name: 'Avocado Power',       emoji: '🥑', price: 3000, desc: 'Avocado, honey & milk. Thick and creamy.', tags: ['veg'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Avocado%2C_milk%2C_condensed_milk_and_ice_smoothies_-_Amazing_Chef_food_processor.jpg/960px-Avocado%2C_milk%2C_condensed_milk_and_ice_smoothies_-_Amazing_Chef_food_processor.jpg' },

  // ---- Desserts ----
  { id: 'ds1', cat: 'Desserts',     name: 'Fudgy Brownie',       emoji: '🍫', price: 1800, desc: 'Warm, gooey chocolate brownie. Pure bliss.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Brownie_IMG_001.jpg/960px-Brownie_IMG_001.jpg' },
  { id: 'ds2', cat: 'Desserts',     name: 'Glazed Donut',        emoji: '🍩', price: 1200, desc: 'Soft ring donut with glossy sugar glaze.', tags: [], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Round_Rock_Glazed_Donuts.jpg/960px-Round_Rock_Glazed_Donuts.jpg' },
  { id: 'ds3', cat: 'Desserts',     name: 'Fried Plantains',     emoji: '🍌', price: 2000, desc: 'Caramelised dodo, golden and sweet.', tags: ['popular'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Dodo_fried.jpg/500px-Dodo_fried.jpg' },
  { id: 'ds4', cat: 'Desserts',     name: 'Brownie Sundae',      emoji: '🍨', price: 3200, desc: 'Brownie, vanilla ice cream & caramel drizzle.', tags: ['signature'], img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/BROWNIE_SUNDAE.jpg/960px-BROWNIE_SUNDAE.jpg' },
];

const CATEGORIES = ['Fried Rice', 'Jollof Rice', 'Smoothies', 'Desserts'];

const BUSINESS = {
  name: 'Chow Heaven',
  tagline: 'Fresh • Flavorful • Delicious',
  address: '42 Market Street, Lagos Island',
  phone: '+234 803 555 0199',
  hours: 'Open Daily 11am – 10pm',
};

const PROMOS = {
  CHOW10: { code: 'CHOW10', pct: 10, label: '10% off your order' },
  WELCOME: { code: 'WELCOME', flat: 1000, label: '₦1,000 off' },
  FREEDEL: { code: 'FREEDEL', freeDel: true, label: 'Free delivery' },
};

const DELIVERY_FEE = 1200;

const getItem = (id) => MENU.find((m) => m.id === id);
const fmt = (n) => '₦' + Number(n).toLocaleString('en-NG');

/* ============================ Store ============================ */

// Prefer the WebSim realtime socket when running on the WebSim platform.
// If it can't be loaded (local file, offline, blocked network, or no importmap),
// fall back to an in-memory store so the app still boots and the demo works
// end-to-end for the current session.
let room = null;

function createLocalStore() {
  const tables = new Map();
  const subs = new Map();
  const table = (name) => {
    if (!tables.has(name)) tables.set(name, new Map());
    return tables.get(name);
  };
  const matches = (rec, crit) => Object.entries(crit || {}).every(([k, v]) => rec[k] === v);
  const notify = (name) => {
    const list = subs.get(name);
    if (!list) return;
    list.slice().forEach(({ criteria, cb }) => {
      cb([...table(name).values()].filter((r) => matches(r, criteria)));
    });
  };
  return {
    collection(name) {
      return {
        upsert: async (rec) => {
          const t = table(name);
          if (rec.id == null) rec.id = 'loc_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
          const merged = { ...(t.get(rec.id) || {}), ...rec };
          t.set(rec.id, merged);
          notify(name);
          return merged;
        },
        delete: async (id) => {
          table(name).delete(id);
          notify(name);
        },
        filter(criteria) {
          return {
            getList: async () => [...table(name).values()].filter((r) => matches(r, criteria)),
            subscribe(cb) {
              if (!subs.has(name)) subs.set(name, []);
              subs.get(name).push({ criteria, cb });
              cb([...table(name).values()].filter((r) => matches(r, criteria)));
              return () => {
                subs.set(name, (subs.get(name) || []).filter((s) => s.cb !== cb));
              };
            },
          };
        },
      };
    },
  };
}

async function initRoom() {
  if (room) return room;
  try {
    const { WebsimSocket } = await import('@websim/websim-socket');
    room = new WebsimSocket();
  } catch (e) {
    room = createLocalStore();
  }
  return room;
}

let currentUser = null;
let profile = null;

async function initStore() {
  try {
    currentUser = await window.websim.getCurrentUser();
  } catch (e) {
    currentUser = null;
  }
  if (currentUser) {
    profile = (await loadProfile()) || null;
  }
  return currentUser;
}

function getUser() { return currentUser; }
function getProfile() { return profile; }

/* ---------------- Auth / Profile ---------------- */

async function loadProfile() {
  if (!currentUser) return null;
  try {
    const list = await room.collection('profile').filter({ id: currentUser.id }).getList();
    return list[0] || null;
  } catch (e) { return null; }
}

function isLoggedIn() {
  try { return !!localStorage.getItem('ch_session'); } catch (e) { return false; }
}

async function register({ email, fullName, phone, pin }) {
  if (!currentUser) throw new Error('Not signed in to platform');
  const existing = await loadProfile();
  if (existing) throw new Error('A Chow Heaven account already exists for this sign-in. Please log in.');
  const prof = {
    id: currentUser.id,
    email: email.toLowerCase(),
    fullName,
    phone,
    pin,
    addresses: [],
    points: 20,
    totalSpent: 0,
    ordersCount: 0,
    prefs: { faveItems: {} },
    createdAt: new Date().toISOString(),
  };
  await room.collection('profile').upsert(prof);
  profile = prof;
  localStorage.setItem('ch_session', currentUser.id);
  return prof;
}

async function login(email, pin) {
  if (!currentUser) throw new Error('Not signed in to platform');
  const prof = await loadProfile();
  if (!prof) throw new Error('No account found with that email. Please register.');
  if (prof.email !== email.toLowerCase() || prof.pin !== pin) throw new Error('Incorrect email or PIN.');
  profile = prof;
  localStorage.setItem('ch_session', currentUser.id);
  return prof;
}

function logout() {
  try { localStorage.removeItem('ch_session'); } catch (e) {}
  profile = null;
}

async function updateProfile(patch) {
  if (!profile || !currentUser) throw new Error('Not logged in');
  const updated = { ...profile, ...patch };
  await room.collection('profile').upsert(updated);
  profile = updated;
  return updated;
}

async function awardPoints(pts) {
  if (!profile) return;
  const p = await loadProfile();
  if (!p) return;
  const np = { ...p, points: (p.points || 0) + pts };
  await room.collection('profile').upsert(np);
  profile = np;
  return np;
}

function addAddress(address) {
  const prof = profile;
  if (!prof) return;
  prodAddress(address);
}
function prodAddress(address) {
  // placeholder kept minimal; real writes happen in app code
}

async function saveAddress(address) {
  const prof = { ...(await loadProfile()), addresses: [...(profile?.addresses || []), address] };
  await room.collection('profile').upsert(prof);
  profile = prof;
  return prof;
}

async function removeAddress(index) {
  const prof = { ...(await loadProfile()) };
  prof.addresses = prof.addresses.filter((_, i) => i !== index);
  await room.collection('profile').upsert(prof);
  profile = prof;
  return prof;
}

/* ---------------- Orders ---------------- */

async function createOrder(order) {
  const rec = {
    ...order,
    user_id: currentUser?.id || 'guest',
    status: 'confirmed',
    history: [{ status: 'confirmed', at: new Date().toISOString(), msg: 'Order received & confirmed' }],
    createdAt: new Date().toISOString(),
  };
  const created = await room.collection('order').upsert(rec);
  return created;
}

async function updateOrder(id, patch) {
  const list = await room.collection('order').filter({ id }).getList();
  const cur = list[0];
  if (!cur) throw new Error('Order not found');
  const next = { ...cur, ...patch };
  if (patch.status && patch.status !== cur.status) {
    const historyEntry = { status: patch.status, at: new Date().toISOString(), msg: patch.statusMsg || '' };
    next.history = [...(cur.history || []), historyEntry];
    delete patch.statusMsg;
  }
  await room.collection('order').upsert(next);
  return next;
}

function subscribeMyOrders(cb) {
  return room.collection('order').filter({ user_id: currentUser?.id || 'guest' }).subscribe(cb);
}
function subscribeOrder(id, cb) {
  return room.collection('order').filter({ id }).subscribe((list) => cb(list[0]));
}

async function getOrders() {
  return room.collection('order').filter({ user_id: currentUser?.id || 'guest' }).getList();
}

/* ---------------- Messages (chat) ---------------- */

async function sendMessage(orderId, text, from) {
  const rec = await room.collection('message').upsert({
    order_id: orderId,
    from: from || 'user',
    text,
    ts: new Date().toISOString(),
  });
  return rec;
}

function subscribeMessages(orderId, cb) {
  return room.collection('message').filter({ order_id: orderId }).subscribe(cb);
}

/* ---------------- Reviews ---------------- */

function subscribeReviews(orderId, cb) {
  return room.collection('review').filter({ order_id: orderId }).subscribe(cb);
}
async function submitReview(orderId, payload) {
  return room.collection('review').upsert({ ...payload, order_id: orderId, ts: new Date().toISOString(), user_id: currentUser?.id });
}

/* ---------------- Favorites ---------------- */

async function isFav(itemId) {
  if (!currentUser) return false;
  const list = await room.collection('fav').filter({ id: `${currentUser.id}-${itemId}` }).getList();
  return list.length > 0;
}
async function toggleFav(itemId) {
  if (!currentUser) return false;
  const key = `${currentUser.id}-${itemId}`;
  const existing = await isFav(itemId);
  if (existing) {
    await room.collection('fav').delete(key);
    return false;
  } else {
    await room.collection('fav').upsert({ id: key, user_id: currentUser.id, item_id: itemId });
    return true;
  }
}

function subscribeFavs(cb) {
  if (!currentUser) { cb([]); return () => {}; }
  return room.collection('fav').filter({ user_id: currentUser.id }).subscribe(cb);
}

/* ============================ Order engine ============================ */

// Order state machine (all statuses)
// Non-blocking phases auto-advance; snag/terminal phases wait for the customer.
const PHASES = [
  { status: 'confirmed',          min: 0 },
  { status: 'preparing',          min: 8 },      // "Now preparing" with ETA
  { status: 'food_not_ready',     min: 22 },     // blocking: wait ~? or cancel
  { status: 'ready_for_delivery', min: 0 },
  { status: 'out_for_delivery',   min: 30 },     // driver on the way
  { status: 'delivered',          min: 0 },      // terminal
];

const BLOCKING = new Set(['food_not_available', 'food_not_ready', 'delivered', 'cancelled']);

const ORDER_STATUS_META = {
  confirmed:          { label: 'Confirmed',      cls: 'status-confirmed',  icon: '📝' },
  preparing:          { label: 'Now preparing',  cls: 'status-preparing',  icon: '👨‍🍳' },
  food_not_available: { label: 'Issue',          cls: 'status-snag',       icon: '⚠️' },
  food_not_ready:     { label: 'Almost there',   cls: 'status-snag',       icon: '⏳' },
  ready_for_delivery: { label: 'Ready for pickup', cls: 'status-confirmed', icon: '📦' },
  out_for_delivery:   { label: 'Out for delivery', cls: 'status-out',      icon: '🛵' },
  delivered:          { label: 'Delivered',      cls: 'status-delivered',  icon: '✅' },
  cancelled:          { label: 'Cancelled',      cls: 'status-snag',       icon: '🚫' },
};

const STATUS_ORDER = ['confirmed', 'preparing', 'ready_for_delivery', 'out_for_delivery', 'delivered'];

// Per-state durations in seconds for the happy-path simulation (blocking states not auto-passed)
const DURATION = {
  confirmed: 8,
  preparing: 16,
  ready_for_delivery: 8,
  out_for_delivery: 40,
};

function isTerminal(order) {
  return order && BLOCKING.has(order.status);
}

function phaseDuration(status) {
  return DURATION[status] || 0;
}

function nextStatus(order) {
  const s = order.status;
  if (s === 'confirmed') return 'preparing';
  if (s === 'preparing') return order.snagDone ? 'ready_for_delivery' : 'food_not_ready';
  if (s === 'ready_for_delivery') return 'out_for_delivery';
  if (s === 'out_for_delivery') return 'delivered';
  return null; // blocking / terminal states
}

async function startSimulation(order) {
  // Called when an order is first created or loaded. Seeds the sim clock.
  if (!order.simPhaseStart) {
    return updateOrder(order.id, { simPhaseStart: Date.now(), etaMn: 8 });
  }
  return order;
}

// Advance an order if its current phase has elapsed. Returns updated order or null.
async function tick(order) {
  if (!order || BLOCKING.has(order.status)) return null;
  const started = order.simPhaseStart || order.createdAt ? Date.parse(order.createdAt) : Date.now();
  const elapsed = (Date.now() - started) / 1000;
  const dur = phaseDuration(order.status);
  if (elapsed < dur) return null;

  const next = nextStatus(order);
  if (!next) return null;

  const patch = {
    status: next,
    statusMsg: statusMessage(next, order),
    simPhaseStart: Date.now(),
  };
  if (next === 'food_not_ready') patch.snagDone = true;
  if (next === 'out_for_delivery') {
    patch.driver = { name: 'Tunde', etaMin: Math.max(6, Math.round(6 + Math.random() * 6)), vehicle: '🛵' };
  }
  if (next === 'preparing') patch.etaMn = updateEta(order.etaMn, 10);
  if (next === 'food_not_ready') patch.etaMn = updateEta(order.etaMn, 6);

  const updated = await updateOrder(order.id, patch);
  return updated;
}

function updateEta(current, minutes) {
  const base = current || 10;
  return Math.max(4, base - 2 + (Math.random() > 0.5 ? 0 : 2));
}

function statusMessage(status, order) {
  switch (status) {
    case 'confirmed': return 'Your order has been received and confirmed.';
    case 'preparing': return `Chef is cooking your ${order?.items?.[0]?.emoji || 'meals'} now.`;
    case 'ready_for_delivery': return 'All packed up and ready to roll!';
    case 'out_for_delivery': return 'Driver en route with your food.';
    case 'food_not_ready': return null;
    case 'food_not_available': return null;
    case 'delivered': return 'Enjoy your meal!';
    default: return '';
  }
}

// Resolutions from the snag states
async function resolveSwap(order, swapItemId) {
  // swap: replace first item with the chosen alternative
  const items = order.items.map((it, i) => (i === 0 ? { ...swapItemById(swapItemId), qty: it.qty > 0 ? it.qty : 1, note: it.note } : it));
  return updateOrder(order.id, {
    items,
    status: 'preparing',
    statusMsg: 'Swapped to your replacement — cooking now!',
    snagDone: true,
    simPhaseStart: Date.now(),
    etaMn: 12,
  });
}

async function resolveWait(order, minutes) {
  return updateOrder(order.id, {
    status: 'ready_for_delivery',
    statusMsg: 'Great — your food is almost ready, hang tight!',
    snagDone: true,
    simPhaseStart: Date.now(),
    etaMn: minutes,
  });
}

async function resolveCancel(order) {
  return updateOrder(order.id, {
    status: 'cancelled',
    statusMsg: 'Your order has been cancelled. Any paid amount will be refunded.',
    simPhaseStart: Date.now(),
  });
}

async function resolveUnavailable(order, action, swapItemId) {
  if (action === 'swap') return updateOrder(order.id, {
    items: order.items.map((it, i) => (i === 0 ? swapItemById(swapItemId) : it)),
    status: 'preparing',
    statusMsg: 'Swapped to your replacement — cooking now!',
    snagDone: true,
    simPhaseStart: Date.now(),
    etaMn: 12,
  });
  return resolveCancel(order);
}

// mark an item unavailable stock-wise whenever the AI/staff chooses
async function setItemUnavailable(order, itemId) {
  return updateOrder(order.id, {
    unavailable: itemId,
    status: 'food_not_available',
    statusMsg: `${swapItemById(itemId)?.name || 'An item'} in your order is out of stock.`,
    simPhaseStart: Date.now(),
  });
}

function swapItemById(id) {
  // look menu up lazily
  const item = window.__MENU_BY_ID && window.__MENU_BY_ID[id];
  return item
    ? { id: item.id, name: item.name, emoji: item.emoji, price: item.price, desc: item.desc, note: 'Replacement' }
    : { id, name: 'Replacement', emoji: '🍱', price: 0, note: 'Replacement' };
}

function progressPct(order) {
  const idx = STATUS_ORDER.indexOf(order?.status);
  if (idx === -1) return order?.status === 'cancelled' || order?.status === 'delivered' ? 100 : 10;
  return Math.round(((idx + 1) / STATUS_ORDER.length) * 100);
}

/* ============================ App ============================ */

window.__MENU = MENU;
window.__MENU_BY_ID = {};
MENU.forEach((m) => (window.__MENU_BY_ID[m.id] = m));

/* ---------------- Helpers / UI ---------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

function toast(msg, type = '') {
  const t = el('div', `toast ${type}`, msg);
  $('#toast-root').appendChild(t);
  setTimeout(() => { t.style.transition = 'opacity .3s, transform .3s'; t.style.opacity = '0'; t.style.transform = 'translateY(-8px)'; }, 2600);
  setTimeout(() => t.remove(), 3000);
}

let modalStack = [];
function openModal(contentEl, { title = '' } = {}) {
  const root = $('#modal-root');
  root.classList.add('open');
  root.innerHTML = '';
  const back = el('div', 'modal-backdrop');
  const box = el('div', 'modal');
  if (title) box.appendChild(el('h3', 'modal-title', title));
  box.appendChild(el('button', 'modal-close', '✕'));
  box.appendChild(contentEl);
  root.appendChild(back);
  root.appendChild(box);
  document.body.classList.add('no-scroll');
  $('.modal-close', box).onclick = closeModal;
  back.onclick = closeModal;
  modalStack.push(box);
}
function closeModal() {
  const root = $('#modal-root');
  root.classList.remove('open');
  root.innerHTML = '';
  document.body.classList.remove('no-scroll');
  modalStack = [];
  detailBox = null;
}

function shortDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
}
function esc(s) { return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])); }

function thumbHTML(m) {
  // Real photo on top; the emoji stays underneath as an instant placeholder,
  // and is revealed automatically if the photo ever fails to load.
  return `<span class="menu-emoji">${m.emoji}</span>${m.img ? `<img class="menu-img" src="${m.img}" alt="${esc(m.name)}" loading="lazy" decoding="async">` : ''}`;
}
function wireThumb(scope) {
  scope.querySelectorAll('img.menu-img').forEach((im) => im.addEventListener('error', () => im.remove()));
}

/* ---------------- Cart state ---------------- */
let cart = [];
function saveCart() { try { localStorage.setItem('ch_cart', JSON.stringify(cart)); } catch (e) {} updateCartUI(); }
function loadCart() { try { cart = JSON.parse(localStorage.getItem('ch_cart')) || []; } catch (e) { cart = []; } }
function cartCount() { return cart.reduce((a, c) => a + c.qty, 0); }
function cartSubtotal() { return cart.reduce((a, c) => a + getItem(c.id).price * c.qty, 0); }
function addToCart(id, qty = 1, note = '') {
  const existing = cart.find((c) => c.id === id && c.note === note);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty, note });
  saveCart();
  toast(`${getItem(id).emoji} ${getItem(id).name} added to cart`, 'green');
}
function setQty(id, note, qty) {
  const c = cart.find((x) => x.id === id && (x.note || '') === (note || ''));
  if (qty <= 0) { cart = cart.filter((x) => !(x.id === id && (x.note || '') === (note || ''))); }
  else if (c) c.qty = qty;
  saveCart();
  renderView();
}
function renderView() {
  if (currentView === 'orders') renderOrders();
  else if (currentView === 'account') renderAccount();
  else if (currentView === 'checkout') renderCheckout();
  else if (currentView === 'cart') renderCart();
  else if (currentView === 'purchases') renderPurchases();
  else renderMenu();
}
function updateCartUI() {
  const cc = $('#cart-count'); if (cc) cc.textContent = cartCount();
  cc.style.animation = 'none'; void cc.offsetHeight; cc.style.animation = 'pop-in .2s';
  if (window.drawCartBar) window.drawCartBar();
}

/* ---------------- Routing ---------------- */
let currentView = 'menu';
function navigate(view) {
  location.hash = `/${view}`;
}
function route() {
  const h = (location.hash || '#/menu').replace('#/', '') || 'menu';
  currentView = h.split('/')[0];
  updateNav();
  if (window.drawCartBar) window.drawCartBar();
  if (currentView === 'orders') renderOrders();
  else if (currentView === 'account') renderAccount();
  else if (currentView === 'cart') renderCart();
  else if (currentView === 'checkout') renderCheckout();
  else if (currentView === 'purchases') renderPurchases();
  else renderMenu();
}
function updateNav() {
  const map = { menu: 'Menu', orders: 'My Orders', purchases: 'Purchases', account: 'Account' };
  document.querySelectorAll('.nav-item').forEach((b) => {
    b.classList.toggle('active', b.dataset.nav === currentView);
  });
}

/* ---------------- Views ---------------- */
function renderMenu(query = '') {
  const v = $('#view');
  v.innerHTML = '';
  v.appendChild(el('div', 'view-head',
    `<h1 class="view-title">Our Menu</h1><div class="view-sub">${BUSINESS.hours} • ${BUSINESS.address}</div>`));

  // Hero — rotating food-photo slideshow
  if (window.__heroTimer) { clearInterval(window.__heroTimer); window.__heroTimer = null; }
  const HERO_SLIDES = ['fr1', 'jr2', 'sm1', 'ds4', 'ds3']
    .map((id) => getItem(id))
    .filter((m) => m && m.img);
  const hero = el('div', 'hero hero-shows');
  hero.innerHTML = `
    <div class="hero-slides">
      ${HERO_SLIDES.map((m) => `<div class="hero-slide"><img src="${m.img}" alt="${esc(m.name)}" loading="eager" decoding="async"></div>`).join('')}
    </div>
    <div class="hero-shade"></div>
    <div class="hero-content">
      <p class="hero-tagline">Fresh • Flavorful<br><span class="hero-dots">Delicious</span></p>
      <div class="hero-meta">
        <span class="hero-chip hero-open">● Open Daily 11am – 10pm</span>
        <span class="hero-chip">📍 ${BUSINESS.address}</span>
        <span class="hero-chip">📞 ${BUSINESS.phone}</span>
      </div>
    </div>
    <div class="hero-dots-ind">${HERO_SLIDES.map((_, i) => `<span class="hdot${i === 0 ? ' on' : ''}"></span>`).join('')}</div>`;
  v.appendChild(hero);

  const slides = hero.querySelectorAll('.hero-slide');
  const dots = hero.querySelectorAll('.hdot');
  slides.forEach((s) => { const im = s.querySelector('img'); if (im) im.addEventListener('error', () => s.classList.add('gone')); });
  let idx = 0;
  const advance = () => {
    slides[idx].classList.remove('active');
    dots[idx].classList.remove('on');
    let guard = slides.length;
    do { idx = (idx + 1) % slides.length; guard--; } while (guard > 0 && slides[idx].classList.contains('gone'));
    if (!slides[idx].classList.contains('gone')) {
      slides[idx].classList.add('active');
      dots[idx].classList.add('on');
    }
  };
  if (slides.length > 1) window.__heroTimer = setInterval(advance, 4000);

  // Search
  const searchWrap = el('div', 'search-wrap');
  const searchIn = el('input', 'search-input');
  searchIn.placeholder = 'What do you want to eat?';
  searchIn.setAttribute('aria-label', 'Search menu');
  searchIn.addEventListener('input', () => renderMenuGrid(searchIn.value.trim()));
  searchWrap.appendChild(searchIn);
  v.appendChild(searchWrap);

  // Category tabs
  const CAT_ICONS = { 'Fried Rice': '🍛', 'Jollof Rice': '🍚', Smoothies: '🥤', Desserts: '🍰', Favs: '⭐' };
  const tabs = el('div', 'cat-tabs');
  const allTab = el('button', 'cat-tab active', '🍽️ All');
  allTab.dataset.cat = 'All';
  tabs.appendChild(allTab);
  [...CATEGORIES, 'Favs'].forEach((c) => {
    const tab = el('button', 'cat-tab', `${CAT_ICONS[c] || '🍽️'} ${c === 'Favs' ? 'Favorites' : c}`);
    tab.dataset.cat = c;
    tabs.appendChild(tab);
  });
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('.cat-tab'); if (!t) return;
    tabs.querySelectorAll('.cat-tab').forEach((x) => x.classList.remove('active'));
    t.classList.add('active');
    currentCat = t.dataset.cat;
    renderMenuGrid(query, currentCat);
  });
  const tabsWrap = el('div', 'cat-tabs-wrap');
  tabsWrap.appendChild(tabs);
  v.appendChild(tabsWrap);

  window.__menuGrid = el('div', 'menu-grid');
  v.appendChild(window.__menuGrid);

  currentCat = 'All';
  loadFavs();
  renderMenuGrid(query, currentCat);
}

let currentCat = 'All';
let favSet = new Set();
let favSubActive = false;
async function loadFavs() {
  favSet = new Set();
  if (favSubActive) return;
  favSubActive = true;
  subscribeFavs((list) => {
    favSet = new Set((list || []).map((f) => f.item_id));
    if (window.__menuGrid) renderMenuGrid(window.__menuQuery || '', currentCat);
  });
}

function renderMenuGrid(query = '', cat = 'All') {
  if (!window.__menuGrid) return;
  window.__menuQuery = query;
  const q = query.toLowerCase();
  function hay(m) { return (m.name + ' ' + m.cat + ' ' + (m.tags || []).join(' ')).toLowerCase(); }
  let items = MENU.filter((m) => {
    if (cat === 'Favs') return favSet.has(m.id) && hay(m).includes(q);
    const inCat = cat === 'All' || m.cat === cat;
    return inCat && hay(m).includes(q);
  });
  const g = window.__menuGrid;
  g.innerHTML = '';
  if (!items.length) { g.appendChild(el('div', 'empty-state', '<div class="big">🔍</div>Nothing found. Try another search.')); return; }
  items.forEach((m, i) => {
    const fav = favSet.has(m.id);
    const card = el('div', 'menu-card');
    card.style.setProperty('--i', i);
    card.innerHTML = `
      <div class="menu-thumb">
        ${m.tags?.includes('signature') ? '<span class="menu-badge pop">★ Signature</span>' : ''}
        ${!m.tags?.includes('signature') && m.tags?.includes('popular') ? '<span class="menu-badge">🔥 Popular</span>' : ''}
        ${thumbHTML(m)}
        <button class="menu-fav ${fav ? 'on' : ''}" data-fav="${m.id}" title="Favorite">${fav ? '❤️' : '🤍'}</button>
      </div>
      <div class="menu-body">
        <span class="menu-cat">${m.cat}</span>
        <h3 class="menu-name">${m.name}</h3>
        <p class="menu-desc">${m.desc}</p>
        <div class="menu-foot">
          <span class="menu-price">${fmt(m.price)}</span>
          <button class="btn btn-primary btn-sm" data-add="${m.id}">+ Add</button>
        </div>
      </div>`;
    g.appendChild(card);
    wireThumb(card);
  });
  g.querySelectorAll('[data-add]').forEach((b) => b.addEventListener('click', () => openCustomize(b.dataset.add)));
  g.querySelectorAll('[data-fav]').forEach((b) => b.addEventListener('click', async () => {
    if (!isLoggedIn() && !getUser()) { toast('Sign in with (or create) an account to save favorites.', 'warm'); return; }
    await toggleFav(b.dataset.fav);
    loadFavs();
  }));
}

function openCustomize(id) {
  const m = getItem(id);
  const wrap = el('div', '');
  let note = '';
  wrap.innerHTML = `
    <div class="customize-img">${thumbHTML(m)}</div>
    <h2 style="font-family:var(--font-display);font-weight:400;margin:0 0 2px;font-size:26px">${m.name}</h2>
    <p style="color:var(--ink-soft);font-weight:600;margin:0 0 16px">${m.desc}</p>
    <div class="field"><label>Special request (optional)</label>
      <textarea rows="2" placeholder="e.g. extra spicy, no onion, extra sauce…">${note}</textarea></div>
    <div class="field"><label>Quantity</label>
      <div class="qty" style="border-radius:14px">
        <button data-min>−</button><span data-qty>1</span><button data-plus>+</button>
      </div></div>
    <button class="btn btn-primary btn-block" data-ok>Add to Cart — ${fmt(m.price)}</button>
  `;
  wireThumb(wrap);
  let qty = 1;
  const upd = () => { $('[data-qty]', wrap).textContent = qty; $('[data-ok]', wrap).textContent = `Add to Cart — ${fmt(m.price * qty)}`; };
  $('[data-plus]', wrap).onclick = () => { qty++; upd(); };
  $('[data-min]', wrap).onclick = () => { if (qty > 1) qty--; upd(); };
  $('[data-ok]', wrap).onclick = () => {
    note = $('textarea', wrap).value.trim();
    addToCart(id, qty, note);
    closeModal();
  };
  openModal(wrap, { title: 'Customize order' });
}

/* ---------------- Cart ---------------- */
function renderCart() {
  const v = $('#view');
  v.innerHTML = '';
  v.appendChild(el('div', 'view-head', '<h1 class="view-title">Your Cart</h1>'));
  if (!cart.length) {
    v.appendChild(el('div', 'empty-state', '<div class="big">🛒</div><h3>Your cart is empty</h3><p style="margin:0 0 18px">Looks hungry in here.</p><button class="btn btn-warm" data-nav="menu">Browse the menu</button>'));
    $('[data-nav]', v).onclick = () => navigate('menu');
    return;
  }
  const layout = el('div', 'cart-layout');
  const items = el('div', 'cart-items');
  cart.forEach((c) => {
    const m = getItem(c.id);
    const row = el('div', 'cart-row');
    row.innerHTML = `
      <span class="menu-thumb">${thumbHTML(m)}</span>
      <div class="cart-row-info">
        <span class="cart-row-name">${m.name}</span>
        ${c.note ? `<span class="cart-row-note">📝 ${esc(c.note)}</span>` : ''}
        <div class="qty" style="margin-top:6px">
          <button data-min>−</button><span>${c.qty}</span><button data-plus>+</button>
        </div>
      </div>
      <span class="cart-row-price">${fmt(m.price * c.qty)}</span>
      <button class="cart-remove" title="Remove">✕</button>`;
    wireThumb(row);
    $('[data-plus]', row).onclick = () => setQty(c.id, c.note, c.qty + 1);
    $('[data-min]', row).onclick = () => setQty(c.id, c.note, c.qty - 1);
    $('.cart-remove', row).onclick = () => setQty(c.id, c.note, 0);
    items.appendChild(row);
  });
  layout.appendChild(items);
  layout.appendChild(summaryCard(true));
  v.appendChild(layout);
}

const PAY_METHODS = [
  { id: 'debit', icon: '💳', label: 'Debit Card', sub: 'Pay instantly with your bank card' },
  { id: 'visa', icon: '💳', label: 'Visa', sub: 'Pay with a Visa card' },
  { id: 'mastercard', icon: '💳', label: 'Mastercard', sub: 'Pay with a Mastercard' },
  { id: 'mobile', icon: '📱', label: 'Mobile Money', sub: 'MoMo / USSD — no card needed' },
];
const PAY_LABELS = { debit: '💳 Debit Card', visa: '💳 Visa', mastercard: '💳 Mastercard', mobile: '📱 Mobile Money' };
let payMethod = 'debit';

function summaryCard(showCheckoutBtn) {
  const subtotal = cartSubtotal();
  const s = el('div', 'summary');
  s.innerHTML = `
    <h3 style="font-family:var(--font-display);font-weight:400;margin:0 0 8px;font-size:24px">Order summary</h3>
    <div class="summary-row"><span>Subtotal</span><strong>${fmt(subtotal)}</strong></div>
    <div class="summary-row"><span>Delivery fee</span><strong>${fmt(DELIVERY_FEE)}</strong></div>
    <div class="summary-row summary-total"><span class="label">Total</span><strong>${fmt(subtotal + DELIVERY_FEE)}</strong></div>
    ${showCheckoutBtn ? `
      <div class="pay-in-cart">
        <div class="pay-title">💳 Payment method</div>
        <div class="check-list" data-paylist>
          ${PAY_METHODS.map((p) => `<div class="check-card${p.id === payMethod ? ' selected' : ''}" data-p="${p.id}"><span class="radio"></span><span class="label">${p.icon} ${p.label}</span><span class="sub">${p.sub}</span></div>`).join('')}
        </div>
      </div>
      <button class="btn btn-primary btn-block" style="margin-top:14px" data-checksum>Proceed to Checkout →</button>` : ''}`;
  const list = $('[data-paylist]', s);
  if (list) {
    list.addEventListener('click', (e) => {
      const c = e.target.closest('.check-card'); if (!c) return;
      list.querySelectorAll('.check-card').forEach((x) => x.classList.remove('selected'));
      c.classList.add('selected');
      payMethod = c.dataset.p;
    });
  }
  if (showCheckoutBtn) $('[data-checksum]', s).onclick = () => navigate('checkout');
  return s;
}

/* ---------------- Checkout ---------------- */
async function renderCheckout() {
  if (!cart.length) { navigate('menu'); return; }
  const v = $('#view');
  v.innerHTML = '';
  v.appendChild(el('div', 'view-head', '<h1 class="view-title">Checkout</h1>'));

  const layout = el('div', 'cart-layout');
  const form = el('div', '');

  const secHead = (n, icon, title) => el('h3', 'view-sub', `<span class="sec-chip">${n}</span> ${icon} ${title}`);
  const sec = () => el('section', 'checkout-section');

  // Contact
  const prof = getProfile();
  const s1 = sec();
  s1.appendChild(secHead(1, '📍', 'Contact & delivery'));
  const f1 = el('div', 'field');
  f1.innerHTML = `<label>Name / Phone</label><input id="co-name" placeholder="Your name" value="${esc(prof?.fullName || '')}"><input id="co-phone" placeholder="Phone number" style="margin-top:8px" value="${esc(prof?.phone || '')}">`;
  s1.appendChild(f1);

  // Saved addresses
  if (prof?.addresses?.length) {
    const addrSel = el('div', '');
    addrSel.appendChild(el('label', '', 'Saved addresses'));
    prof.addresses.forEach((a, i) => {
      const b = el('button', 'check-card', `<span class="radio"></span><span class="label">🏠 ${esc(a.label || 'Address')}</span><span class="sub">${esc(a.line1)}${a.line2 ? ', ' + esc(a.line2) : ''} • ${esc(a.area)}</span>`);
      b.style.cssText = 'width:100%;margin:6px 0;';
      b.onclick = () => {
        $('[id=co-addr]', form).value = `${a.line2 ? a.line2 + ', ' : ''}${a.line1}, ${a.area}`;
        toast('Address selected', 'green');
      };
      addrSel.appendChild(b);
    });
    s1.appendChild(addrSel);
  }
  const f2 = el('div', 'field');
  f2.innerHTML = `<label>Delivery address</label>
    <input id="co-addr" placeholder="Street, landmark, area — e.g. 12 Allen Ave, Ikeja">
    <input id="co-landmark" placeholder="Nearest landmark / gate (optional)" style="margin-top:8px">
    <button class="btn btn-ghost btn-sm" style="margin-top:8px" id="co-saveaddr">Save this address to my account</button>`;
  s1.appendChild(f2);
  $('[id=co-saveaddr]', s1).onclick = async () => {
    if (!isLoggedIn()) return toast('Sign in to save addresses.', 'warm');
    const line1 = $('[id=co-addr]', s1).value.trim(); if (!line1) return;
    await saveAddressLocal({ line1, line2: '', area: $('[id=co-landmark]', s1).value.trim() || line1, label: 'Delivery' });
    toast('Address saved ✓', 'green');
  };
  form.appendChild(s1);

  // Schedule
  const s2 = sec();
  s2.appendChild(secHead(2, '🕐', 'When do you want it?'));
  const schedule = el('div', 'check-list');
  schedule.appendChild(schedCard('now', '⚡ Order now', 'Delivered as fast as we can (~25–40 min)'));
  schedule.appendChild(schedCard('later', '🕐 Schedule for later', 'Pick a delivery time — say when'));
  s2.appendChild(schedule);
  let sched = 'now';
  const laterBox = el('div', 'field'); laterBox.classList.add('hidden');
  laterBox.innerHTML = `<label>Schedule delivery at</label><input type="datetime-local" id="co-later">`;
  s2.appendChild(laterBox);
  form.appendChild(s2);

  // Payment
  const s3 = sec();
  s3.appendChild(secHead(3, '💳', 'Payment method'));
  const pay = el('div', 'check-list');
  PAY_METHODS.forEach((p) => pay.appendChild(payCard(p.id, `${p.icon} ${p.label}`, p.sub)));
  s3.appendChild(pay);
  form.appendChild(s3);

  // Promo
  const s4 = sec();
  s4.appendChild(secHead(4, '🎟', 'Promo code'));
  const promoRow = el('div', 'promo');
  promoRow.innerHTML = `<input id="co-promo" placeholder="Enter promo code"><button class="btn btn-warm" id="co-apply">Apply</button>`;
  s4.appendChild(promoRow);
  const promoMsg = el('div', ''); promoMsg.classList.add('hidden');
  s4.appendChild(promoMsg);
  form.appendChild(s4);

  let applied = null; // {type,label,amount,freeDel}
  $('[id=co-apply]', s4).onclick = () => {
    const code = $('[id=co-promo]', s4).value.trim().toUpperCase();
    const promo = PROMOS[code];
    if (!promo) { promoMsg.innerHTML = '<span style="color:var(--danger);font-weight:800;font-size:13px">Invalid code</span>'; promoMsg.classList.remove('hidden'); return; }
    applied = {
      label: `${promo.code} — ${promo.label}`,
      amount: promo.pct ? Math.round(cartSubtotal() * promo.pct / 100) : (promo.flat || 0),
      freeDel: !!promo.freeDel,
    };
    promoMsg.innerHTML = `<div class="promo-applied"><span>🎟 ${esc(applied.label)}</span><button style="border:none;background:none;color:var(--green-deep);font-weight:900">✕</button></div>`;
    promoMsg.classList.remove('hidden');
    $('button', promoMsg).onclick = () => { applied = null; promoMsg.classList.add('hidden'); toast('Promo removed'); };
    recompute();
  };

  // Summary + place order
  const summ = el('div', 'summary');
  function recompute() {
    const delivery = applied?.freeDel ? 0 : DELIVERY_FEE;
    const total = cartSubtotal() - (applied?.amount || 0) + delivery;
    summ.innerHTML = `
      <h3 style="font-family:var(--font-display);font-weight:400;margin:0 0 8px;font-size:24px">Order summary</h3>
      <div class="summary-row"><span>Subtotal</span><strong>${fmt(cartSubtotal())}</strong></div>
      <div class="summary-row"><span>Delivery</span><strong>${delivery === 0 ? '<span style="color:var(--green);font-weight:900">FREE</span>' : fmt(delivery)}</strong></div>
      ${applied?.amount ? `<div class="summary-row" style="color:var(--green);font-weight:800"><span>Discount ${esc(applied.label)}</span><strong>−${fmt(applied.amount)}</strong></div>` : ''}
      <div class="summary-row summary-total"><span class="label">Total</span><strong>${fmt(total)}</strong></div>
      <button class="btn btn-primary btn-block" style="margin-top:14px" data-ordersubmit>Place Order 🍽</button>`;
    $('[data-ordersubmit]', summ).onclick = placeOrder;
  }
  recompute();

  layout.appendChild(form);
  layout.appendChild(summ);
  v.appendChild(layout);

  function schedCard(val, a, b) {
    const c = el('div', 'check-card' + (val === 'now' ? ' selected' : '')); c.dataset.s = val;
    c.innerHTML = `<span class="radio"></span><span class="label">${a}</span><span class="sub">${b}</span>`;
    c.onclick = () => {
      schedule.querySelectorAll('.check-card').forEach((x) => x.classList.remove('selected'));
      c.classList.add('selected');
      sched = val;
      laterBox.classList.toggle('hidden', val !== 'later');
    };
    return c;
  }
  function payCard(val, a, b) {
    const c = el('div', 'check-card' + (val === payMethod ? ' selected' : '')); c.dataset.p = val;
    c.innerHTML = `<span class="radio"></span><span class="label">${a}</span><span class="sub">${b}</span>`;
    c.onclick = () => {
      pay.querySelectorAll('.check-card').forEach((x) => x.classList.remove('selected'));
      c.classList.add('selected');
      payMethod = val;
    };
    return c;
  }

  async function placeOrder() {
    const name = $('[id=co-name]', form).value.trim();
    const phone = $('[id=co-phone]', form).value.trim();
    const addr = $('[id=co-addr]', form).value.trim();
    if (!name || !phone || !addr) return toast('Please fill in your name, phone and delivery address.', 'warm');
    const items = cart.map((c) => ({ ...getItem(c.id), qty: c.qty, note: c.note }));
    const delivery = applied?.freeDel ? 0 : DELIVERY_FEE;
    const discount = applied?.amount || 0;
    const total = cartSubtotal() - discount + delivery;
    const scheduledFor = sched === 'later' ? $('[id=co-later]', form).value : null;

    const order = await createOrder({
      items, name, phone, address: `${addr}`,
      payment: payMethod, total, delivery, discount, promo: applied?.label || null,
      schedule: sched, scheduledFor,
      etaMin: 28,
    });
    cart = [];
    saveCart();
    await startSimulation(order);
    await sendMessage(order.id, `Hi! I just placed an order: ${items.map((i) => `${i.qty}× ${i.name}`).join(', ')}.${scheduledFor ? ` Scheduled for ${scheduledFor}.` : ''} Anything I should know?`, 'user');
    navigate('orders');
    openOrderDetail(order.id);
    toast('Order placed! 🎉 Track it live.', 'green');
  }
}
async function currentUserIdName() { const u = await getUser(); return u?.id || 'guest'; }
async function saveAddressLocal(a) {
  const prof = await getProfile();
  await updateProfile({ addresses: [...(prof?.addresses || []), a] });
}

/* ---------------- Orders / Tracking ---------------- */
let liveOrders = [];
let orderSubActive = false;
let openOrderId = null;

async function renderOrders() {
  const v = $('#view');
  v.innerHTML = '';
  v.appendChild(el('div', 'view-head', '<h1 class="view-title">My Orders</h1>'));
  v.appendChild(el('div', 'empty-state hidden', '<div class="big">🍽</div><h3>No orders yet</h3><p>Hungry? Let’s fix that.</p><button class="btn btn-warm" data-nav="menu">Order now</button>'));
  const list = el('div', 'order-list'); list.style.display = 'grid'; list.style.gap = '14px';
  v.appendChild(list);
  ensureOrderSub();

  const orders = await getOrders();
  if (!orders.length) { $('.empty-state', v).classList.remove('hidden'); list.remove(); }
  else renderOrderList(list, orders);
}

function renderOrderList(listEl, orders) {
  listEl.innerHTML = '';
  const sorted = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  sorted.slice(0, 12).forEach((o) => {
    const meta = ORDER_STATUS_META[o.status] || {};
    const card = el('button', 'card order-card', '');
    card.innerHTML = `
      <div class="track-head">
        <span class="track-id">#${esc(o.id.slice(0, 6).toUpperCase())}</span>
        <span class="track-status-pill ${meta.cls}">${meta.icon} ${meta.label}</span>
      </div>
      <div style="font-size:13px;font-weight:700;color:var(--ink-soft);margin:4px 0 10px">${esc(o.dateLabel || o.createdAt ? shortDate(o.createdAt) : '')} • ${o.schedule === 'later' ? '🕐 scheduled' : '⚡ now'} • ${fmt(o.total)}</div>
      <div style="font-weight:800">${o.items.map((i) => `${i.emoji} ${i.qty}× ${i.name}`).join('  ·  ')}</div>
      ${!isTerminal(o) ? `<div class="eta-box" style="margin:12px 0 0"><span class="big">⏱</span><div><span class="eta-num">${o.etaMin || 8} min</span><br><span style="font-size:12px;color:var(--ink-soft);font-weight:700">${meta.icon} ${meta.label}</span></div></div>` : ''}
      ${!isTerminal(o) ? `<div class="order-progress"><span style="width:${progressPct(o)}%"></span></div>` : ''}`;
    card.onclick = () => openOrderDetail(o.id);
    listEl.appendChild(card);
  });
}

/* ---------------- Purchases ---------------- */
async function renderPurchases() {
  const v = $('#view');
  v.innerHTML = '';
  v.appendChild(el('div', 'view-head', '<h1 class="view-title">Purchases</h1><div class="view-sub">Review your past deliveries — tap one to reorder, rate or chat about it.</div>'));
  v.appendChild(el('div', 'empty-state hidden', '<div class="big">🛍</div><h3>No purchases yet</h3><p>Completed deliveries will appear here for you to review.</p><button class="btn btn-warm" data-nav="menu">Order now</button>'));
  const list = el('div', 'order-list'); list.style.display = 'grid'; list.style.gap = '14px';
  v.appendChild(list);

  const orders = await getOrders();
  const past = (orders || [])
    .filter((o) => o.status === 'delivered')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  if (!past.length) { $('.empty-state', v).classList.remove('hidden'); list.remove(); }
  else renderOrderList(list, past);
}

function ensureOrderSub() {
  if (orderSubActive) return;
  orderSubActive = true;
  subscribeMyOrders((list) => {
    const prev = liveOrders;
    liveOrders = list || [];
    detectChanges(prev, liveOrders);
    if (currentView === 'orders') renderOrders();
    if (openOrderId) { const o = (list || []).find((x) => x.id === openOrderId); renderDetail(openOrderId, o); }
  });
}

function detectChanges(prev, next) {
  const byId = (arr) => Object.fromEntries(arr.map((o) => [o.id, o]));
  const prevM = byId(prev || []);
  next.forEach((o) => {
    const p = prevM[o.id];
    if (p && p.status !== o.status) {
      const meta = ORDER_STATUS_META[o.status];
      toast(`${meta.icon} Order ${shortDate(o.createdAt)} — ${meta.label}`, 'green');
      notify({ title: `Order #${o.id.slice(0, 6).toUpperCase()}`, body: meta.label });
      if (o.status === 'food_not_available' || o.status === 'food_not_ready') {
        setTimeout(() => { if (openOrderId) renderDetail(openOrderId); }, 1200);
      }
    }
  });
}

// Notifications
function notify(n) {
  const list = JSON.parse(localStorage.getItem('ch_notifs') || '[]');
  list.unshift({ ...n, ts: Date.now(), read: false });
  localStorage.setItem('ch_notifs', JSON.stringify(list.slice(0, 20)));
  renderBell();
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(n.title, { body: n.body });
  }
}
function unreadNotifs() { return (JSON.parse(localStorage.getItem('ch_notifs') || '[]')).filter((n) => !n.read); }
function renderBell() {
  const dot = $('#notif-dot'); if (!dot) return;
  dot.classList.toggle('hidden', !unreadNotifs().length);
}

function openNotifications() {
  const notifs = JSON.parse(localStorage.getItem('ch_notifs') || '[]');
  const wrap = el('div', '');
  if (!notifs.length) { wrap.appendChild(el('div', 'empty-state', '<div class="big">🔕</div>No notifications yet.')); }
  notifs.forEach((n) => {
    const card = el('div', 'review-card');
    card.innerHTML = `<div class="review-top"><div class="review-avatar">🍽</div><div><div class="review-user">${esc(n.title)}</div><div class="review-date">${timeHM(n.ts)} • ${n.unread?'<b>new</b>':''}</div></div></div><p class="review-body">${esc(n.body || '')}</p>`;
    wrap.appendChild(card);
  });
  localStorage.setItem('ch_notifs', JSON.stringify(notifs.map((n) => ({ ...n, read: true }))));
  renderBell();
  openModal(wrap, { title: 'Notifications' });
}
function timeHM(ts) { return new Date(ts).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }); }

let detailBox = null;
async function openOrderDetail(id) {
  openOrderId = id;
  $('#modal-root').classList.remove('open');
  const order = (await getOrders()).find((o) => o.id === id);
  detailBox = el('div', '');
  openModal(detailBox, { title: `Track order #${(id || '?').slice(0, 6).toUpperCase()}` });
  renderDetail(id, order);
}

function renderDetail(id, order) {
  if (!detailBox) return;
  detailBox.innerHTML = '';
  detailBox.appendChild(renderDetailContent(id, order));
}

function renderDetailContent(id, order) {
  if (!order) return el('div', '', 'Loading…');
  const meta = ORDER_STATUS_META[order.status] || {};

  const wrap = el('div', 'track-wrap');
  const idLine = el('div', '', `<span class="track-id">#${esc(order.id.slice(0, 8).toUpperCase())}</span> <span class="track-status-pill ${meta.cls}">${meta.icon} ${meta.label}</span>`);
  const line2 = el('div', 'view-sub', `${order.items.map((i) => `${i.emoji} ${i.qty}× ${i.name}`).join(' · ')}<br>📍 ${esc(order.address)}`);
  wrap.appendChild(idLine);
  wrap.appendChild(line2);
  wrap.appendChild(el('div', '', `<span style="font-size:12px;font-weight:800;color:var(--orange-deep);text-transform:uppercase;letter-spacing:.4px">${PAY_LABELS[order.payment] || '💳 Card'} • ${fmt(order.total)}</span>`));

  // ETA
  if (!isTerminal(order) && order.status === 'preparing') {
    wrap.appendChild(el('div', 'eta-box', `<span class="big">👨‍🍳</span><div><span class="eta-num">~${order.etaMin || 8} min</span><br><span style="font-size:12px;color:var(--ink-soft);font-weight:700">prep time remaining</span></div>`));
  }

  // Steps
  const steps = el('div', 'steps');
  STATUS_ORDER.forEach((s, i) => {
    const cur = order.status === s;
    const done = STATUS_ORDER.indexOf(order.status) > i || (order.status === 'delivered');
    const m = ORDER_STATUS_META[s];
    const step = el('div', 'step' + (done ? ' done' : cur ? ' current' : ''));
    step.innerHTML = `
      <div class="step-rail"><div class="step-dot">${done ? '✓' : i + 1}</div>${i < STATUS_ORDER.length - 1 ? '<div class="step-line"></div>' : ''}</div>
      <div class="step-body"><div class="step-body-title">${m.label}</div>
      <div class="step-body-sub">${stepSub(s, order)}</div></div>`;
    steps.appendChild(step);
  });
  wrap.appendChild(steps);

  // Driver card
  if (order.status === 'out_for_delivery') {
    const d = el('div', 'driver-card show');
    d.innerHTML = `<span class="driver-avatar">🛵</span>
      <div><span class="driver-name">${esc(order.driver?.name || 'Tunde')} is delivering</span>
      <div class="driver-info">Arriving in ~<b style="color:var(--green):"">${order.driver?.etaMin || 8} min</b> • ETA ${order.scheduledFor ? 'scheduled' : 'soon'}</div></div>`;
    wrap.appendChild(d);
    const map = el('div', 'map-strip');
    map.innerHTML = `<div class="map-grid"></div><span class="pin shop">🏪</span><span class="pin home">🏠</span><span class="pin driver" style="left:12%;top:60%">🛵</span>`;
    wrap.appendChild(map);
    // animate driver
    const driverPin = $('.pin.driver', map);
    const t0 = (order.simPhaseStart || Date.now());
    function anim() {
      const elap = (Date.now() - t0) / 1000;
      const frac = Math.min(1, elap / 28);
      const x = 12 + frac * 70; const y = 60 - frac * 34;
      driverPin.style.left = x + '%'; driverPin.style.top = y + '%';
      if (frac < 1 && order.status === 'out_for_delivery') requestAnimationFrame(anim);
    }
    anim();
  }

  // Snag action boxes
  if (order.status === 'food_not_ready') {
    const s = el('div', 'snag-box');
    s.innerHTML = `<h4>⏳ Almost ready</h4>
      <p style="margin:0;font-weight:600;color:var(--ink-soft)">There's a short wait in the kitchen. Do you want your food <b>ready in ~5 more minutes</b>, or should we cancel?</p>
      <div class="snag-actions">
        <button class="btn btn-primary" data-wait>Can you wait? ~5 min</button>
        <button class="btn btn-danger" data-cancel>Cancel order</button>
      </div>`;
    $('[data-wait]', s).onclick = async () => { await resolveWait(order, 5); toast('Great — food is almost ready!', 'green'); };
    $('[data-cancel]', s).onclick = async () => { await resolveCancel(order); toast('Order cancelled.'); };
    wrap.appendChild(s);
  }
  if (order.status === 'food_not_available') {
    const s = el('div', 'snag-box');
    const badIdx = Math.max(0, order.items.findIndex((i) => i.id === order.unavailable));
    const badItem = order.items[badIdx] || order.items[0];
    const repl = MENU.filter((m) => m.cat === badItem.cat || true).slice(0, 4);
    s.innerHTML = `<h4>😔 Food not available</h4>
      <p style="margin:0;font-weight:600;color:var(--ink-soft)"><b>${esc(badItem.emoji)} ${esc(badItem.name)}</b> is currently out of stock. Swap it for something else, or cancel your order.</p>
      <div class="swap-list">${repl.map((m) => `<button class="swap-item" data-swap="${m.id}"><span class="name">${m.emoji} ${m.name}</span><br><span class="price">${fmt(m.price)}</span></button>`).join('')}</div>
      <div class="snag-actions"><button class="btn btn-danger" data-cancel>Cancel order</button></div>`;
    s.querySelectorAll('[data-swap]').forEach((b) => b.onclick = async () => { await resolveSwap(order, b.dataset.swap); toast('Swapped! Cooking your replacement. 🍽', 'green'); });
    $('[data-cancel]', s).onclick = async () => { await resolveCancel(order); toast('Order cancelled.'); };
    wrap.appendChild(s);
  }

  // Actions: chat + review + reorder
  const actions = el('div', 'snag-actions');
  actions.appendChild(btn('💬 Chat with staff', () => openChat(order.id)));
  if (order.status === 'delivered') actions.appendChild(btn('⭐ Rate this order', () => openRate(order)));
  if (order.status !== 'delivered' && order.status !== 'cancelled') actions.appendChild(btn('✕ Cancel', () => resolveCancel(order).then(() => toast('Order cancelled.'))));
  wrap.appendChild(actions);
  wrap.appendChild(el('div', 'view-sub', `📞 Need help? Call ${BUSINESS.phone} or use chat.`));

  // Reviews for this order
  if (order.status === 'delivered') {
    const rev = el('div', '');
    rev.appendChild(el('h3', 'view-sub', 'Your review'));
    rev.appendChild(el('p', '', 'No review yet. Tap “Rate this order” above to share feedback.'));
    wrap.appendChild(rev);
    subscribeReviews(order.id, (list) => {
      const r = (list || [])[0];
      if (!r) return;
      rev.innerHTML = '<div class="review-card">';
      const all = (r.items || []).map((i) => i.rating).concat([r.overall]);
      const avg = all.length ? Math.round(all.reduce((a, b) => a + b, 0) / all.length) : 0;
      rev.innerHTML = `<div class="review-card">
        <div class="review-top"><div class="review-avatar">⭐</div><div><div class="review-user">Your rating</div><div class="mini-stars">${'★'.repeat(avg)}${'☆'.repeat(5 - avg)}</div></div><div class="review-date">${shortDate(r.ts)}</div></div>
        ${r.comment ? `<p class="review-body">${esc(r.comment)}</p>` : ''}
        ${(r.items || []).map((i) => `<div class="review-item-tag">${i.emoji} ${esc(i.name)} — ${'★'.repeat(i.rating || 5)}${'☆'.repeat(5 - (i.rating || 5))}</div>`).join('')}
      </div>`;
    });
  }

  return wrap;
}

function btn(label, fn) {
  const b = el('button', 'btn btn-ghost', label);
  b.onclick = fn;
  return b;
}
function stepSub(s, order) {
  switch (s) {
    case 'confirmed': return order.createdAt ? `Confirmed ${shortDate(order.createdAt)}` : 'Confirmed';
    case 'preparing': return `Preparing cadence ~${order.etaMin || 8} min`;
    case 'ready_for_delivery': return 'Packed & ready';
    case 'out_for_delivery': return 'Driver on the way';
    case 'delivered': return 'Enjoy! 🎉';
    default: return '';
  }
}

/* ---------------- Chat ---------------- */
function openChat(orderId) {
  const wrap = el('div', 'chat-shell');
  const win = el('div', 'chat-window');
  win.innerHTML = `
    <div class="chat-head"><span class="avatar">👨‍🍳</span>
      <div>Chow Heaven Staff<span class="sub">${BUSINESS.hours}</span></div></div>
    <div class="chat-msgs"></div>
    <div class="chat-quick">
      <button data-q="Where is my food?">📍 Where is my food?</button>
      <button data-q="Can I change my order?">🔄 Can I change my order?</button>
      <button data-q="Need extra sauce?">🥫 Extra sauce?</button>
    </div>
    <div class="chat-input"><input placeholder="Type a message…"><button class="btn btn-warm">Send</button></div>`;
  wrap.appendChild(win);

  const msgs = $('.chat-msgs', win);
  const input = $('.chat-input input', win);
  const sendBtn = $('.chat-input button', win);
  let history = [];
  let typing = false;

  subscribeMessages(orderId, (list) => {
    const arr = (list || []).sort((a, b) => new Date(a.ts) - new Date(b.ts));
    const out = arr.map((m) => ({ role: m.from === 'user' ? 'user' : 'assistant', content: m.text, _localId: m.id }));
    history = out;
    renderMsgs(arr);
  });

  async function renderMsgs(arr) {
    if (!arr.length) return;
    msgs.innerHTML = arr.map((m) => `
      <div class="msg ${m.from === 'user' ? 'mine' : 'theirs'}"><span>${esc(m.text)}</span>
      <span class="meta">${m.from === 'user' ? 'You' : 'Chow Staff'} • ${m.from !== 'user' ? '🍽' : ''} ${timeStr(m.ts)}</span></div>`).join('');
    msgs.scrollTop = msgs.scrollHeight;
  }
  function timeStr(iso) { const d = new Date(iso); return d.toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' }); }

  async function send(text) {
    text = (text || '').trim();
    if (!text) return;
    input.value = '';
    await sendMessage(orderId, text, 'user');
    // typing
    const typingEl = el('div', 'msg theirs', '<span class="typing"><span></span><span></span><span></span></span>');
    msgs.appendChild(typingEl); msgs.scrollTop = msgs.scrollHeight;
    try {
      const reply = await staffReply(orderId, text, history);
      typingEl.remove();
      await sendMessage(orderId, reply, 'staff');
    } catch (e) {
      typingEl.remove();
      await sendMessage(orderId, "Thanks for reaching out — a member of our team will get back to you shortly. 📞 " + BUSINESS.phone, 'staff');
    }
  }
  sendBtn.onclick = () => send(input.value);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(input.value); });
  win.querySelectorAll('[data-q]').forEach((b) => b.onclick = () => send(b.dataset.q));

  openModal(wrap, { title: `Chat about #${orderId.slice(0, 6).toUpperCase()}` });
  setTimeout(() => {
    if (!msgs.children.length) {
      sendMessage(orderId, "👋 Hi! I'm the Chow Heaven counter. Ask me anything about your order — delivery time, swaps, special requests, ingredients. How can I help?", 'staff').then(() => {});
    }
  }, 400);
}

async function staffReply(orderId, userText, history) {
  // context from the order + menu
  const orders = await getOrders();
  const order = orders.find((o) => o.id === orderId);
  const items = order ? order.items.map((i) => `${i.qty}× ${i.name} (${i.emoji})`).join(', ') : '';
  const contxt = [
    `You are a friendly counter assistant for Chow Heaven restaurant.`,
    `Restaurant: ${BUSINESS.name}, ${BUSINESS.address}. Hours ${BUSINESS.hours}. Phone ${BUSINESS.phone}.`,
    `Menu: ${MENU.map((m) => `${m.name} ${fmt(m.price)}`).join('; ')}.`,
    `The customer's current order (#${order?.id?.slice(0,6).toUpperCase() || '?'}) status: ${order?.status || 'new'}, items: ${items || 'unknown'}, total ${order ? fmt(order.total) : ''}.`,
    `Keep answers short (1-3 sentences), warm and helpful. You can simulate a real kitchen staff.`
  ].join('\n');
  let chatHistory = history.slice(-8).map((h) => ({ role: h.role, content: h.content.replace(/^.*Chow Staff.*$/m, '') }));
  try {
    const completion = await websim.chat.completions.create({
      messages: [{ role: 'system', content: contxt }, ...chatHistory, { role: 'user', content: userText }],
    });
    return completion.content;
  } catch (e) {
    return "Thanks! I've noted that down. Anything else you'd like to adjust? (This is a demo — try opening a fresh chat.)";
  }
}

/* ---------------- Reviews ---------------- */
function openRate(order) {
  const wrap = el('div', '');
  let overall = 5;
  const itemRatings = {};
  const stars = (val, onChange, size = 26) => {
    const c = el('div', 'stars');
    for (let i = 1; i <= 5; i++) { const b = el('button', i <= val ? 'on' : '', '★'); b.style.fontSize = size + 'px'; b.onclick = () => { c.querySelectorAll('button').forEach((x, k) => x.classList.toggle('on', k < i)); onChange(i); }; c.appendChild(b); }
    return c;
  };
  const listEl = el('div', '');
  order.items.forEach((it) => {
    listEl.appendChild(el('div', 'item-rating', `<span class="thumb">${it.emoji}</span><span class="name">${esc(it.name)}</span>`));
    listEl.lastChild.appendChild(stars(5, (n) => itemRatings[it.id] = n));
  });
  wrap.appendChild(el('p', 'view-sub', 'How was everything?'));
  wrap.appendChild(el('div', 'field', '<label>Overall experience</label>'));
  wrap.lastChild.appendChild(stars(5, (n) => overall = n));
  wrap.appendChild(listEl);
  const ta = el('div', 'field');
  ta.innerHTML = `<label>Leave a review (optional)</label><textarea rows="3" placeholder="Tell us what you loved…">`;
  wrap.appendChild(ta);
  const b = el('button', 'btn btn-primary btn-block', 'Submit rating');
  wrap.appendChild(b);
  b.onclick = async () => {
    await submitReview(order.id, {
      overall,
      comment: $('textarea', ta).value.trim(),
      items: order.items.map((it) => ({ item_id: it.id, name: it.name, emoji: it.emoji, rating: itemRatings[it.id] || 5 })),
    });
    closeModal();
    toast('Thanks for your rating! ⭐', 'green');
    openOrderDetail(order.id);
  };
  openModal(wrap, { title: 'Rate your order' });
}

/* ---------------- Account ---------------- */
async function renderAccount() {
  const v = $('#view');
  v.innerHTML = '';
  v.appendChild(el('div', 'view-head', '<h1 class="view-title">Account</h1>'));
  const user = getUser();
  const prof = getProfile();
  const loggedIn = isLoggedIn();

  if (!loggedIn || !prof) {
    const c = el('div', 'card');
    c.style.cssText = 'max-width:420px;margin:10px auto;text-align:center';
    c.innerHTML = `
      <div class="profile-avatar" style="margin:4px auto 12px">😋</div>
      <h2 style="font-family:var(--font-display);font-weight:400;font-size:28px;margin:0 0 6px">Welcome to Chow Heaven</h2>
      <p style="color:var(--ink-soft);font-weight:600">Create an account to save addresses, track your order history, collect loyalty points and reorder your favourites.</p>
      <div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn-warm" style="flex:1" data-ca="login">Log in</button><button class="btn btn-primary" style="flex:1" data-ca="register">Create account</button></div>`;
    v.appendChild(c);
    $('[data-ca=login]', c).onclick = () => openAuth('login', user);
    $('[data-ca=register]', c).onclick = () => openAuth('register', user);
    return;
  }

  // Logged in
  const grid = el('div', 'account-grid');
  const side = el('div', '');
  const profAvatar = el('div', 'card', `
    <div class="profile-avatar">${esc(prof.fullName?.[0]?.toUpperCase() || 'C')}</div>
    <h2 style="font-family:var(--font-display);font-weight:400;margin:0 0 2px;font-size:24px">${esc(prof.fullName || 'Chow Fan')}</h2>
    <p style="color:var(--ink-soft);font-weight:600;margin:0 0 14px">${esc(prof.email || '')}</p>
    <div class="menu-tabs">
      <button class="m-tab active" data-acc="orders">My Orders</button>
      <button class="m-tab" data-acc="addresses">Saved Addresses</button>
      <button class="m-tab" data-acc="favorites">Favourites</button>
      <button class="m-tab" data-acc="prefs">Preferences</button>
      <button class="m-tab" data-acc="logout" style="color:var(--danger)">Log out</button>
    </div>`);
  side.appendChild(profAvatar);
  side.appendChild(el('div', 'loyalty-card', `
    <div style="font-weight:800;opacity:.9">Loyalty points</div>
    <div class="pts">${prof.points || 0} 🏅</div>
    <div class="loyalty-bar"><span style="width:${Math.min(100, ((prof.points || 0) % 100) / 100 * 100)}%"></span></div>
    <div style="font-size:12px;font-weight:700;opacity:.9">Spend ₦${fmt(prof.totalSpent || 0)} • ${prof.ordersCount || 0} orders</div>`));
  grid.appendChild(side);

  const main = el('div', '');
  let accTab = 'orders';
  async function renderAccContent() {
    main.innerHTML = '';
    if (accTab === 'orders') {
      const orders = await getOrders();
      main.appendChild(el('h3', 'view-sub', 'Order history'));
      if (!orders.length) main.appendChild(el('div', 'empty-state', '<div class="big">🍽</div>No orders yet.'));
      orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).forEach((o) => {
        const meta = ORDER_STATUS_META[o.status] || {};
        const row = el('div', 'order-item-row', '');
        row.innerHTML = `<div>
            <span class="track-id" style="font-size:13px">#${esc(o.id.slice(0,6).toUpperCase())}</span>
            <div style="font-weight:800">${o.items.map((i)=>i.emoji).join('')} ${o.items.reduce((a,i)=>a+i.qty,0)} items</div>
            <div style="font-size:12px;color:var(--ink-soft);font-weight:700">${shortDate(o.createdAt)} • ${o.schedule==='later'?'scheduled':'now'}</div>
          </div>
          <div style="text-align:right">
            <span class="track-status-pill ${meta.cls}">${meta.icon} ${meta.label}</span>
            <div style="font-weight:900;margin-top:6px">${fmt(o.total)}</div>
          </div>`;
        row.style.cursor = 'pointer';
        row.onclick = () => openOrderDetail(o.id);
        main.appendChild(row);
      });
    } else if (accTab === 'addresses') {
      main.appendChild(el('h3', 'view-sub', 'Saved addresses'));
      if (!prof.addresses?.length) main.appendChild(el('div', 'empty-state', '<div class="big">📍</div>No saved addresses yet.'));
      (prof.addresses || []).forEach((a, i) => {
        const row = el('div', 'address-row', `<div><b>${esc(a.label || 'Address')}</b><br><span style="color:var(--ink-soft);font-weight:600;font-size:13px">${esc(a.line1)}${a.line2 ? ', ' + esc(a.line2) : ''} • ${esc(a.area)}</span></div><button class="btn btn-ghost btn-sm" data-del>Remove</button>`);
        $('[data-del]', row).onclick = async () => { await removeAddress(i); renderAccount(); };
        main.appendChild(row);
      });
    } else if (accTab === 'favorites') {
      main.appendChild(el('h3', 'view-sub', 'Your favourites'));
      subscribeFavs((list) => {
        main.innerHTML = '<h3 style="margin:0 0 10px" class="view-sub">Your favourites</h3>';
        if (!list?.length) main.appendChild(el('div', 'empty-state', '<div class="big">❤️</div>No favourites yet. Tap 🤍 on any menu item.'));
        list.forEach((f) => {
          const m = getItem(f.item_id); if (!m) return;
          const row = el('div', 'order-item-row');
          row.innerHTML = `<div style="display:flex;align-items:center;gap:10px"><span style="font-size:24px">${m.emoji}</span><div><b>${m.name}</b><div style="color:var(--orange-deep);font-weight:800">${fmt(m.price)}</div></div></div><div style="display:flex;gap:6px"><button class="btn btn-primary btn-sm" data-reorder>Reorder</button></div>`;
          $('[data-reorder]', row).onclick = () => { addToCart(m.id, 1); navigate('cart'); };
          main.appendChild(row);
        });
      });
    } else if (accTab === 'prefs') {
      main.appendChild(el('h3', 'view-sub', 'Preferences'));
      const f = el('div', 'field');
      f.innerHTML = `<label>Full name</label><input id="pf-name" value="${esc(prof.fullName||'')}">`;
      main.appendChild(f);
      const p = el('div', 'field');
      p.innerHTML = `<label>Phone</label><input id="pf-phone" value="${esc(prof.phone||'')}">`;
      main.appendChild(p);
      const s = el('button', 'btn btn-primary', 'Save preferences');
      s.onclick = async () => {
        await updateProfile({ fullName: $('[id=pf-name]', main).value.trim(), phone: $('[id=pf-phone]', main).value.trim() });
        toast('Saved ✓', 'green');
      };
      main.appendChild(s);
    } else if (accTab === 'logout') {
      logout();
      toast('Logged out.');
      await initStore();
      renderAccount();
      return;
    }
  }
  grid.appendChild(main);
  v.appendChild(grid);
  renderAccContent();
  side.querySelectorAll('.m-tab').forEach((t) => t.onclick = () => {
    side.querySelectorAll('.m-tab').forEach((x) => x.classList.remove('active'));
    t.classList.add('active');
    accTab = t.dataset.acc;
    renderAccContent();
  });
}

function openAuth(mode, user) {
  const wrap = el('div', '');
  wrap.innerHTML = `
    <p class="view-sub" style="margin-top:0">${mode === 'register' ? 'Create your Chow Heaven account' : 'Welcome back!'}${user && user.username ? `<br><small>Logged in as @${esc(user.username)}</small>` : ''}</p>
    ${mode === 'register' ? `
      <div class="field"><label>Full name</label><input id="a-name" placeholder="e.g. Ada Obi"></div>
      <div class="field"><label>Phone</label><input id="a-phone" placeholder="+234…"></div>` : ''}
    <div class="field"><label>Email</label><input id="a-email" placeholder="you@example.com"></div>
    <div class="field"><label>${mode === 'register' ? 'Create' : 'Your'} PIN</label><input id="a-pin" type="password" placeholder="4-digit PIN"></div>
    <button class="btn btn-primary btn-block" id="a-submit">${mode === 'register' ? 'Create account & start earning points' : 'Log in'}</button>
    <p style="text-align:center;margin:12px 0 0;font-size:13px;color:var(--ink-soft);font-weight:700">
      ${mode === 'register' ? 'Already have an account?' : 'New here?'}
      <a id="a-switch" style="color:var(--orange-deep);font-weight:900;cursor:pointer">${mode === 'register' ? 'Log in' : 'Create account'}</a></p>`;
  $('[id=a-switch]', wrap).onclick = () => { closeModal(); openAuth(mode === 'register' ? 'login' : 'register', user); };
  $('[id=a-submit]', wrap).onclick = async () => {
    const email = $('[id=a-email]', wrap).value.trim();
    const pin = $('[id=a-pin]', wrap).value.trim();
    if (!email || !pin) return toast('Please fill in email and PIN.', 'warm');
    try {
      if (mode === 'register') {
        await register({ email, pin, fullName: $('[id=a-name]', wrap)?.value.trim() || '', phone: $('[id=a-phone]', wrap)?.value.trim() || '' });
        toast('Account created — welcome! 🎉', 'green');
      } else {
        await login(email, pin);
        toast('Welcome back! 👋', 'green');
      }
      closeModal();
      renderAccount();
    } catch (e) { toast(e.message, 'warm'); }
  };
  openModal(wrap, { title: mode === 'register' ? 'Create account' : 'Log in to Chow Heaven' });
}

/* ============================ Theme ============================ */
const THEME_OPTIONS = ['dark', 'light', 'system'];
function applyTheme(theme) {
  if (!THEME_OPTIONS.includes(theme)) theme = 'dark';
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem('ch_theme', theme); } catch (e) {}
  const sel = $('#theme-select');
  if (sel && sel.value !== theme) sel.value = theme;
}
function initTheme() {
  let t = 'dark';
  try { t = localStorage.getItem('ch_theme') || 'dark'; } catch (e) {}
  applyTheme(t);
  const sel = $('#theme-select');
  if (sel) sel.addEventListener('change', () => applyTheme(sel.value));
}

/* ============================ Ticker + init ============================ */
let tickTimer = null;
function startTick() {
  tickTimer = setInterval(async () => {
    const active = liveOrders.filter((o) => !isTerminal(o) && o.status !== 'delivered' && o.status !== 'cancelled');
    for (const o of active) { await tick(o); }
  }, 2000);
}

async function init() {
  initTheme();
  loadCart();
  updateCartUI();
  renderBell();
  await initRoom();
  await initStore();
  ensureOrderSub();
  startTick();

  // notifications permission
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();

  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav]');
    if (nav && nav.id !== 'notif-bell') navigate(nav.dataset.nav);
    if (e.target.closest('#notif-bell')) openNotifications();
  });
  window.addEventListener('hashchange', route);
  route();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// Mobile bottom cart bar
function drawCartBar() {
  const root = $('#cartbar-root');
  if (currentView === 'menu' || currentView === 'orders' || currentView === 'account' || currentView === 'purchases') {
    if (cartCount() > 0) {
      root.innerHTML = `<button class="btn btn-primary btn-block" style="box-shadow:var(--shadow);font-size:16px;padding:14px" data-nav="cart">🛒 View cart — ${cartCount()} item${cartCount() > 1 ? 's' : ''} • <b>${fmt(cartSubtotal())}</b></button>`;
    } else root.innerHTML = '';
  } else root.innerHTML = '';
}
window.drawCartBar = drawCartBar;

init();
