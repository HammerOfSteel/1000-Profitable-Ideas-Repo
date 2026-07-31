"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RequireAuth } from "@/lib/providers/require-auth";
import { useAuth } from "@/lib/providers/auth-provider";
import { useAppearance } from "@/lib/providers/appearance-provider";
import { COLOR_PRESETS } from "@/lib/theme-presets";
import { UsersManagementPanel } from "@/components/settings/users-management-panel";

function ThemeModePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // Standard next-themes SSR-safe mount flag; theme is unknown until the
    // client hydrates, so this can't be a lazy useState initializer.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const options = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Laptop },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id)}
          className={cn(
            "flex flex-col items-center gap-2 rounded-xl border px-4 py-4 text-sm font-medium transition-colors",
            mounted && theme === id
              ? "border-primary bg-primary/5 text-primary"
              : "border-input hover:bg-muted",
          )}
        >
          <Icon className="size-5" />
          {label}
        </button>
      ))}
    </div>
  );
}

function ColorPresetPicker() {
  const { colorPreset, setColorPreset } = useAppearance();
  return (
    <div className="flex flex-wrap gap-3">
      {COLOR_PRESETS.map((preset) => (
        <button
          key={preset.id}
          type="button"
          onClick={() => setColorPreset(preset.id)}
          className={cn(
            "flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-colors",
            colorPreset === preset.id
              ? "border-primary bg-primary/5"
              : "border-input hover:bg-muted",
          )}
        >
          <span
            className="flex size-4 items-center justify-center rounded-full"
            style={{ backgroundColor: preset.swatch }}
          >
            {colorPreset === preset.id && (
              <Check className="size-3 text-white" strokeWidth={3} />
            )}
          </span>
          {preset.label}
        </button>
      ))}
    </div>
  );
}

function DensityPicker() {
  const { density, setDensity } = useAppearance();
  return (
    <div className="grid grid-cols-2 gap-3">
      {(
        [
          { id: "comfortable", label: "Comfortable", hint: "More breathing room" },
          { id: "compact", label: "Compact", hint: "Tighter, denser layout" },
        ] as const
      ).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setDensity(opt.id)}
          className={cn(
            "rounded-xl border px-4 py-3 text-left transition-colors",
            density === opt.id
              ? "border-primary bg-primary/5"
              : "border-input hover:bg-muted",
          )}
        >
          <div className="text-sm font-medium">{opt.label}</div>
          <div className="text-xs text-muted-foreground">{opt.hint}</div>
        </button>
      ))}
    </div>
  );
}

function NavPositionPicker() {
  const { navPosition, setNavPosition } = useAppearance();
  return (
    <div className="grid grid-cols-2 gap-3">
      {(
        [
          { id: "sidebar", label: "Sidebar", hint: "Navigation docked on the left" },
          { id: "top", label: "Top bar", hint: "Navigation along the top" },
        ] as const
      ).map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => setNavPosition(opt.id)}
          className={cn(
            "rounded-xl border px-4 py-3 text-left transition-colors",
            navPosition === opt.id
              ? "border-primary bg-primary/5"
              : "border-input hover:bg-muted",
          )}
        >
          <div className="text-sm font-medium">{opt.label}</div>
          <div className="text-xs text-muted-foreground">{opt.hint}</div>
        </button>
      ))}
    </div>
  );
}

function SettingsBody() {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Personalize how the console looks and manage who has access.
        </p>
      </div>

      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
        </TabsList>

        <TabsContent value="appearance" className="space-y-6 pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme mode</CardTitle>
              <CardDescription>
                Choose light, dark, or follow your system setting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ThemeModePicker />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accent color</CardTitle>
              <CardDescription>
                Applies to buttons, links, charts, and highlights in both light
                and dark mode.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ColorPresetPicker />
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Layout density</CardTitle>
                <CardDescription>
                  Controls spacing throughout the console.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DensityPicker />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Navigation position</CardTitle>
                <CardDescription>
                  Where the primary navigation is docked.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NavPositionPicker />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="users" className="space-y-6 pt-6">
            <UsersManagementPanel />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsBody />
    </RequireAuth>
  );
}
