# Claude Instructions — Shopify Theme Project

## Project Overview
This is a Shopify theme project built on **Online Store 2.0** architecture. The theme includes custom sections, snippets, and integrations with multiple third-party Shopify apps. Claude assists with Liquid templating, JavaScript, CSS, schema definitions, and app integrations.

---

## Persistent Memory — Always Remember

- This is a **Shopify theme** — not a Node/React/Next.js app
- Use **Liquid** as the primary templating language
- The theme follows **OS2.0** — sections with JSON schema, blocks, and presets
- External apps are installed and inject their own code — treat their files as fragile
- Never suggest editing `config/settings_data.json` directly
- Always prefer `{% render %}` over `{% include %}` (deprecated in Shopify)
- `{{ content_for_header }}` and `{{ content_for_layout }}` must never be removed

---

## Stack

| Layer | Technology |
|---|---|
| Templating | Shopify Liquid |
| Styles | CSS / SCSS (in `assets/`) |
| Scripts | Vanilla JS or lightweight libraries |
| Theme config | `config/settings_schema.json` |
| Translations | `locales/*.json` |
| CLI tool | Shopify CLI 3.x |
| Version control | Git |

---

## File Hierarchy — What Claude Should Know

```
├── assets/              # CSS, JS, fonts, images
├── config/
│   ├── settings_schema.json   # Editable — theme customizer settings
│   └── settings_data.json     # DO NOT EDIT — managed by Shopify
├── layout/
│   └── theme.liquid     # Root layout — edit with caution
├── locales/             # i18n translation files
├── sections/            # OS2.0 sections (Liquid + schema)
├── snippets/            # Reusable partials
└── templates/           # Page-type templates (JSON or Liquid)
```

---

## How Claude Should Respond

### When Asked to Write Liquid
- Always use valid, clean Liquid syntax
- Include `{% schema %}` blocks when creating new sections
- Add `{% stylesheet %}` and `{% javascript %}` blocks inside sections where relevant
- Use `{{ section.settings.variable }}` for all customizer-driven values
- Use `| default:` filters to handle empty values gracefully

### When Asked to Edit Existing Files
- Ask to see the current file content before rewriting
- Make surgical edits — do not rewrite entire files unless asked
- Preserve all app-related snippets, blocks, and script includes

### When Asked About App Integrations
- Identify which app owns the code before modifying
- Suggest adding app blocks via the `"type": "shopify://apps/..."` schema pattern
- Remind the user to test on a dev theme before pushing to live

### When Asked About Performance
- Suggest lazy loading for images using `loading="lazy"`
- Recommend deferring non-critical JS
- Avoid inline styles — use CSS custom properties or section settings instead
- Flag any render-blocking resources

---

## Coding Conventions

### Liquid
```liquid
{% comment %} Always comment non-obvious logic {% endcomment %}

{% assign product_title = product.title | default: 'Untitled' %}

{% render 'snippet-name', variable: value %}

{% if section.settings.show_title %}
  <h2 class="section__title">{{ section.settings.title }}</h2>
{% endif %}
```

### Section Schema Template
```liquid
{% schema %}
{
  "name": "Section Name",
  "tag": "section",
  "class": "section-class",
  "settings": [
    {
      "type": "text",
      "id": "title",
      "label": "Heading",
      "default": "Default Heading"
    }
  ],
  "blocks": [],
  "presets": [
    {
      "name": "Section Name"
    }
  ]
}
{% endschema %}
```

### CSS Naming
```css
/* Always namespace to avoid app conflicts */
.theme-[component]__[element]--[modifier]

/* Examples */
.theme-hero__title
.theme-card__image--rounded
.theme-nav__link--active
```

### JavaScript
```javascript
// Wrap in theme namespace
window.theme = window.theme || {};

theme.ComponentName = {
  init() { ... },
  destroy() { ... }
};

document.addEventListener('DOMContentLoaded', () => {
  theme.ComponentName.init();
});
```

---

## Installed External Apps

> Update this list with your actual apps

| App | Purpose | Key Files / Snippets |
|---|---|---|
| App 1 | e.g. Reviews | `snippets/app1-reviews.liquid` |
| App 2 | e.g. Upsell | Injects via app block in cart section |
| App 3 | e.g. Search & Filter | Replaces `templates/collection.json` |

### Rules for App Files
- Do not delete or rename app-generated snippets
- Do not remove script/stylesheet includes added by apps in `theme.liquid`
- When modifying sections that contain app blocks, preserve `"type": "shopify://apps/..."` entries in schema

---

## Dev Workflow Claude Should Follow

1. Understand what page/section/snippet is being changed
2. Ask for the current file if not provided
3. Check if any external app owns or affects that area
4. Write the change with minimal footprint
5. Remind to test on a **dev/staging theme** first
6. Summarize what was changed and why

---

## Common Shopify Gotchas — Claude Should Flag These

- `settings_data.json` drift when switching branches — warn user
- App blocks disappearing if section schema is incorrectly edited
- `content_for_header` must stay in `<head>` — never move it
- Liquid `assign` inside loops can cause unintended scope leaks
- `forloop.index` starts at 1, not 0
- Images should use `| image_url` filter + `<img>` with `width`/`height` for CLS
- Avoid `javascript:` or inline `onclick` — use `data-` attributes and event listeners