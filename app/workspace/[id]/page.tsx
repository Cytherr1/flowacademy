import Page from "@/components/page";
import ProjectComponent from "@/components/projectcomponent";
import {
  fetchProjectRows,
  fetchVideo,
  fetchWorkspaceName,
  isOutsource,
} from "@/lib/actions/projectActions";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProjectPage(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const session = await auth();
  if (!session) redirect("/signin");

  const params = await props.params;
  const id = await params.id;
  const workspaceName = await fetchWorkspaceName(id);
  const rows = await fetchProjectRows(id);
  const is_outsource = await isOutsource(id);
  const video = await fetchVideo(id);

  return (
    <Page>
      <ProjectComponent
        id={parseInt(id)}
        video={video}
        workspaceName={workspaceName}
        rows={rows}
        is_outsource={is_outsource}
      ></ProjectComponent>
    </Page>
  );
}
