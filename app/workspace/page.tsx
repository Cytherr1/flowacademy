import CreateProjectButton from "@/components/createprojectbutton";
import Page from "@/components/page";
import ProjectCard from "@/components/projectcard";
import { auth } from "@/lib/auth";
import { Flex, SimpleGrid } from "@mantine/core";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await auth();
  if(!session) redirect("/signin");

  return (
	  <Page>
      <Flex p="md" justify="center" w="100%">
        <SimpleGrid p="xl" cols={{xl:5, lg: 4, md: 3, sm: 2, base: 1}} spacing="xl" verticalSpacing="xl">
          <CreateProjectButton/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
          <ProjectCard/>
        </SimpleGrid>
      </Flex>
    </Page>
  )
}