import Workspace from "@/components/workspace";
import Page from "@/components/page";
import { auth } from "@/lib/auth";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export default async function WorkspacePage() {
  const session = await auth();
  if (!session) redirect("/signin");
  const workspaces = await db.workspace.findMany({
    where: {
      userId: session?.user?.id,
    },
  });

  const quota = await db.quota.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  return (
    <Page>
      <Workspace workspaces={workspaces} quota={quota}></Workspace>
    </Page>
  );
}
