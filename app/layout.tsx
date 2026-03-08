import type { Metadata } from "next";
import { Fraunces, DM_Mono, Lora } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "katex/dist/katex.min.css";
import "./globals.css";

const fraunces = Fraunces({
    subsets: ["latin"],
    variable: "--font-fraunces",
    style: ["normal", "italic"],
    axes: ["opsz", "SOFT", "WONK"],
});

const dmMono = DM_Mono({
    subsets: ["latin"],
    variable: "--font-dm-mono",
    weight: ["300", "400", "500"],
    style: ["normal", "italic"],
});

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-lora",
    style: ["normal", "italic"],
});

export const metadata: Metadata = {
    title: "Thai-Nam Hoang",
    description:
        "ML @ at EPFL — building machines that learn.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${fraunces.variable} ${dmMono.variable} ${lora.variable}`}
        >
            <body>
                <Navbar />
                {children}
                {/* <Footer /> */}
            </body>
        </html>
    );
}