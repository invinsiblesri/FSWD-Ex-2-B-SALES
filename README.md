# FSWD-Ex-2-B-SALES

A small e-commerce **sales demo** built with plain HTML, CSS and JavaScript.
Browse products, add them to a cart, change quantities and complete a purchase.

## Features

- Product catalog with 8 items (icon, category, price, MRP, rating)
- Live search and category filter
- Add to cart with a live cart badge
- Cart with quantity increase / decrease and remove
- Automatic price summary: subtotal, delivery fee, total
- Free delivery on orders of ₹1,499 or more
- Cart persisted in `localStorage` (survives a page refresh)
- Checkout form (name, email, address, payment method) with validation
- Order confirmation with generated order ID and receipt
- Responsive layout - cart becomes a slide-in drawer on small screens

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page structure: header, catalog, cart panel, checkout and confirmation modals |
| `style.css` | Styling, layout, card design and responsive rules |
| `script.js` | Product data, filtering, cart logic, checkout and order confirmation |

## Run it

The site runs directly from GitHub Pages — no local server or setup needed:

**Live demo:** https://invinsiblesri.github.io/FSWD-Ex-2-B-SALES/

Every push to `main` redeploys the site automatically in about a minute.

## How the cart works

1. `PRODUCTS` holds the catalog data.
2. `addToCart(id)` merges duplicate products and increases quantity.
3. `renderCart()` recalculates subtotal, delivery and total, then re-renders the panel.
4. `placeOrder()` validates the form, builds an order ID, shows the receipt and clears the cart.

> This is a front-end exercise - no real payment is processed.
