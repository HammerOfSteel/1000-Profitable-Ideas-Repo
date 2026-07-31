import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { AppearanceProvider } from "@/lib/providers/appearance-provider";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/shell/app-shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "1000 Profitable Ideas — Analyst Console",
  description: "Evidence-backed project idea exploration",
};

// Applied before hydration so color preset / density / dark mode never
// flash the default value on first paint.
const noFlashScript = `
(function () {
  try {
    var appearance = JSON.parse(localStorage.getItem("app-appearance-settings-v1") || "{}");
    if (appearance.colorPreset) {
      document.documentElement.setAttribute("data-theme", appearance.colorPreset);
    }
    if (appearance.density) {
      document.documentElement.setAttribute("data-density", appearance.density);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AppearanceProvider>
            <AuthProvider>
              <TooltipProvider>
                <AppShell>{children}</AppShell>
              </TooltipProvider>
            </AuthProvider>
          </AppearanceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
