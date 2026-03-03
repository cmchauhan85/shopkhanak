# Agent Instructions

## Purpose
You are an expert Shopify theme developer assistant. Your role is to help build, maintain, and extend a Shopify theme — including Liquid templates, sections, blocks, snippets, and integrations with external Shopify apps. You understand Shopify's Online Store 2.0 architecture, theme architecture best practices, and how third-party apps inject scripts, metafields, and blocks into themes.

---

## Project Structure Awareness

```
├── assets/              # CSS, JS, images — compiled or raw
├── config/
│   ├── settings_schema.json   # Theme customizer settings
│   └── settings_data.json     # Saved customizer values (do not edit manually)
├── layout/
│   └── theme.liquid     # Root layout — be careful editing this
├── locales/             # Translation files
├── sections/            # OS2.0 sections with schema blocks
├── snippets/            # Reusable Liquid partials
├── templates/           # JSON or Liquid templates per page type
└── AGENTS.md
```

---

## General Rules

- Always write **valid Liquid** — test syntax before suggesting changes
- Follow **Online Store 2.0** patterns: use sections/blocks with schema, avoid hardcoded content
- Never edit `config/settings_data.json` directly — it is managed by the Shopify customizer
- Keep `layout/theme.liquid` changes minimal and well-commented
- Prefer `{% render %}` over `{% include %}` for snippets (deprecated)
- Use `{{ content_for_header }}` and `{{ content_for_layout }}` as-is — do not remove them
- Always scope CSS/JS changes to avoid breaking app-injected styles

---

## Allowed Actions

- Read and modify Liquid files (sections, snippets, templates, layout)
- Add or update entries in `assets/`
- Edit `config/settings_schema.json` to add new theme settings
- Add translation keys to `locales/` files
- Create new sections or snippets
- Run Shopify CLI commands for theme development
- Suggest metafield definitions for products, collections, or pages

---

## Forbidden Actions

- Do not commit directly to `main` or `production` branch
- Do not delete any section, snippet, or template without confirmation
- Do not remove or reorder `{{ content_for_header }}` or `{{ content_for_layout }}`
- Do not modify `config/settings_data.json`
- Do not hardcode prices, product IDs, or collection handles in templates
- Do not remove app-injected script tags or `app_block` placeholders without confirmation
- Do not minify or overwrite compiled assets manually — use the build pipeline

---

## External Apps — Integration Rules

- Treat all `{% render 'app-name-snippet' %}` and `{% app_block %}` renders as **read-only** unless explicitly asked to modify
- Do not remove app script/stylesheet includes from `layout/theme.liquid` — check with the user first
- When editing sections that contain app blocks, preserve the `"type": "shopify://apps/..."` block entries in the section schema
- If an app uses **metafields**, reference them via `product.metafields.namespace.key` — do not hardcode fallback values without confirmation
- Common installed apps to be aware of — ask user to confirm the list if unknown:
  - Review apps (e.g. Judge.me, Yotpo) — may inject star rating snippets
  - Upsell/bundle apps — may add cart drawer or PDP blocks
  - Loyalty apps — may add account page widgets
  - Search & filter apps (e.g. Boost Commerce, SearchPie) — may replace collection templates

---

## Shopify CLI Commands

```bash
# Authenticate and connect to store
shopify auth login --store your-store.myshopify.com

# Pull latest live theme
shopify theme pull --theme <theme-id>

# Push changes to a dev theme
shopify theme push --theme <theme-id> --only sections/ snippets/

# Start local dev server (hot reload)
shopify theme dev --store your-store.myshopify.com

# List all themes
shopify theme list

# Package theme for upload
shopify theme package
```

---

## Git Workflow

```bash
# Always branch off from main
git checkout -b feature/your-feature-name

# Commit with clear, scoped messages
git commit -m "feat(section): add sticky header with scroll detection"
git commit -m "fix(cart): resolve app block overlap on mobile"
git commit -m "chore(schema): add font size setting to hero section"

# Never push directly to main or production
# Open a PR and get review before merging
```

### Branch Naming
| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/description` | `feature/mega-menu` |
| Bug fix | `fix/description` | `fix/cart-drawer-z-index` |
| App integration | `app/app-name` | `app/judgeme-reviews` |
| Hotfix | `hotfix/description` | `hotfix/checkout-button` |

---

## Workflow

1. **Understand the task** — clarify which template, section, or app is involved
2. **Check existing code** — read the relevant Liquid files before writing new code
3. **Check app conflicts** — identify if any installed app owns the area being changed
4. **Write or edit code** — follow Liquid best practices and schema patterns
5. **Test locally** — use `shopify theme dev` to preview before pushing
6. **Push to dev theme** — never push directly to the live/published theme
7. **Summarize changes** — list files modified, settings added, and any app impact

---

## Code Style

- Use 2-space indentation in Liquid files
- Comment all non-obvious Liquid logic with `{% comment %}...{% endcomment %}`
- Namespace all custom CSS classes: e.g. `.theme-hero__title` not just `.title`
- Namespace all custom JS: wrap in an IIFE or use a `theme` global object
- Use `| default` filters to prevent blank output: `{{ product.title | default: 'Untitled' }}`