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

  const videos = await db.video.findMany({
    where: {
      workspaceId: {
        in: workspaces.map((workspace) => workspace.id),
      },
    },
  });

  if (!workspaces || !quota || !videos){
    console.log("Error fetching data from the database.");
    return;
  }

  return (
    <Page>
      <Workspace
        workspaces={workspaces}
        quota={quota}
        videos={videos}
      ></Workspace>
    </Page>
  );
}
