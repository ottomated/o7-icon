<p align="center">
  <img src="https://i.postimg.cc/T1Wk3khh/logo.png" width="112" alt="o7 Logo" />
</p>

<h1 align="center">@o7/icon</h1>

<p align="center">The most efficient Svelte icon library,</p>
<p align="center">using <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use">SVG sprites</a> to minimize your load speed.</p>
<br />

## Basic Usage

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

## Included Icon Packs:

- [Lucide](https://lucide.dev) (`@o7/icon/lucide`)
- [Heroicons](https://heroicons.com) (`@o7/icon/heroicons`, `@o7/icon/heroicons/solid`)
- [Material Design](https://fonts.google.com/icons) (`@o7/icon/material`, `@o7/icon/material/solid`)
- [Remix Icon](https://remixicon.com) (`@o7/icon/remix`, `@o7/icon/remix/solid`)
