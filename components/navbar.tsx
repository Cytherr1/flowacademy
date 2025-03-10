"use client";

import Link from 'next/link';
import { ActionIcon, Button, Grid, Group, Paper, Title, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { navData } from '@/lib/data';
import { useHeadroom } from '@mantine/hooks';
import { IconMoon } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';

export default function Navbar() {

  const pinned = useHeadroom({ fixedAt: 120 })
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  const { data: session } = useSession();

  return (
    <nav>
      <Paper
        withBorder
        radius="none"
        component={Grid}
        w="100%"
        align="center"
        style={{
          position: "fixed",
          padding: 'var(--mantine-spacing-xs)',
          height: 60,
          zIndex: 1000000,
          transform: `translate3d(0, ${pinned ? 0 : '-110px'}, 0)`,
          transition: 'transform 400ms ease',
          backgroundColor: 'var(--mantine-color-body)',
        }}
      >
        <Grid.Col span={2}>
          <Title order={2}>FlowAcademy</Title>
        </Grid.Col>
        <Grid.Col span={6}>
          <Group justify="flex-start">
            {
              navData.map((e, i) =>
                <Button variant="default" component={Link} href={e.link} key={i}>
                  {e.name}
                </Button>
              )
            }
          </Group>
        </Grid.Col>
        <Grid.Col span={4}>
          <Group justify="flex-end">
            {session ? <Button variant="default">Profile</Button> : <Button variant="default" component={Link} href="/signin">Sign In</Button>}
            <ActionIcon
              onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
              variant="default"
              size="input-sm"
            >
              <IconMoon stroke={1.5} />
            </ActionIcon>
          </Group>
        </Grid.Col>
      </Paper>
    </nav>
  )
}