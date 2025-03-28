import Page from "@/components/page";
import ProjectComponent from "@/components/projectcomponent";
import {
  fetchProjectRows,
  fetchVideo,
  fetchWorkspaceName,
  isOutsource,
  urlToEmbed,
} from "@/lib/actions/projectActions";

export default async function ProjectPage({
  params,
}: {
  params: {
    id: number;
  };
}) {
  const { id } = await params;
  const workspaceName = await fetchWorkspaceName(id);
  const rows = await fetchProjectRows(id);
  const is_outsource = await isOutsource(id);
  const video = await fetchVideo(id);

  return (
    <Page>
      <ProjectComponent
        id={id}
        video={video}
        workspaceName={workspaceName}
        rows={rows}
        is_outsource={is_outsource}
      ></ProjectComponent>
    </Page>
  );
}