/* =========================================================
   UrbanCart - Sales demo
   Product catalog, shopping cart and checkout flow
   ========================================================= */

/* ---------- Product catalog ---------- */
const PRODUCTS = [
  { id: 1, name: "Wireless Earbuds Pro", category: "Audio", price: 2499, mrp: 3499, rating: 4.4, icon: "🎧" },
  { id: 2, name: "Smart Watch Series 5", category: "Wearables", price: 3999, mrp: 5499, rating: 4.2, icon: "⌚" },
  { id: 3, name: "Bluetooth Speaker Mini", category: "Audio", price: 1799, mrp: 2299, rating: 4.1, icon: "🔊" },
  { id: 4, name: "Laptop Backpack 30L", category: "Accessories", price: 1299, mrp: 1999, rating: 4.5, icon: "🎒" },
  { id: 5, name: "65W USB-C Fast Charger", category: "Chargers", price: 1499, mrp: 1999, rating: 4.3, icon: "🔌" },
  { id: 6, name: "Gaming Mouse RGB", category: "Accessories", price: 1899, mrp: 2599, rating: 4.6, icon: "🖱️" },
  { id: 7, name: "10000mAh Power Bank", category: "Chargers", price: 999, mrp: 1499, rating: 4.0, icon: "🔋" },
  { id: 8, name: "Mechanical Keyboard TKL", category: "Accessories", price: 3499, mrp: 4299, rating: 4.7, icon: "⌨️" }
];

const DELIVERY_FEE = 49;
const FREE_DELIVERY_OVER = 1499;
const STORAGE_KEY = "urbancart_cart_v1";

/* ---------- Helpers ---------- */
const money = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(n);

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
const cartTotalItems = () => cart.reduce((sum, item) => sum + item.qty, 0);

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved)
      ? saved.filter((item) => findProduct(item.id) && item.qty > 0)
      : [];
  } catch (err) {
    return [];
  }
}

function saveCart() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}

/* ---------- State ---------- */
let cart = loadCart();

/* ---------- Catalog rendering ---------- */
function initCategories() {
  const select = document.getElementById("category");
  const categories = [...new Set(PRODUCTS.map((p) => p.category))].sort();
  select.innerHTML =
    '<option value="all">All categories</option>' +
    categories.map((c) => `<option value="${c}">${c}</option>`).join("");
}

function applyFilters() {
  const term = document.getElementById("search").value.trim().toLowerCase();
  const category = document.getElementById("category").value;

  const list = PRODUCTS.filter((p) => {
    const matchCategory = category === "all" || p.category === category;
    const matchTerm =
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term);
    return matchCategory && matchTerm;
  });

  renderProducts(list);
}

function renderProducts(list) {
  const grid = document.getElementById("productGrid");
  const empty = document.getElementById("emptyResults");
  const info = document.getElementById("resultInfo");

  info.textContent = `Showing ${list.length} of ${PRODUCTS.length} products`;
  empty.classList.toggle("hidden", list.length > 0);

  grid.innerHTML = list
    .map(
      (p) => `
      <article class="card">
        <div class="thumb">${p.icon}</div>
        <div class="card-body">
          <span class="tag">${p.category}</span>
          <h3>${p.name}</h3>
          <span class="rating">★ ${p.rating.toFixed(1)}</span>
          <div class="price-row">
            <span class="price">${money(p.price)}</span>
            <span class="mrp">${money(p.mrp)}</span>
          </div>
          <button class="add-btn" onclick="addToCart(${p.id}, this)">
            ${inCart(p.id) ? "Added ✓ - Add another" : "Add to Cart"}
          </button>
        </div>
      </article>`
    )
    .join("");
}

const inCart = (id) => cart.some((item) => item.id === id);

/* ---------- Cart operations ---------- */
function addToCart(id, button) {
  const product = findProduct(id);
  if (!product) return;

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, qty: 1 });
  }

  saveCart();
  renderCart();
  updateBadge();

  if (button) {
    const original = button.textContent.trim();
    button.textContent = "Added to cart ✓";
    button.classList.add("added");
    setTimeout(() => {
      button.textContent = original;
      button.classList.remove("added");
    }, 900);
  }
}

function changeQty(id, delta) {
  const item = cart.find((entry) => entry.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeItem(id);
    return;
  }

  saveCart();
  renderCart();
  updateBadge();
}

function removeItem(id) {
  cart = cart.filter((item) => item.id !== id);
  saveCart();
  renderCart();
  updateBadge();
  applyFilters();
}

function updateBadge() {
  document.getElementById("cartCount").textContent = cartTotalItems();
}

/* ---------- Cart rendering ---------- */
function renderCart() {
  const itemsBox = document.getElementById("cartItems");
  const summaryBox = document.getElementById("cartSummary");

  if (cart.length === 0) {
    itemsBox.innerHTML = `
      <p class="empty" style="padding:34px 0">
        Your cart is empty 🛒<br>
        <span class="muted">Add products to get started.</span>
      </p>`;
    summaryBox.innerHTML = "";
    return;
  }

  itemsBox.innerHTML = cart
    .map((item) => {
      const p = findProduct(item.id);
      return `
        <div class="cart-item">
          <div class="item-thumb">${p.icon}</div>
          <div>
            <div class="item-name">${p.name}</div>
            <div class="item-price">${money(p.price)} each</div>
            <div class="qty-row">
              <button class="qty-btn" onclick="changeQty(${p.id}, -1)">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="changeQty(${p.id}, 1)">+</button>
              <button class="remove-btn" onclick="removeItem(${p.id})">Remove</button>
            </div>
          </div>
          <div class="item-total">${money(p.price * item.qty)}</div>
        </div>`;
    })
    .join("");

  const subtotal = cart.reduce(
    (sum, item) => sum + findProduct(item.id).price * item.qty,
    0
  );
  const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  summaryBox.innerHTML = `
    <div class="summary-row"><span>Subtotal (${cartTotalItems()} items)</span><span>${money(subtotal)}</span></div>
    <div class="summary-row">
      <span>Delivery</span>
      <span>${delivery === 0 ? '<span class="free">FREE</span>' : money(delivery)}</span>
    </div>
    <div class="summary-row total"><span>Total</span><span>${money(total)}</span></div>
    <button class="primary checkout-btn" onclick="openCheckout()">Proceed to Checkout</button>`;
}

/* ---------- Cart panel (mobile drawer) ---------- */
function toggleCart() {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");
  const opening = !panel.classList.contains("open");

  panel.classList.toggle("open", opening);
  overlay.classList.toggle("show", opening);
}

function closeCart() {
  document.getElementById("cartPanel").classList.remove("open");
  document.getElementById("overlay").classList.remove("show");
}

/* ---------- Checkout ---------- */
function openCheckout() {
  if (cart.length === 0) {
    alert("Your cart is empty. Add a product first.");
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + findProduct(item.id).price * item.qty,
    0
  );
  const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;

  document.getElementById("checkoutTotal").textContent =
    `Amount payable: ${money(subtotal + delivery)}`;
  document.getElementById("checkoutModal").classList.remove("hidden");
  closeCart();
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.add("hidden");
}

function placeOrder(event) {
  event.preventDefault();

  const name = document.getElementById("custName").value.trim();
  const email = document.getElementById("custEmail").value.trim();
  const address = document.getElementById("custAddress").value.trim();
  const payment = document.getElementById("payMethod").value;

  if (!name || !email || !address) {
    alert("Please fill in all the delivery details.");
    return;
  }
  if (cart.length === 0) {
    alert("Your cart is empty.");
    closeCheckout();
    return;
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + findProduct(item.id).price * item.qty,
    0
  );
  const delivery = subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;
  const orderId = "UC" + Date.now().toString().slice(-6);

  const lines = cart
    .map((item) => {
      const p = findProduct(item.id);
      return `<div><span>${p.name} × ${item.qty}</span><span>${money(p.price * item.qty)}</span></div>`;
    })
    .join("");

  document.getElementById("successText").innerHTML =
    `Order <strong>#${orderId}</strong> confirmed for <strong>${name}</strong>.<br>` +
    `Paying by <strong>${payment}</strong> &middot; delivering to ${address}.`;

  document.getElementById("successSummary").innerHTML = `
    ${lines}
    <div><span>Delivery</span><span>${delivery === 0 ? "FREE" : money(delivery)}</span></div>
    <div class="grand"><span>Total paid</span><span>${money(total)}</span></div>
    <div class="muted" style="display:block;margin-top:8px">A confirmation email would be sent to ${email}.</div>`;

  cart = [];
  saveCart();
  renderCart();
  updateBadge();
  applyFilters();

  document.getElementById("checkoutModal").classList.add("hidden");
  document.getElementById("successModal").classList.remove("hidden");

  document.getElementById("custName").value = "";
  document.getElementById("custEmail").value = "";
  document.getElementById("custAddress").value = "";
}

function closeSuccess() {
  document.getElementById("successModal").classList.add("hidden");
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initCategories();
  applyFilters();
  renderCart();
  updateBadge();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeCheckout();
  closeSuccess();
  closeCart();
});
