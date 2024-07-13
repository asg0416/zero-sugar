import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header/header";
import { cn } from "@/lib/utils";
import Dialog from "@/components/custom-ui-dialog";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth tutorial",
  description: "Auth tutorial",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body
          className={cn(
            "h-auto min-h-full flex flex-col w-auto",
            inter.className
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <Toaster />
            <Dialog />
            <div className="grow flex">{children}</div>
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
