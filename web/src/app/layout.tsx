// app/layout.tsx
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Wrap the 'whole App' in 'Providers', So 'NextAuth Session' is available 'globally'... */}
        <Providers>
          <main>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
