"use client";
import {
  Stepper,
  Center,
  Box,
  Title,
  Text,
  Image,
  Group,
  Button,
} from "@mantine/core";
import NextImage from "next/image";
import { useState } from "react";
import placeholder from "../static_content/placholder.png";
import Link from "next/link";
import {
  IconUserFilled,
  IconUpload,
  IconEdit,
  IconFileTypePdf,
} from "@tabler/icons-react";
export default function Documentation() {
  const [active, setActive] = useState(0);
  const stepContent = [
    <Box key="step1">
      <Title order={1}>Register or Sign in</Title>
      <Text c="dimmed" mt="xs">
        Create an account or sign in to your existing account to get started.
      </Text>
      <Group mt="xs">
        <Button w={200} variant="default" component={Link} href="/signin">
          Sign In
        </Button>
        <Button
          mt="xs"
          w={200}
          variant="default"
          component={Link}
          href="/register"
        >
          Register
        </Button>
      </Group>
    </Box>,
    <Box key="step2">
      <Title order={1}>Upload Your Video</Title>
      <Text c="dimmed" mt="xs">
        Upload your video by dragging and dropping or selecting from your
        device.
      </Text>
      <Text c="dimmed" mt="xs">
        Supported formats: MP4, MOV, AVI. Maximum file size: 20 MB.
      </Text>
      <Image
        h={200}
        w="auto"
        fit="contain"
        component={NextImage}
        src={placeholder}
        alt="logo"
        mt="xs"
        radius="md"
      />
    </Box>,
    <Box key="step3">
      <Title order={1}>Edit Your Steps</Title>
      <Text c="dimmed" mt="xs">
        Adjust the automatically detected steps or add your own custom steps.
      </Text>
      <Text c="dimmed" mt="xs">
        You can add annotations, change timestamps, and reorder steps as needed.
      </Text>
      <Image
        h={200}
        w="auto"
        fit="contain"
        component={NextImage}
        src={placeholder}
        alt="logo"
        mt="xs"
        radius="md"
      />
    </Box>,
    <Box key="step4">
      <Title order={1}>Create PDF</Title>
      <Text c="dimmed" mt="xs">
        Generate a PDF document with all your steps and annotations.
      </Text>
      <Text c="dimmed" mt="xs">
        You can customize the layout and download or share the final document.
      </Text>
      <Image
        h={200}
        w="auto"
        fit="contain"
        component={NextImage}
        src={placeholder}
        alt="logo"
        mt="xs"
        radius="md"
      />
    </Box>,
  ];
  return (
    <Center miw="100%" mah="100%">
      <Box style={{ width: "30%" }}>
        <Stepper active={active} onStepClick={setActive} orientation="vertical">
          <Stepper.Step
            icon={<IconUserFilled />}
            label="Step 1"
            description="Register or Sign in"
          />
          <Stepper.Step
            icon={<IconUpload />}
            label="Step 2"
            description="Upload Your Video"
          />
          <Stepper.Step
            icon={<IconEdit />}
            label="Step 3"
            description="Edit Your Steps"
          />
          <Stepper.Step
            icon={<IconFileTypePdf />}
            label="Step 4"
            description="Create PDF"
          />
        </Stepper>
      </Box>
      <Box style={{ width: "30%" }}>{stepContent[active]}</Box>
    </Center>
  );
}