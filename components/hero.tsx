import { IconArrowRight, IconCheck } from "@tabler/icons-react";
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
  ListItem,
  Flex,
} from "@mantine/core";
import { heroData } from "@/lib/data";
import NextImage from "next/image";
import logo from "../public/logo.png";
import Link from "next/link";
import { auth } from "@/lib/auth";

export async function Hero() {

  const session = await auth()

  return (
    <Center miw="100%" mah="100%">
      <Flex direction={{ lg: "row", xs: "column", base: "column" }} align="center" justify="space-around" p={{ lg: "xl", xs: "sm", base: "xm" }} gap="xl">
        <Image
          fit="contain"
          component={NextImage}
          src={logo}
          alt="logo"
          p="xl"
          display={{ lg: "none", xs: "block", base: "block" }}
        />
        <Stack p="sm" w={{ lg:"85%", xs: "90%", base: "90%" }} align="left">
          <Title order={1}>FlowAcademy</Title>
          <Text c="dimmed" mt="xs">
            This platform provides a seamless way to transform your ideas into structured workflows.
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
              <ListItem key={i}>
                <b>{e.header}</b> {e.body}
              </ListItem>
            ))}
          </List>
          <Group mt="lg" justify="center">
            <Button w="100%" variant="default" component={Link} href={ session ? "/workspace" : "/signin"} rightSection={<IconArrowRight size={14} />}>
              Get started
            </Button>
          </Group>
        </Stack>
        <Image
          fit="contain"
          component={NextImage}
          src={logo}
          alt="logo"
          p="xl"
          display={{ lg: "block", xs: "none", base: "none" }}
        />
      </Flex>
    </Center>
  );
}
