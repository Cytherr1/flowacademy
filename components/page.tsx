"use client";
import { Box } from "@mantine/core";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	<Box
    pt="60px"
    mih="100vh"
  >
	  { children }
	</Box>
  )
}