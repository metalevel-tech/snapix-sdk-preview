import { poweredByData, routeData } from "@/routes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import GithubLogo from "@/components/theme/GithubLogo";

const logoDictionary: Record<string, () => React.JSX.Element> = {
  "githubLogo": GithubLogo,
} as const;

export default function Page() {
  return (
    <div className="flex min-w-0 flex-col gap-4 text-sm">
      <h1 className="font-bold text-3xl sm:text-5xl tracking-tight text-primary/85 dark:text-primary/70">SnapiX SDK Demo Implementations</h1>

      <div className="font-mono text-xs text-muted-foreground pb-4">
        (Press <kbd>d</kbd> to toggle dark mode)
      </div>

      <div className="grid gap-8 sm:grid-cols-2">
        {routeData.map(({ title, description, coverImage, route, special }) => {
          const card = (
            <Card className={cn(
              "rounded-md cursor-pointer transition-all duration-300 py-0 ring-1 dark:ring-2 ",
              special
                ? "relative z-2 p-0 w-full scale-x-[0.992] scale-y-[0.99] dark:scale-x-[0.99] dark:scale-y-[0.985] origin-center"
                : "hover:shadow-xl ring-secondary hover:ring-primary/15 dark:ring-white/20 dark:hover:ring-white/40"
            )}>
              <CardContent className="p-0 border-0">
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

      <div className="w-full flex items-center gap-3 justify-start mt-6 text-muted-foreground">
        <span className="hidden">Powered by</span>
        {poweredByData.map(({ name, logoUrl, url, logo }, index) => (
          <div key={name} className="fancy-hover border-0">
            <a key={name} href={url} target="_blank" rel="noopener noreferrer" className="  inline-flex items-center gap-2 text-lg rounded-md py-1 px-2 bg-background border-0">
              {logo ? logoDictionary[logo]() : (
                <Image src={logoUrl} alt={`${name} logo`} width={24} height={24}
                  className={cn("w-6 h-6 object-contain", index > 0 && 'grayscale-15')}
                  unoptimized />
              )}
              <span>{name}</span>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
