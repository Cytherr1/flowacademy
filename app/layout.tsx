import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import "@mantine/core/styles.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "FlowAcademy",
  description: "Welcome to FlowAcademy! Learn method analysis with our digital tool.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="auto"/>
      </head>
      <body>
        <MantineProvider defaultColorScheme="auto">
          <SessionProvider>
            <Navbar session={session}/>
            {children}
            <Footer session={session}/>
          </SessionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
