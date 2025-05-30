"use client";
import {
  Stepper,
  Center,
  Box,
  Title,
  Text,
  Group,
  Button,
  AspectRatio,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useState } from "react";
import Link from "next/link";
import {
  IconUserFilled,
  IconUpload,
  IconEdit,
  IconFileTypePdf,
} from "@tabler/icons-react";

export default function Documentation() {
  const [active, setActive] = useState(0);
  const isLargeScreen = useMediaQuery("(min-width: 1200px)");
  const isMediumScreen = useMediaQuery(
    "(min-width: 768px) and (max-width: 1199px)"
  );
  const isSmallScreen = useMediaQuery("(max-width: 767px)");

  const nextStep = () =>
    setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const largeScreenContent = [
    <Box key="step1" p="md">
      <Title order={1}>Register or Sign in</Title>
      <Text c="dimmed" mt="xs">
        Create an account or sign in to your existing account to get started.
      </Text>
      <Group mt="md" gap="md" justify="flex-start" wrap="wrap">
        <Button w={200} variant="default" component={Link} href="/signin">
          Sign In
        </Button>
        <Button w={200} variant="default" component={Link} href="/signup">
          Register
        </Button>
      </Group>
    </Box>,
    <Box key="step2" p="md">
      <Title order={1}>Upload Your Video</Title>
      <AspectRatio
        mt="xs"
        ratio={16 / 9}
        style={{
          minWidth: "750px",
          margin: "0 auto",
        }}
      >
        <video
          autoPlay
          loop
          style={{ border: 0, width: "100%", height: "100%" }}
        >
          <source src="/upload.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
    </Box>,
    <Box key="step3" p="md">
      <Title order={1}>Edit Your Steps</Title>
      <AspectRatio
        mt="xs"
        ratio={16 / 9}
        style={{
          minWidth: "750px",
          margin: "0 auto",
        }}
      >
        <video
          autoPlay
          loop
          style={{ border: 0, width: "100%", height: "100%" }}
        >
          <source src="/editsteps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
    </Box>,
    <Box key="step4" p="md">
      <Title order={1}>Create PDF</Title>
      <AspectRatio
        mt="xs"
        ratio={16 / 9}
        style={{
          minWidth: "750px",
          margin: "0 auto",
        }}
      >
        <video
          autoPlay
          loop
          style={{ border: 0, width: "100%", height: "100%" }}
        >
          <source src="/generatepdf.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
    </Box>,
  ];

  const responsiveContent = [
    <Box key="step1" p="md">
      <Title ta="center" order={1}>
        Register or Sign in
      </Title>
      <Text ta="center" c="dimmed" mt="xs">
        Create an account or sign in to your existing account to get started.
      </Text>
      <Center mt="md">
        <Group gap="md" wrap="wrap" justify="center">
          <Button
            w={isSmallScreen ? "100%" : 200}
            variant="default"
            component={Link}
            href="/signin"
          >
            Sign In
          </Button>
          <Button
            mt={isSmallScreen ? "xs" : 0}
            w={isSmallScreen ? "100%" : 200}
            variant="default"
            component={Link}
            href="/register"
          >
            Register
          </Button>
        </Group>
      </Center>
    </Box>,
    <Box key="step2" p="md">
      <Title ta="center" order={1}>
        Upload Your Video
      </Title>
      <AspectRatio mt="xs" style={{ minWidth: "300px", margin: "0 auto" }}>
        <video
          autoPlay
          loop
          style={{ border: 0, width: "100%", height: "100%" }}
        >
          <source src="/upload.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
    </Box>,
    <Box key="step3" p="md">
      <Title ta="center" order={1}>
        Edit Your Steps
      </Title>
      <Center mt="xs">
      <AspectRatio mt="xs" style={{ minWidth: "300px", margin: "0 auto" }}>
        <video
          autoPlay
          loop
          style={{ border: 0, width: "100%", height: "100%" }}
        >
          <source src="/editsteps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
      </Center>
    </Box>,
    <Box key="step4" p="md">
      <Title ta="center" order={1}>
        Create PDF
      </Title>
      
      <Center mt="xs">
      <AspectRatio mt="xs" style={{ minWidth: "300px", margin: "0 auto" }}>
        <video
          autoPlay
          loop
          style={{ border: 0, width: "100%", height: "100%" }}
        >
          <source src="/generatepdf.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
      </Center>
    </Box>,
  ];

  if (isLargeScreen) {
    return (
      <Center miw="100%" mah="100%">
        <Box style={{ width: "30%" }}>
          <Stepper
            active={active}
            onStepClick={setActive}
            orientation="vertical"
          >
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
        <Box style={{ width: "30%" }}>{largeScreenContent[active]}</Box>
      </Center>
    );
  }

  if (isMediumScreen) {
    return (
      <Center miw="100%" mah="100%">
        <Box p="md" style={{ width: "100%" }}>
          <Stepper
            active={active}
            onStepClick={setActive}
            orientation="horizontal"
            mb="xl"
          >
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
          <Center>
            <Box p="md" mx="auto" maw="80%">
              {responsiveContent[active]}
            </Box>
          </Center>
          <Group justify="space-between" mt="xl">
            <Button
              variant="default"
              onClick={prevStep}
              disabled={active === 0}
            >
              Back
            </Button>
            <Group gap="sm">
              <Text c="dimmed" size="sm">
                {active + 1} of 4
              </Text>
            </Group>
            <Button
              variant="default"
              onClick={nextStep}
              disabled={active === 3}
            >
              Next
            </Button>
          </Group>
        </Box>
      </Center>
    );
  }

  return (
    <Center miw="100%" mah="100%">
      <Box p="md" style={{ width: "100%" }}>
        <Center>
          <Box p="xs" mx="auto" style={{ width: "90%" }}>
            {responsiveContent[active]}
          </Box>
        </Center>
        <Group justify="space-between" mt="xl">
          <Button variant="default" onClick={prevStep} disabled={active === 0}>
            Back
          </Button>
          <Group gap="sm">
            <Text c="dimmed" size="sm">
              {active + 1} of 4
            </Text>
          </Group>
          <Button variant="default" onClick={nextStep} disabled={active === 3}>
            Next
          </Button>
        </Group>
      </Box>
    </Center>
  );
}
