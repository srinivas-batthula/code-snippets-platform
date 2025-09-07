// app/layout.tsx
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-gray-50 text-gray-900`} style={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignContent: 'center', flexDirection: 'column' }}>
                {/* Wrap the 'whole App' in 'Providers', So 'NextAuth Session' is available 'globally'... */}
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <main>{children}</main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
