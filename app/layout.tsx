import type { Metadata } from "next";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from '@mantine/core';
import "@mantine/core/styles.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "FlowAcademy",
  description: "Welcome to FlowAcademy! Learn method analysis with our digital tool.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript/>
      </head>
      <body>
        <MantineProvider>
          <Navbar/>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
