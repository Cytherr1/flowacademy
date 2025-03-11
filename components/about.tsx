"use client";
import { Text, Accordion, Center, Box, Title, Stack } from "@mantine/core";
import { aboutData } from "@/lib/data";
import AccordionLabel from "./accordionLabel";

export default function AboutComponent() {
  const items = aboutData.map((item) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">{item.content}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <Center miw="100%" mah="100%">
      <Stack align="center" w="100%">
        <Title order={1} ta="center" mb={20}>
          Meet with the Team!
        </Title>
        <Text ta="center" mb={20} c="dimmed">
          From the first stirrings of life beneath water... to the great beasts
          of the Stone Age... 
          <br/>
          to man taking his first upright steps, you have
          come far. 
          <br/>
          Now begins your greatest quest: from this early cradle of
          civilization on towards the stars.
        </Text>
        <Box w="75%" mx="auto">
          <Accordion chevronPosition="right" variant="contained">
            {items}
          </Accordion>
        </Box>
      </Stack>
    </Center>
  );
}
