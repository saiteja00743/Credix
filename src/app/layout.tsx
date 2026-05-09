import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import DemoWalkthrough from "@/components/DemoWalkthrough";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });

export const metadata: Metadata = {
  title: "CredexAI — AI Spend Audit & Optimization Platform",
  description:
    "Identify and eliminate AI tool waste. Credex audits your ChatGPT, Claude, Midjourney and 200+ AI subscriptions to uncover 18–38% in savings. Free intelligence report in seconds.",
  keywords: [
    "AI spend audit",
    "AI cost optimization",
    "SaaS spend management",
    "ChatGPT procurement",
    "AI tool ROI",
    "enterprise AI audit",
  ],
  openGraph: {
    title: "CredexAI — Stop Overpaying for AI Tools",
    description:
      "Free AI spend audit. Identify license waste, seat overlap, and tier mismatches across your entire AI stack.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-background text-on-surface antialiased font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <DemoWalkthrough />
        </ThemeProvider>
      </body>
    </html>
  );
}
