import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if(!session) redirect("/signin");

  return (
	  <div>welcome to your workspace</div>
  )
}