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

  return (
    <Center miw="100%" mah="100%">
      <Stack align="center" w="100%">
        <Title order={1} ta="center">
          Software Engineering
        </Title>
        <Text ta="center" mb={20} c="dimmed">
          From the first stirrings of life beneath water... to the great beasts
          of the Stone Age...
          <br />
          to man taking his first upright steps, you have come far.
          <br />
          Now begins your greatest quest: from this early cradle of civilization
          on towards the stars.
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
          From the first stirrings of life beneath water... to the great beasts
          of the Stone Age...
          <br />
          to man taking his first upright steps, you have come far.
          <br />
          Now begins your greatest quest: from this early cradle of civilization
          on towards the stars.
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
