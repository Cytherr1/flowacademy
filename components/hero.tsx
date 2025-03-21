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
  Box,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { heroData } from "@/lib/data";
import NextImage from "next/image";
import logo from "../static_content/logo.png";
import Link from "next/link";

export function Hero() {
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1199px)"
  );

  if (isLargeScreen) {
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
              <Button
                w={200}
                variant="default"
                component={Link}
                href="/register"
              >
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

  if (isMediumScreen) {
    return (
      <Center miw="100%" mah="100%" p="md">
        <Stack align="center">
          <Title order={1} ta="center">
            FlowAcademy
          </Title>
          <Text c="dimmed" ta="center" px="md">
            This platform provides a seamless way to transform your ideas into
            structured workflows.
          </Text>
          <Center>
            <List
              mt="md"
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
          </Center>
          <Stack mt="md" style={{ width: "100%" }}>
            <Button w="100%" variant="default" component={Link} href="/signin">
              Sign In
            </Button>
            <Button w="100%" variant="default" component={Link} href="/signup">
              Register
            </Button>
          </Stack>
        </Stack>
      </Center>
    );
  }

  return (
    <Center miw="100%" mah="100%" p="md">
      <Stack align="center">
        <Title order={1} ta="center">
          FlowAcademy
        </Title>
        <Text c="dimmed" ta="center" px="md">
          This platform provides a seamless way to transform your ideas into
          structured workflows.
        </Text>
        <Center>
          <List
            mt="md"
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
        </Center>
        <Stack mt="md" style={{ width: "100%" }}>
          <Button w="100%" variant="default" component={Link} href="/signin">
            Sign In
          </Button>
          <Button w="100%" variant="default" component={Link} href="/register">
            Register
          </Button>
        </Stack>
      </Stack>
    </Center>
  );
}
