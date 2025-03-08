"use client";
import { navData } from "@/lib/data";
import { Anchor, Divider, Grid, Group, Paper, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";


export default function Footer() {

  return (
    <footer>
      <Paper
        grow
        withBorder
        component={Grid}
        radius="none"
        p="xs"
        w="100%"
      >
        <Grid.Col span={4} h={250}>
          <Stack h="100%" justify="center" align="center">
            <Stack>
              <Title order={4}>FlowAcademy</Title>
              <Text size="sm">Learn method analysis with our digital tool.</Text>
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4} h={250}>
          <Stack h="100%" justify="center" align="center">
            <Stack>
              <Title order={5}>Quick Menu</Title>
              {
                navData.map((e, i) => <Anchor key={i} component={Link} href={e.link} underline="hover">{e.name}</Anchor>)
              }
            </Stack>
          </Stack>
        </Grid.Col>
        <Grid.Col span={4} h={250}>
          <Group>
            <Title>things to be added</Title>
          </Group>
        </Grid.Col>
        <Grid.Col span={12} h={60}>
          <Stack h="100%" justify="center" align="center"> 
            <Divider w="85%"/>
            <Text size="xs">© 2025 FlowAcademy. All rights reserved</Text>
          </Stack>
        </Grid.Col>
      </Paper>
    </footer>
  )
}