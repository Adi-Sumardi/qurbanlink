import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { ServiceWorkerRegistrar } from "@/components/pwa/sw-registrar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "QurbanLink",
    template: "%s | QurbanLink",
  },
  description: "Platform distribusi daging hewan kurban digital",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "QurbanLink",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#16a34a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster richColors position="top-right" />
              <OfflineIndicator />
              <InstallPrompt />
              <ServiceWorkerRegistrar />
            </TooltipProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
