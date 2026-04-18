import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
          <h1 className="font-medium">Demo implementations of SnapiX SDK</h1>
        <div className="grid gap-4 grid-cols-2">
          <Link href="/snapix-gallery-v1" className="cursor-pointer flex flex-col gap-1 justify-center items-center">
            <Button className="mt-2 cursor-pointer">Snapix Gallery V1 Demo</Button>
            (Image in Single Gallery)
          </Link>

          <Link href="/snapix-gallery-v2" className="cursor-pointer flex flex-col gap-1 justify-center items-center">
            <Button className="mt-2 cursor-pointer">Snapix Gallery V2 Demo</Button>
            (Image in Multiple Galleries)
          </Link>

          <Link href="/snapix-gallery-v2c" className="cursor-pointer flex flex-col gap-1 justify-center items-center">
            <Button className="mt-2 cursor-pointer">Snapix Gallery V2C Demo</Button>
            (Image in Multiple Galleries Client-Side Fetching)
          </Link>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}
