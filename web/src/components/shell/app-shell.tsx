"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  GitCompareArrows,
  Network,
  Settings as SettingsIcon,
  LogOut,
  LogIn,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/providers/auth-provider";
import { useAppearance } from "@/lib/providers/appearance-provider";

const NAV_ITEMS = [
  { href: "/", label: "Overview", icon: Compass },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/map", label: "Mind map", icon: Network },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserMenu() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  if (!currentUser) {
    return (
      <Button size="sm" onClick={() => router.push("/login")}>
        <LogIn className="size-4" />
        Sign in
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="flex items-center gap-2 rounded-full border border-transparent p-1 pr-2.5 transition-colors hover:border-border hover:bg-muted">
            <Avatar className="size-7">
              <AvatarFallback>{initials(currentUser.name)}</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:inline">
              {currentUser.name}
            </span>
          </button>
        }
      />
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-medium">{currentUser.name}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {currentUser.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={
            <Link href="/settings">
              <SettingsIcon />
              Settings
            </Link>
          }
        />
        <DropdownMenuItem
          variant="destructive"
          onClick={() => {
            logout();
            router.push("/login");
          }}
        >
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavLinks({
  orientation,
  onNavigate,
}: {
  orientation: "vertical" | "horizontal";
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  return (
    <nav
      className={cn(
        "flex gap-1",
        orientation === "vertical" ? "flex-col" : "flex-row items-center",
      )}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              orientation === "vertical" ? "w-full" : "",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const { navPosition, density } = useAppearance();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);
  const pathname = usePathname();

  // Auth pages render standalone, without the app shell chrome.
  if (pathname === "/login") {
    return <>{children}</>;
  }

  const paddingClass = density === "compact" ? "px-4 py-4" : "px-6 py-8";
  const gapClass = density === "compact" ? "gap-4" : "gap-8";

  if (navPosition === "top") {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Sparkles className="size-4" />
                </span>
                <span className="hidden sm:inline">1000 Profitable Ideas</span>
              </Link>
              <div className="hidden md:block">
                <NavLinks orientation="horizontal" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserMenu />
              <button
                className="md:hidden"
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Toggle navigation"
              >
                {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </div>
          {mobileNavOpen && (
            <div className="border-t px-6 py-3 md:hidden">
              <NavLinks
                orientation="vertical"
                onNavigate={() => setMobileNavOpen(false)}
              />
            </div>
          )}
        </header>
        <main className={cn("mx-auto w-full max-w-7xl flex-1", paddingClass)}>
          {children}
        </main>
      </div>
    );
  }

  // Sidebar layout
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col border-r bg-card/40 lg:flex">
        <div className="flex items-center gap-2 px-5 py-5 font-semibold">
          <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </span>
          1000 Profitable Ideas
        </div>
        <div className={cn("flex-1 px-3", gapClass)}>
          <NavLinks orientation="vertical" />
        </div>
        <div className="border-t p-3">
          <UserMenu />
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b px-4 py-3 lg:hidden">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="size-4" />
            </span>
            1000 Profitable Ideas
          </Link>
          <div className="flex items-center gap-2">
            <UserMenu />
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </header>
        {mobileNavOpen && (
          <div className="border-b px-4 py-3 lg:hidden">
            <NavLinks
              orientation="vertical"
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        )}
        <main className={cn("mx-auto w-full max-w-7xl flex-1", paddingClass)}>
          {children}
        </main>
      </div>
    </div>
  );
}
