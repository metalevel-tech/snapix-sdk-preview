import { Button } from "@/components/ui/button";
import { routeData } from "@/routes";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <h1 className="font-medium">Demo implementations of SnapiX SDK</h1>

        <div className="font-mono text-xs text-muted-foreground pb-4">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>

        <div className="grid gap-4 grid-cols-2">
          {routeData.map(({ title, description, coverImage, route }) => (
            <Link
              key={route}
              href={route}
              className="cursor-pointer flex flex-col gap-1 justify-center items-center"
            >
              {/* <Image
                src={coverImage}
                alt={title}
                width={200}
                height={200}
                className="w-40 h-40 object-cover rounded-md"
              /> */}
              <Button className="mt-2 cursor-pointer">{title}</Button>
              <p className="text-xs text-muted-foreground">{description}</p>

            </Link>
          ))}
        </div>


      </div>
    </div>
  );
}
