"use client";
import { Flex } from "@mantine/core";

export default function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
	<Flex
    pt="60px"
    mih="100vh"
  >
	  { children }
	</Flex>
  )
}