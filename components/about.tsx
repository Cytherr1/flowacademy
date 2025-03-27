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

  const renderAccordionItem = (item: DataItem) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text
          size="sm"
          style={{
            width: "100%",
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {item.content}
        </Text>
        <Group mt="sm" style={{ width: "100%" }}>
          {getSocialButtons(item)}
        </Group>
      </Accordion.Panel>
    </Accordion.Item>
  );

  const software = softwareData.map(renderAccordionItem);
  const industrial = industrialData.map(renderAccordionItem);

  const accordionProps = {
    w: "100%",
    styles: {
      item: {
        width: "100%",
        maxWidth: "100%",
      },
      control: {
        width: "100%",
      },
      panel: {
        width: "100%",
      },
    },
  };

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
            <Accordion
              chevronPosition="right"
              variant="contained"
              {...accordionProps}
            >
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
            <Accordion
              chevronPosition="right"
              variant="contained"
              {...accordionProps}
            >
              {industrial}
            </Accordion>
          </Box>
        </Stack>
      </Center>
    );
  }

  return (
    <Center w="100%" mih="100%" py="xl">
      <Stack w="100%" maw={1200} px="md" gap="xl">
        {/* Software Engineering Section */}
        <Stack gap="md" align="center" w="100%">
          <Title order={1} ta="center">
            Software Engineering
          </Title>
          <Text ta="center" c="dimmed" mb="md">
            Meet our software engineering team!
            <br />
            Click on panels for further information!
          </Text>
          <Accordion 
            {...accordionProps}
            w="100%"
          >
            {softwareData.map(renderAccordionItem)}
          </Accordion>
        </Stack>

        {/* Industrial Engineering Section */}
        <Stack gap="md" align="center" w="100%">
          <Title order={1} ta="center">
            Industrial Engineering
          </Title>
          <Text ta="center" c="dimmed" mb="md">
            Meet our industrial engineering team!
            <br />
            Click on panels for further information!
          </Text>
          <Accordion 
            {...accordionProps}
            w="100%"
          >
            {industrialData.map(renderAccordionItem)}
          </Accordion>
        </Stack>
      </Stack>
    </Center>
  );
}
