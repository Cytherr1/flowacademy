import Page from "@/components/page";
import ProjectComponent from "@/components/projectcomponent";
import { fetchVideo, fetchWorkspaceName } from "@/lib/actions/projectActions";

export default async function ProjectPage({
  params: { id },
}: {
  params: {
    id: number;
  };
}) {
  const video = await fetchVideo(id);
  const workspaceName = await fetchWorkspaceName(id);

  return (
    <Page>
      <ProjectComponent
        video={video}
        workspaceName={workspaceName}
      ></ProjectComponent>
    </Page>
  );
}
