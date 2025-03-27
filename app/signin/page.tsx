import Page from "@/components/page";
import SignInForm from "@/components/signinform";
import { auth } from "@/lib/auth";
import { Anchor, Button, Divider, Group, Stack, Text } from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function SignIn() {
  const session = await auth();
  if (session) redirect("/");

  return (
    <Page>
      <Stack
        w="100%"
        mah="100%" 
        justify="center" 
        align="center"
      >
        <SignInForm/>
        <Divider mt="lg" w={200} my="xs" label="Or" labelPosition="center" />
        <Button w={220} justify="center" leftSection={<IconBrandGoogleFilled size={14}/>} variant="default" mt="md">
          Sign in with Google
        </Button>
        <Group justify="center" mt="md">
          <Text>Don&apos;t have an account?</Text> 
          <Anchor component={Link} href="/signup">Sign up</Anchor>
        </Group>
      </Stack>
    </Page>
  );
}