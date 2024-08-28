<p align="center">
  <img src="https://i.postimg.cc/T1Wk3khh/logo.png" width="112" alt="o7 Logo" />
</p>

<h1 align="center">@o7/icon</h1>

<p align="center">The most efficient Svelte icon library,</p>
<p align="center">using <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use">SVG sprites</a> to minimize your load speed.</p>
<br />

## Basic Usage

<!-- prettier-ignore -->
```svelte
<script>
  import { UserPlus } from '@o7/icon/lucide';
</script>

<UserPlus />
```

When you first use an icon, it includes the full svg. Any subsequent uses only need this:

```html
<svg class="🟃i" viewBox="0 0 24 24"><use href="#🟃5"></use></svg>
```

## Recommended: Vite Plugin

If you don't use the Vite plugin, dev mode will be MUCH slower because Vite has to parse every icon when you import one.

Usage:

Add the plugin to your `vite.config.ts`:

<!-- prettier-ignore -->
```ts
import { o7Icon } from '@o7/icon/vite';

export default defineConfig({
  plugins: [o7Icon()]
});
```

This automatically rewrites imports behind the scenes:

```ts
import { UserPlus } from '@o7/icon/lucide';
// ↓
import UserPlus from '@o7/icon/lucide/UserPlus';
```

## Included Icon Packs:

- [Lucide](https://lucide.dev) (`@o7/icon/lucide`)
- [Heroicons](https://heroicons.com) (`@o7/icon/heroicons`, `@o7/icon/heroicons/solid`)
- [Material Design](https://fonts.google.com/icons) (`@o7/icon/material`, `@o7/icon/material/solid`)
- [Remix Icon](https://remixicon.com) (`@o7/icon/remix`, `@o7/icon/remix/solid`)

## Changelog

(icons are automatically updated daily as the source repos are updated)

### 0.3.0

- Fix heroicons/outline
- Add Vite plugin

### 0.2.0

- Slightly shrink install size
- Fix icons not working when unmounted and remounted

### 0.0.13

- Add RemixIcon

### 0.0.6

- Add material icons

```

```
