import Page from "@/components/page";
import SignUpForm from "@/components/signupform";
import { Anchor, Divider, Group, Stack, Text } from "@mantine/core";
import Link from "next/link";

export default function Register(){
    return(
        <Page>
          <Stack
            w="100%"
            mah="100%" 
            justify="center" 
            align="center"
            gap="md"
          >
            <SignUpForm/>
            <Divider mt="lg" w={200} my="xs" labelPosition="center" />
            <Group justify="center" mt="md">
              <Text>Already have an account?</Text> 
              <Anchor component={Link} href="/signin">Sign in</Anchor>
            </Group>
          </Stack>    
        </Page>
    )
}