import Page from "@/components/page";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if(!session) redirect("/signin");

  return (
	  <Page>welcome to your profile</Page>
  )
}