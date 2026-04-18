import { routeData } from "@/routes";
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-prose min-w-0 flex-col gap-4 text-sm leading-loose">
        <h1 className="font-bold text-5xl tracking-tighter">Demo implementations of SnapiX SDK</h1>

        <div className="font-mono text-xs text-muted-foreground pb-4">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>

        <div className="grid gap-8 grid-cols-2">
          {routeData.map(({ title, description, coverImage, route }) => (
            <Link
              key={route}
              href={route}
              className="cursor-pointer flex flex-col gap-1 justify-center items-center"
            >
              <Image
                src={coverImage}
                alt={title}
                width={300}
                height={200}
                className="w-72 h-40 object-cover rounded-md"
              />
              <h2 className="font-medium text-left w-full text-lg">{title}</h2>
              <p className="text-sm text-muted-foreground">{description}</p>

            </Link>
          ))}
        </div>


      </div>
    </div>
  );
}
