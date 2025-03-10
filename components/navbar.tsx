"use client";

import Link from 'next/link';
import { ActionIcon, Burger, Button, Drawer, Grid, Group, Paper, Space, Stack, Title, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { navData } from '@/lib/data';
import { useDisclosure, useHeadroom } from '@mantine/hooks';
import { IconMoon } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

export default function Navbar() {

  const pinned = useHeadroom({ fixedAt: 120 });
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const [opened, { open, close, toggle }] = useDisclosure(false);

  const { data: session } = useSession();

  return (
    <nav>
      <Paper
        withBorder
        radius="none"
        w="100%"
        style={{
          position: "fixed",
          padding: 'var(--mantine-spacing-xs)',
          zIndex: 1000000,
          transform: `translate3d(0, ${pinned ? 0 : '-110px'}, 0)`,
          transition: 'transform 400ms ease',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Grid align="center" display={{sm:"block", xs: "none", base: "none"}}>
          <Grid.Col span={{lg: 2, sm: 3 }} >
            <Title order={2}>FlowAcademy</Title>
          </Grid.Col>
          <Grid.Col span={{lg: 6, sm: 6 }}>
            <Group justify="flex-start">
              {
                navData.map((e, i) =>
                  <Button variant="default" component={Link} href={e.link} key={i}>
                    {e.name}
                  </Button>
                )
              }
              
              {
                session ? 
                <>
                  <Button variant="default" component={Link} href="/workspace">Workspace</Button>
                  <Button variant="default" component={Link} href="/profile">Profile</Button>
                </> : <></>
              }
            </Group>
          </Grid.Col>
          <Grid.Col span={{lg: 4, sm: 3 }}>
            <Group justify="flex-end">
              {session ? <Button variant="default">Sign out</Button> : <Button variant="default" component={Link} href="/signin">Sign In</Button>}
              <ActionIcon
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                variant="default"
                size="input-sm"
              >
                <IconMoon stroke={1.5} />
              </ActionIcon>
            </Group>
          </Grid.Col>
        </Grid>
        <Grid align="center" display={{sm:"none", xs: "block", base: "block"}}>
          <Grid.Col span={2}>
            <Burger opened={opened} onClick={toggle} aria-label="Toggle navigation" />
          </Grid.Col>
          <Grid.Col pl="xl" span={10}>
            <Title order={2}>FlowAcademy</Title>
          </Grid.Col>
        </Grid>
        <Drawer
          opened={opened}
          onClose={close}
          size="xs"
          title="Menu"
          overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
          display={{sm:"none", xs: "block", base: "block"}}
        >
          <Stack p="md" h="90vh" justify='space-between'>
            <Stack>
              {
                navData.map((e, i) =>
                  <Button variant="default" component={Link} href={e.link} key={i}>
                    {e.name}
                  </Button>
                )
              }
              {
                session ? 
                <>
                  <Button variant="default" component={Link} href="/workspace">Workspace</Button>
                  <Button variant="default" component={Link} href="/profile">Profile</Button>
                </> : <></>
              }
            </Stack>
            <Group justify='space-between'>
              <ActionIcon
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                variant="default"
                size="input-sm"
              >
                <IconMoon stroke={1.5} />
              </ActionIcon>
              {session ? <Button variant="default">Sign out</Button> : <Button variant="default" component={Link} href="/signin">Sign In</Button>}
            </Group>
          </Stack>
        </Drawer>
      </Paper>
    </nav>
  )
}