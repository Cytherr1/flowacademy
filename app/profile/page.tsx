import EditProfileForm from "@/components/editprofileform";
import Page from "@/components/page";
import { auth } from "@/lib/auth";
import { Avatar, Stack } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if(!session) redirect("/signin");

  return (
	  <Page>
      <Stack w="100%" align="center" justify="center">
        <Avatar size="xl" radius="xl" src={ session.user?.image ?? "" }/>
        <EditProfileForm session={session}/>
      </Stack>
    </Page>
  )
}