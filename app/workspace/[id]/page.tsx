import Page from "@/components/page";
import ProjectComponent from "@/components/projectcomponent";
import {
  fetchProjectRows,
  fetchVideo,
  fetchWorkspaceName,
} from "@/lib/actions/projectActions";

export default async function ProjectPage({
  params: { id },
}: {
  params: {
    id: number;
  };
}) {
  const video = await fetchVideo(id);
  const workspaceName = await fetchWorkspaceName(id);
  const rows = await fetchProjectRows(id);

  return (
    <Page>
      <ProjectComponent
        id={id}
        video={video}
        workspaceName={workspaceName}
        rows={rows}
      ></ProjectComponent>
    </Page>
  );
}
