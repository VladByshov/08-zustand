import type {Metadata} from "next";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import {Roboto} from 'next/font/google';

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["400", "700"],
    variable: "--font-roboto",
    display: "swap",
});

export const metadata: Metadata = {
    title: "NoteHub",
    description:
        "A note management app with tag filtering, search, pagination and modal navigation.",
    openGraph: {
        title: "NoteHub",
        description:
            "A note management app with tag filtering, search, pagination and modal navigation.",
        url: "https://08-zustand-opal-ten.vercel.app",
        siteName: "NoteHub",
        images: [
            {
                url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                width: 1200,
                height: 630,
                alt: "NoteHub app",
            },
        ],
    },
};

export default function RootLayout({children, modal}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={roboto.variable}>
        <TanStackProvider>
            <Header/>
            {modal}
            {children}
            <Footer/>
        </TanStackProvider>
        </body>
        </html>
    );
}
