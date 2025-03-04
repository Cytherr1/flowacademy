import Page from "@/components/page";
import SignInForm from "@/components/signinform";
import { Anchor, Button, Divider, Group, Stack, Text } from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import Link from "next/link";

export default function Home() {
  return (
    <Page>
      <Stack
        w="100%"
        mt={200} 
        justify="flex-start" 
        align="center"
      >
        <SignInForm/>
        <Divider w={200} my="xs" label="Or" labelPosition="center" />
        <Button w={220} justify="center" leftSection={<IconBrandGoogleFilled size={14}/>} variant="default" mt="md">
          Sign in with Google
        </Button>
        <Group justify="center" mt="md">
          <Text>Don't have an account?</Text> 
          <Anchor component={Link} href="/register">Sign up</Anchor>
        </Group>
      </Stack>
    </Page>
  );
}