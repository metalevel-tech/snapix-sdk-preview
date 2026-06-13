# snapix-sdk-preview

Next.js + shadcn/ui application for interactively testing and previewing the Snapix SDK packages - primarily `@metalevel/snapix-sdk-core` and future variants such as `sdk-react`.

## Purpose

- **Use as boilerplate for new Snapix SDK-based apps and demos**
- Validate SDK methods against the live Snapix API in a real Next.js environment
- Serve as a living integration test app for all `@metalevel/snapix-sdk-*` packages
- Preview UI patterns built on top of the SDK (upload flows, gallery browsing, AI generation, etc.)

## Get started

### Prerequisites

1. Go to [SnapiX](https://www.snapix.space/) and create your free account to get your API key. Tweak the permissions of the key from the web interface.
2. Create a `.env.local` file in this directory with the following content:

```env
SNAPIX_API_KEY=sk_snapix_key_WITH_WIDE_PERMISSIONS
NEXT_PUBLIC_SNAPIX_API_KEY=sk_snapix_key_WITH_READ_ONLY_PERMISSIONS
```

`SNAPIX_API_KEY` is mandatory. It is used for server-side API calls it will not be exposed to the public so it is safe to have edit and even delete permissions.

`NEXT_PUBLIC_SNAPIX_API_KEY` is optional. It is intended for client-side API calls and must have read-only permissions for security. If not provided, client-side calls will not work but server-side functionality will still be available.

### Running

```bash
pnpm i
```

```bash
pnpm dev
pnpm build
```

## Adding shadcn components

```bash
npx shadcn@latest add button
```

Components are placed in the `components/ui/` directory and imported as:

```tsx
import { Button } from "@/components/ui/button";
```

## Links

- [SnapiX SDK documentation](https://www.snapix.space/docs/sdk)
- [SnapiX SDK Core source](https://github.com/metalevel-tech/snapix-sdk-core)
- [SnapiX MCP documentation](https://www.snapix.space/docs/mcp)
