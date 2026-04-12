import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <h1 className="font-medium">Demo implementations of SnapiX SDK</h1>
          <Link href="/snapix-gallery-v1" className="block cursor-pointer">
            <Button className="mt-2 cursor-pointer">Snapix Gallery V1 Demo</Button>
          </Link>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  );
}
