"use client";
import { footData, navData } from "@/lib/data";
import {
  Anchor,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface FooterProps {
  session: Session | null;
}

export default function Footer({ session }: FooterProps) {
  return (
    <footer>
      <Paper grow withBorder component={Grid} radius="none" p="xs" w="100%">
        <Grid.Col p="lg" span={{ lg: 4, md: 12 }}>
          <Stack h="100%" justify="center" align="center">
            <Stack>
              <Title order={4}>FlowAcademy</Title>
              <Text size="sm">
                Learn method analysis with our digital tool.
              </Text>
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col
          p="lg"
          span={{ lg: 4, md: 6, xs: 0 }}
          display={{ md: "block", xs: "none", base: "none" }}
        >
          <Stack h="100%" justify="center" align="center">
            <Stack>
              <Title order={5}>Quick Menu</Title>
              {navData.map((e, i) => (
                <Anchor
                  key={i}
                  component={Link}
                  href={e.link}
                  underline="hover"
                >
                  {e.name}
                </Anchor>
              ))}
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col p="lg" span={{ lg: 4, md: 6, xs: 12 }}>
          <Stack h="100%" justify="center" align="center">
            {session ? (
              <Stack>
                <Title order={5}>Quick Menu</Title>
                {footData.map((e, i) => (
                  <Anchor
                    key={i}
                    component={Link}
                    href={e.link}
                    underline="hover"
                  >
                    {e.name}
                  </Anchor>
                ))}
                <Button
                  variant="default"
                  onClick={async () => {
                    await signOut();
                  }}
                >
                  Sign out
                </Button>
              </Stack>
            ) : (
              <Stack>
                <Title order={5}>Get started with FlowAcademy</Title>
                <Button variant="default" component={Link} href="/signin">
                  Sign In
                </Button>
                <Group justify="center" mt="md">
                  <Text size="sm">Don&apos;t have an account?</Text>
                  <Anchor size="sm" component={Link} href="/signup">
                    Sign up
                  </Anchor>
                </Group>
              </Stack>
            )}
          </Stack>
        </Grid.Col>
        <Grid.Col span={12} h={60}>
          <Stack h="100%" justify="center" align="center">
            <Divider w="85%" />
            <Text size="xs">All rights reserved. 2025 © | FlowAcademy </Text>
          </Stack>
        </Grid.Col>
      </Paper>
    </footer>
  );
}
