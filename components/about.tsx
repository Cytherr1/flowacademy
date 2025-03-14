"use client";
import {
  Text,
  Accordion,
  Center,
  Box,
  Title,
  Stack,
  Group,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { softwareData, industrialData } from "@/lib/data";
import AccordionLabel from "./accordionLabel";
import { getSocialButtons } from "./getSocialButtons";

interface DataItem {
  id: string;
  image: string;
  label: string;
  description: string;
  content: string;
  social1?: string;
  social2?: string;
  social3?: string;
  social4?: string;
}

export default function AboutComponent() {
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");

  const software = softwareData.map((item: DataItem) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">{item.content}</Text>
        <Group mt="sm">{getSocialButtons(item)}</Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  const industrial = industrialData.map((item: DataItem) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">{item.content}</Text>
        <Group mt="sm">{getSocialButtons(item)}</Group>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  if (isLargeScreen) {
    return (
      <Center miw="100%" mah="100%">
        <Stack align="center" w="100%">
          <Title order={1} ta="center">
            Software Engineering
          </Title>
          <Text ta="center" mb={20} c="dimmed">
            Meet our software engineering team!
            <br />
            Click on panels for further information!
          </Text>
          <Box w="75%" mx="auto">
            <Accordion chevronPosition="right" variant="contained">
              {software}
            </Accordion>
          </Box>
        </Stack>
        <Stack align="center" w="100%">
          <Title order={1} ta="center">
            Industrial Engineering
          </Title>
          <Text ta="center" mb={20} c="dimmed">
            Meet our industrial engineering team!
            <br />
            Click on panels for further information!
          </Text>
          <Box w="75%" mx="auto">
            <Accordion chevronPosition="right" variant="contained">
              {industrial}
            </Accordion>
          </Box>
        </Stack>
      </Center>
    );
  }

  return (
    <Center miw="100%" mah="100%">
      <Stack py="xl" px="md" style={{ maxWidth: "100%" }}>
        <Stack align="center" w="100%">
          <Title order={1} ta="center">
            Software Engineering
          </Title>
          <Text ta="center" mb={20} c="dimmed">
            Meet our software engineering team!
            <br />
            Click on panels for further information!
          </Text>
          <Box w="100%" mx="auto">
            <Accordion chevronPosition="right" variant="contained">
              {software}
            </Accordion>
          </Box>
        </Stack>

        <Stack align="center" w="100%" mt="xl">
          <Title order={1} ta="center">
            Industrial Engineering
          </Title>
          <Text ta="center" mb={20} c="dimmed">
            Meet our industrial engineering team!
            <br />
            Click on panels for further information!
          </Text>
          <Box w="100%" mx="auto">
            <Accordion chevronPosition="right" variant="contained">
              {industrial}
            </Accordion>
          </Box>
        </Stack>
      </Stack>
    </Center>
  );
}
