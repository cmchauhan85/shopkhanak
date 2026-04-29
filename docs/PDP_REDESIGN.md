# Khanak PDP Redesign — Implementation & Admin Guide

A reference for what shipped in the April 2026 product-detail page redesign and how to configure each piece from the Shopify admin (Theme editor → Customize → Product page).

---

## 1. What changed at a glance

| Area | Before | After |
|---|---|---|
| Header announcement bar | unchanged | unchanged |
| Header logo / nav | unchanged | unchanged |
| Breadcrumbs | none | Home / Collection / Product |
| Gallery overlays | none | BEST SELLER pill + wishlist heart |
| Right column order | title → price → variants → buy → desc | breadcrumbs → vendor → share → title → price+loved → reviews → coupon → stock alert → variants → trust markers → delivery → qty → buy → payment guarantee → 4 collapsibles |
| Standalone trust-markers section | below product | moved into right column as a block |
| Reviews | Judge.me carousel (raw) | "Customer Stories" wrapper section with branded header + WRITE A REVIEW |
| "Behind the Seams" 3-up | none | new section between PDP and reviews |
| You may also like | basic, square images | "You May Also Like" with portrait images and secondary-image hover |
| Footer | minimal Dawn footer | brand-cream skin, 4-column |
| Mobile floating buy bar | none | qty + Add to Cart + Buy Now (mobile only) |
| Locale strings | n/a | added `general.breadcrumbs.home`, `accessibility.breadcrumbs`, `products.product.add_to_wishlist`, `products.product.buy_it_now` |

---

## 2. New files

### Snippets
- `snippets/breadcrumbs.liquid` — Home / collection / product breadcrumb.
- `snippets/wishlist-button.liquid` — heart toggle button.
- `snippets/product-image-overlays.liquid` — wraps best-seller pill + wishlist heart, sits over the gallery.
- `snippets/delivery-estimation.liquid` — 3-step timeline (Order Now → Shipping → At your Door).
- `snippets/payment-guarantee.liquid` — Secure Checkout Guaranteed card with payment-method chips.
- `snippets/floating-buy-bar.liquid` — mobile-only sticky bottom bar.

### Sections
- `sections/behind-the-seams.liquid` — 3-column brand-story section.
- `sections/customer-stories.liquid` — branded wrapper around the Judge.me featured carousel app block.

### Assets
- `assets/wishlist.js` — localStorage wishlist toggle.
- `assets/floating-buy-bar.js` — IntersectionObserver hide/show + form submission glue.
- `assets/section-behind-the-seams.css`
- `assets/component-floating-buy-bar.css`

### Modified
- `sections/main-product.liquid` — registered 4 new block types and rendered them.
- `assets/section-main-product.css` — appended redesign block.
- `assets/section-footer.css` — appended brand-cream skin.
- `templates/product.json` — new block order, default content for every new block, swapped trust-markers section for inline block, replaced apps section with `customer-stories`.
- `locales/en.default.json` — added 4 new strings.

---

## 3. Configuring the product page in the admin

Open: **Online Store → Themes → Customize → Templates → Default product**.

### 3.1 Right-column block order (drag and drop)

Recommended order matching the mockup:

1. **Breadcrumbs**
2. **Image overlays** *(invisible block — it places overlays on the gallery)*
3. **Text** — vendor / brand label (e.g. "KHANAK EXCLUSIVE")
4. **Share**
5. **Title**
6. **Price**
7. **Loved badge**
8. **Judge.me preview badge** (app block)
9. **Coupon code badge**
10. **Limited stock alert**
11. **Pop-up** (Size Chart link → Find My Size)
12. **Variant picker**
13. **Trust markers**
14. **Delivery estimation**
15. **Quantity selector**
16. **Buy buttons**
17. **Payment guarantee**
18. **Avada Order Limits** (app block)
19. **Collapsible row** — Product Description
20. **Collapsible row** — Product Care
21. **Collapsible row** — Shipping & Returns
22. **Collapsible row** — Offers

> The block **Image overlays** does not render in the column — it only enables the BEST SELLER pill and wishlist heart on top of the gallery. Keep it in the block list so its settings are reachable.

### 3.2 Block-by-block settings

#### Breadcrumbs
No settings. Renders Home › first product collection › product title.

#### Image overlays
- **Always show 'Best Seller' pill** *(checkbox, default off)* — when off, pill only appears for products tagged `best-seller` or with metafield `custom.best_seller = true`.
- **Best seller label** — defaults to `BEST SELLER`.
- **Show wishlist heart** *(checkbox, default on)*.

#### Text (vendor)
- **Text** — `<strong>KHANAK EXCLUSIVE</strong>` (richtext).
- **Text style** — `uppercase`.

#### Share
- **Share label** — `Share` (used as accessibility text; the icon-only button is shown).

#### Title
No settings. Renders `product.title`.

#### Price
No settings. Bolder type comes from CSS. Sale and sold-out badges are automatic.

#### Loved badge
- **Prefix text** — `Loved by`
- **Count or number** — `1000+`
- **Suffix text** — `shoppers`

#### Coupon code badge
- **Title** — `First Purchase Gift`
- **Coupon code** — `WELCOME10` (the COPY CODE button copies this exact value)
- **Discount description** — `for 10% off`
- **Copy button label** — `COPY CODE`
- **Background color / Text color** — defaults `#ffe4ec` / `#b91c4a`

#### Limited stock alert
Two thresholds. Visible only when the variant has Shopify-managed inventory.
- **Selling fast** — title, message, threshold (default 10).
- **Almost gone** — title, message, threshold (default 3).
- Use `[[count]]` and `[[size]]` placeholders inside messages.

#### Pop-up (Size Chart)
- **Text** — `Size Chart`
- **Page** — pick the size-chart page (must already exist in Online Store → Pages).

#### Variant picker
- **Picker type** — `button` (renders size as buttons; color uses swatches automatically).
- **Swatch shape** — `circle`.
- The "FIND MY SIZE" link in the right of the size row is auto-rendered when a Pop-up block exists.

#### Trust markers (inline block)
Same schema as the standalone `trust-markers` section. Three markers configurable; each has icon, title, subtext.
- Default: Secure Checkout / 7-Day Easy Returns / Handcrafted Quality.
- Icons: `lock`, `return`, `heart`, `truck`, `shield`.

#### Delivery estimation
Renders dates dynamically from "now."
- **Days until dispatch** *(default 1)* — feeds the Shipping date.
- **Days until delivery** *(default 5)* — feeds the At Your Door date.
- **Step 1 / 2 / 3 labels and subtexts** — fully editable copy.

> Dates appear as e.g. `BY 02 MAY` and update automatically every page load.

#### Quantity selector
No settings.

#### Buy buttons
- **Show dynamic checkout button** *(default on)* — Apple Pay / Google Pay / PayPal.
- **Show gift card recipient form** *(default on)*.

#### Payment guarantee
- **Heading** — `Secure Checkout Guaranteed`
- **Subtext** — `Encrypted payments • Trusted payment partners`
- **Payment methods (comma-separated)** — codes rendered as chips. Default: `upi,gpay,visa,mastercard,rupay,paypal,emi`. Add/remove codes; each becomes a `.product__payment-method--<code>` chip with brand color (UPI, GPay, Visa, MasterCard, PayPal, RuPay are pre-styled; new codes get the neutral default).

#### Collapsible rows (4 of them)
Each row has:
- **Heading**
- **Icon** — pick from the icon library (`leaf`, `washing`, `truck`, `price_tag`, etc.).
- **Show product description** *(checkbox, default off)* — when on, renders `product.description` (from **Products → [product] → Description**) at the top of the row. Use this for the Product Description tab.
- **Row content** — richtext (rendered after the description if both are set).
- **Page** — optional; if set, the page's content is appended below the row content.

Defaults shipped:
- Product Description (icon `leaf`, **Show product description = on**, content empty).
- Product Care (icon `washing`, "Dry clean only…").
- Shipping & Returns (icon `truck`, "Dispatched within 24 hours…").
- Offers (icon `price_tag`, "BUY 1 GET 10% OFF…").

> Edit the product copy in **Products → [product] → Description**. It appears in the Product Description collapsible automatically because that block has **Show product description** ticked.

### 3.3 Page-level sections (under the product info block)

#### Behind the Seams
A 3-column brand story section. Drag to reorder if needed.
- Section settings: color scheme, background color (default `#fdfaf6`), eyebrow (`BEHIND THE SEAMS`), heading (`Artisan Hand-Painting`), intro paragraph, top/bottom padding.
- Each **Feature** block: image, title, description.
- Default 3 features ship: 100% Pure Organza, Hand-Painted Art, Eco-Conscious. Replace the images via image picker.
- Section preset is enabled on **Product**, **Page**, and **Home** templates — reuse it elsewhere if useful.

#### Customer Stories
Wrapper around the Judge.me featured carousel.
- Section settings: heading (`Customer Stories`), summary text override, write-a-review URL (default `/pages/write-a-review`), button label (`Write a Review`).
- Inside the section, the Judge.me **Featured Carousel** app block renders the actual reviews.
- The summary line auto-pulls from `product.metafields.reviews.rating` if you leave summary text blank.
- If you don't have a Write A Review page yet, create one at **Online Store → Pages → Add page → handle: write-a-review** with Judge.me's "Write a review" snippet.

#### Related products ("You May Also Like")
- Heading — `You May Also Like`.
- Image ratio — `portrait` (matches mockup).
- Show secondary image — on (hover swap from `card-product.liquid`).
- Driven by Shopify's recommendation API automatically; no per-product config needed.

---

## 4. Per-product setup (in Products → [product])

These are the things that vary per product:

### Mark a product as a Best Seller
Two equivalent options:
- Add the tag **`best-seller`** to the product (lowest friction).
- *Or* create a metafield: namespace `custom`, key `best_seller`, type Boolean. Set it to true on best-seller products.

The pill renders automatically when either is true. To force the pill on every product (e.g. promo period), tick **Always show 'Best Seller' pill** in the Image overlays block instead.

### Variant images for color swatches
Upload one image per color variant under **Variants → [variant] → Image**. The variant picker renders these as circular swatches in the order options are listed.

### Stock-alert behavior
Only fires when **Track quantity** is enabled (Shopify-managed inventory) on the variant. Set inventory at or below the configured threshold to make alerts appear.

### Coupon code
The COPY CODE button copies the exact value of the **Coupon code** setting. Update the code in the block setting (not in the product) when you change the promo.

### Description (in collapsibles)
Goes into the **Product Description** collapsible automatically. Use rich text with paragraphs/bullets — they style the same as the rest of the section.

---

## 5. Wishlist behavior

- Backed by `localStorage`, key `khanak_wishlist`, value is an array of product handles.
- No app installed; wishlists do **not** sync to the customer account or to the merchant.
- Toggling the heart adds/removes the handle. Persists across page navigations on the same browser.
- To upgrade to a real wishlist later (Shopify Wishlist Plus, Smart Wishlist, etc.), replace `snippets/wishlist-button.liquid` with the app's button and remove the `wishlist.js` script include in `sections/main-product.liquid`.

---

## 6. Floating buy bar (mobile)

- Appears only on screens `< 750px`.
- Hidden while the desktop **Buy buttons** block is in viewport (uses IntersectionObserver on `#ProductSubmitButton-{section.id}`).
- Add-to-Cart triggers the same form submission as the main button.
- Buy Now triggers the dynamic-checkout button if available, otherwise falls back to a `/cart` redirect.
- The qty in the bar syncs with the main `Quantity-{section.id}` input on submit.
- No admin configuration; renders automatically.

---

## 7. Footer configuration

The footer file (`sections/footer.liquid`) is unchanged in markup; only `assets/section-footer.css` was reskinned. Configure content from **Theme editor → Footer**.

Recommended block layout (4 columns on desktop):

1. **Brand information** — uses the global brand image / headline / description from **Theme settings → Brand information** + social icons.
2. **Menu** — heading "Client Services" — point at a menu (Contact Us / Shipping Policy / Returns & Exchanges / Size Guide).
3. **Menu** — heading "The House" — point at a menu (Our Story / Sustainability / Press & Media / Careers).
4. **Newsletter is enabled at the section level**, not as a block — toggle "Show email signup" and edit "Newsletter heading" in section settings.

Color scheme — current footer-group uses `scheme-4`; the brand pink-cream tone is applied directly via `.footer { background: #f7e6e2; color: #5b1230; }` so it works regardless of the chosen scheme. To change the tone, edit `assets/section-footer.css` (look for `Khanak brand footer skin`).

---

## 8. Localization

Strings added to `locales/en.default.json` only:

```
general.breadcrumbs.home              → "Home"
accessibility.breadcrumbs             → "Breadcrumbs"
products.product.add_to_wishlist      → "Add to wishlist"
products.product.buy_it_now           → "Buy it now"
```

For non-English locales, Shopify falls back to `en.default.json` automatically when a key is missing — no urgent action. If you want clean theme-check passes per locale, copy the same keys into `locales/<locale>.json` with translations.

---

## 9. Apps preserved

These app integrations remain wired up and unchanged:

| App | Block | Location |
|---|---|---|
| Judge.me Reviews — Preview Badge | inside `main` section | between Title and Price |
| Judge.me Reviews — Featured Carousel | inside `customer-stories` section | replaces previous standalone apps section |
| Avada Order Limits | inside `main` section | after Buy buttons |
| Whatmore Shoppable Videos | available as @app block | not in default template; add via theme editor if needed |
| Essential Upsell | available as @app block / app embed | enable via theme editor |
| Ecomsend Popups | bottom `apps` section | preserved |

---

## 10. Testing checklist

Run on a dev/staging theme via `shopify theme dev` and verify:

- [ ] Right-column block order matches mockup.
- [ ] Color swatches change gallery + price + stock alert (existing pub/sub still works).
- [ ] COPY CODE copies `WELCOME10` (or the configured code).
- [ ] Coupon and stock alert render in **separate** rounded containers.
- [ ] Loved badge sits to the right of price.
- [ ] Judge.me preview badge appears below the price (not below the title).
- [ ] FIND MY SIZE link opens the size-chart popup.
- [ ] Trust markers row renders inside the right column (3-up).
- [ ] Delivery dates update based on `dispatch_days` / `delivery_days` settings.
- [ ] Payment guarantee chips render in the configured order.
- [ ] All 4 collapsibles open / close.
- [ ] Behind the Seams renders 3-up on desktop, stacks on mobile.
- [ ] Customer Stories shows "WRITE A REVIEW" button → review form.
- [ ] You May Also Like pulls 4 products with portrait images and hover swap.
- [ ] Footer is 4-column on desktop, single-column stack on mobile, brand-pink background.
- [ ] BEST SELLER pill renders only when the product has tag `best-seller` (or always-show is on).
- [ ] Wishlist heart toggles, persists across reloads.
- [ ] Mobile-only floating buy bar appears after scrolling past the buy buttons; hidden on `≥ 750px`.
- [ ] Add-to-Cart from the floating bar adds to the cart.
- [ ] Buy Now from the floating bar starts a dynamic checkout (or `/cart` fallback).
- [ ] No theme editor liquid errors. No new console errors.
- [ ] Lighthouse mobile score ≥ pre-redesign baseline.

---

## 11. Common pitfalls

- **`config/settings_data.json` drift** — never edit this file directly; let Shopify manage it through the editor.
- **Removing the Image overlays block** disables both the best-seller pill and the wishlist heart. Keep the block in the right column.
- **Variant picker is `limit: 1`** — only one instance allowed. Color swatches and size buttons render together inside this single block based on the product's option types.
- **Behind the Seams images** — when you remove a feature block, the placeholder SVG appears. Always set an image or delete the block.
- **Customer Stories without Judge.me** — if Judge.me is uninstalled, the section header still renders but the carousel slot is empty. Either remove the section or replace the app block.
- **Floating buy bar blocked by chat widgets** — if a chat icon (e.g. Tidio, Crisp) is positioned bottom-right, increase its `bottom` offset so it doesn't overlap the bar.
