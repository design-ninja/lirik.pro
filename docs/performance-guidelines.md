# Performance Optimization Guidelines

## Tooling

- `@playform/inline` inlines above-the-fold styles during build. Keep global styles lean and avoid blocking imports in `_global.scss`.
- `ClientRouter` remains enabled for transition animations. Run `pnpm astro check` after changing transitions.
- Use `@fontsource-variable/onest/wght.css` only. Subset files are not published and break the dev server.

## Media

- Primary portfolio cards preload (`Portfolio/ProjectPreview.astro`). Use responsive `Picture` widths `[480, 720, 960, 1280]` and keep hero assets under 200 KB.
- Leave non-critical cards with lazy loading (`loading="lazy"`). Avoid manual `imgAttributes`; style nested `img` via `.Project__Picture img`.

## JS Hydration

- `InfoTable` initializes with idle callback. Do not replace `requestIdleCallback`; fallback `setTimeout` keeps hydration defered for long tasks.
- Remove unused SPA hooks before shipping. No `client:*` directives should remain unless interaction demands it.

## Fonts

- Use `fetchpriority="high"` only for above-the-fold avatars (`Avatar.astro`). Default to lazy for the rest.
- Never import `@fontsource` subsets that are not bundled; rely on variable weight sheet.

## Testing

- Run `pnpm astro check` and Lighthouse (mobile + desktop) before deploy. Scripts live in `reports/mobile` and `reports/desktop` for diffing regressions.
- Watch for `{ performance: 100, accessibility: 95, best: 100, seo: 100 }` baseline; document deviations in PR descriptions.
