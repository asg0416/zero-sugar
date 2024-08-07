import type { Metadata, ResolvingMetadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header/header";
import { cn } from "@/lib/utils";
import Dialog from "@/components/custom-ui-dialog";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import dynamic from "next/dynamic";
import { fetchBaseMetadata } from "@/lib/metadata";

type Props = {
  params: { locale: string };
};

export async function generateMetadata(
  { params: locale }: Props,
): Promise<Metadata> {
  // 기본 메타데이터 가져오기 (예: API나 설정 파일에서)
  const baseMetadata = await fetchBaseMetadata(locale);

  return {
    title: {
      default: "Avocarbo",
      template: `%s`,
    },
    description:
      baseMetadata.description ||
      "당뇨 임산부를 위한 맞춤 영양 정보와 식품 단위 수 계산 서비스",
    keywords: [...baseMetadata.keywords],
    openGraph: {
      title: baseMetadata.ogTitle || `Avocarbo | 식품교환 식단 계산기`,
      description:
        baseMetadata.ogDescription ||
        "당뇨 임산부를 위한 맞춤 영양 정보와 식품 단위 수 계산 서비스",
      siteName: baseMetadata.siteName || "Avocarbo",
      locale: locale.locale,
      type: "website",
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_API_URL}/avocarbo-og.png`,
          width: 1200,
          height: 630,
          alt: "Avocarbo OG Image",
        },
      ],
    },

    // 기타 SEO 관련 메타데이터
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    icons: {
      icon: "/favicon.png",
    },

    alternates: {
      canonical: process.env.NEXT_PUBLIC_API_URL,
      languages: {
        "en-US": process.env.NEXT_PUBLIC_API_URL,
        "ko-KR": `${process.env.NEXT_PUBLIC_API_URL}/ko`,
      },
    },
  };
}

const inter = Inter({ subsets: ["latin"] });

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ko" }];
}

const ClientChannelTalkProvider = dynamic(
  () => import("@/components/client-channel-talk"),
  {
    suspense: true,
  }
);

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const session = await auth();
  const messages = await getMessages();
  const pluginKey = process.env.CHANNEL_TALK_PLUGIN_KEY;
  const secretKey = process.env.CHANNEL_TALK_SECRET_KEY;

  return (
    <SessionProvider session={session}>
      <html lang={locale}>
        <body
          className={cn(
            "h-auto min-h-full flex flex-col w-auto",
            inter.className
          )}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <ClientChannelTalkProvider
                channelTalkKey={{ pluginKey, secretKey }}
              >
                <Header />
                <Toaster />
                <Dialog />
                <div className="grow flex">{children}</div>
              </ClientChannelTalkProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
