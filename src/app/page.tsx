import { poweredByData, routeData } from "@/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";



export default function Page() {
  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-prose min-w-0 flex-col gap-4 text-sm leading-loose">
        <h1 className="font-bold text-5xl tracking-tight text-primary/85 dark:text-primary/70">Demo implementations of SnapiX SDK</h1>

        <div className="font-mono text-xs text-muted-foreground pb-4">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>

        <div className="grid gap-8 grid-cols-2">
          {routeData.map(({ title, description, coverImage, route, special }) => {
            const card = (
              <Card className={cn(
                "rounded-md cursor-pointer transition-all duration-300 py-0",
                special
                  ? "relative z-2 ring-0 scale-[0.99] origin-center -translate-x-px p-0"
                  : "hover:shadow-xl dark:hover:border-white/40 dark:border"
              )}>
                <CardContent className="p-0">
                  <Image
                    src={coverImage}
                    alt={title}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-t-md"
                    unoptimized
                  />
                </CardContent>
                <CardHeader className="pt-0 pb-4">
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
              </Card>
            );
            return (
              <Link key={route} href={`/${route}`}>
                {special ? <div className="fancy-border p-0 flex items-center justify-center">{card}</div> : card}
              </Link>
            );
          })}
        </div>
        <div className="w-full flex items-center gap-3 justify-start mt-4 text-muted-foreground">
          <span className="">Powered by</span>
          {poweredByData.map(({ name, logoUrl, websiteUrl }, index) => (
            <div key={name} className="fancy-hover border-0">
              <a key={name} href={websiteUrl} target="_blank" rel="noopener noreferrer" className="  inline-flex items-center gap-2 text-lg rounded-md py-1 px-2 bg-background border-0">
                <Image src={logoUrl} alt={`${name} logo`} width={24} height={24}
                  className={cn("w-6 h-6 object-contain", index > 0 && 'grayscale-15')}
                  unoptimized />
                <span>{name}</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
