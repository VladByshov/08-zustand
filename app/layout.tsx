import type {Metadata} from "next";
import "./globals.css";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

export const metadata: Metadata = {
    title: "NoteHub",
    description: "NoteHub site",
};

export default function RootLayout({children, modal}: Readonly<{
    children: React.ReactNode;
    modal: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
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
