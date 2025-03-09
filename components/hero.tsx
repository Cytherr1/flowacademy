"use client";

import { IconCheck } from "@tabler/icons-react";
import {
  List,
  Text,
  ThemeIcon,
  Title,
  Image,
  Group,
  Button,
  Stack,
  Center,
} from "@mantine/core";
import { heroData } from "@/lib/data";
import NextImage from "next/image";
// Static datanın yerinin değişmesi lazım. Bu şekil saçma duruyor öylesine ekledim nasıl görünüyor vs. diye.
import logo from "../static_content/logo.png";
import Link from "next/link";

export function Hero() {
  return (
    <Center miw="100%" mah="100%">
      <Group>
        <Stack justify="space-between" mx={100}>
          <Title order={1}>FlowAcademy</Title>
          <Text c="dimmed" mt="xs">
            This platform provides a seamless way to
            <br />
            transform your ideas into structured workflows.
          </Text>
          <List
            mt="xs"
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon size={20} radius="xl">
                <IconCheck size={12} stroke={4} />
              </ThemeIcon>
            }
          >
            {heroData.map((e, i) => (
              <List.Item key={i}>
                <b>{e.header}</b> {e.body}
              </List.Item>
            ))}
          </List>
          <Group mt="xs">
            <Button w={200} variant="default" component={Link} href="/signin">
              Sign In
            </Button>
            <Button w={200} variant="default" component={Link} href="/register">
              Register
            </Button>
          </Group>
        </Stack>
        <Image
          h={75}
          w="auto"
          fit="contain"
          component={NextImage}
          src={logo}
          alt="logo"
        />
      </Group>
    </Center>
  );
}
