# shadcn/ui primitives

Vendored shadcn-style primitives built on the `radix-ui` package, themed via the
shadcn semantic CSS variables defined in `app/globals.css` (`--background`,
`--primary`, `--ring`, …) which are mapped onto the porcelain/cream palette.

`components.json` at the repo root points the shadcn CLI here (`"ui": "@/components/shadcn"`),
so when registry access is available you can pull more primitives with:

```bash
npx shadcn@latest add <component>
```

Note: the app's own design-system primitives live in `components/ui/` (Button,
Drawer, DataTable, …) and remain the first choice per CLAUDE.md. Use these
shadcn primitives for low-level behaviors (tooltips, separators) that the
design system does not cover.
