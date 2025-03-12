"use client";

import { Center, Stack, Title } from "@mantine/core";
import PDFViewer from "../../components/pdfViewer";
import Page from "@/components/page";

const Home: React.FC = () => {
  const user = {
    id: "1",
    name: "Murat Kağan Temel",
    email: "temelmuratkagan@gmail.com",
  };
  return (
    <Center miw="100%" mah="100%">
      <Page>
        <Stack>
          <Title order={1}>
            Generate PDF in Next.js with Mantine & TypeScript
          </Title>
          <PDFViewer user={user} />
        </Stack>
      </Page>
    </Center>
  );
};

export default Home;
