import Page from "@/components/page";
import SignInForm from "@/components/signinform";
import { Anchor, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";

export default function Home() {
  return (
    <Page>
      <Stack
        mt={200} 
        justify="flex-start" 
        align="center"
      >
        <SignInForm/>
        <Group justify="center" mt="md">
          <Text>Don't have an account?</Text> 
          <Anchor component={Link} href="/register">Sign up</Anchor>
        </Group>
      </Stack>
    </Page>
  );
}