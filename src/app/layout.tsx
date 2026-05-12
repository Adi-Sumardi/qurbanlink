import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { ErrorBoundary } from "@/components/common/error-boundary";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { OfflineIndicator } from "@/components/pwa/offline-indicator";
import { ServiceWorkerRegistrar } from "@/components/pwa/sw-registrar";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Tawzii Digital — Platform Distribusi Kurban Digital untuk Masjid",
    template: "%s | Tawzii Digital",
  },
  description:
    "Tawzii Digital — Platform distribusi kurban digital berbasis QR Code. Kelola pembagian daging kurban secara transparan, adil, dan real-time untuk masjid di seluruh Indonesia.",
  keywords: [
    'distribusi kurban', 'kurban digital', 'digital kurban', 'pembagian kurban',
    'qrcode kurban', 'qr code kurban', 'aplikasi kurban masjid', 'tawzii digital',
  ],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tawzii Digital",
    startupImage: "/icons/icon-512.png",
  },
  icons: {
    apple: "/logo.png",
    icon: "/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#004532",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${manrope.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <TooltipProvider>
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
              <Toaster richColors position="top-right" closeButton />
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
