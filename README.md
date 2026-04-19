# snapix-sdk-preview

Next.js + shadcn/ui application for interactively testing and previewing the Snapix SDK packages - primarily `@metalevel/snapix-sdk-core` and future variants such as `sdk-react`.

## Purpose

- Validate SDK methods against the live Snapix API in a real Next.js environment
- Serve as a living integration test app for all `@metalevel/snapix-sdk-*` packages
- Preview UI patterns built on top of the SDK (upload flows, gallery browsing, AI generation, etc.)

## Running

From the **monorepo root**:

```bash
pnpm sdk-p:dev    # start dev server with turbopack
pnpm sdk-p:build  # production build
```

Or directly from this directory:

```bash
pnpm dev
pnpm build
```

## Adding SDK workspace dependencies

To use the local SDK inside this app, add it via the workspace protocol:

```bash
# from this directory
pnpm add @metalevel/snapix-sdk-core@workspace:^
```

Or edit `package.json` manually:

```json
"dependencies": {
  "@metalevel/snapix-sdk-core": "workspace:^"
}
```

Then run `pnpm i` from the monorepo root.

## Adding shadcn components

```bash
npx shadcn@latest add button
```

Components are placed in the `components/ui/` directory and imported as:

```tsx
import { Button } from "@/components/ui/button";
```

## Links

- [Snapix SDK documentation](https://www.snapix.space/docs/sdk)
- [SDK Core source](https://github.com/metalevel-tech/snapix-sdk-core)
