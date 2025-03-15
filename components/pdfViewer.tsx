"use client";

import { useState } from "react";
import { Button, Stack } from "@mantine/core";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "./pdfDocument";
import Chart, { StepData } from "./Chart";
import FlowChart, { FlowData } from "./FlowChart";

interface User {
  id: string;
  name: string;
  email: string;
}

interface PDFViewerProps {
  user: User;
  chartData?: StepData[];
  flowData?: FlowData;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ 
  user, 
  chartData = [],
  flowData,
}) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePdf = async () => {
    const blob = await pdf(
      <PDFDocument user={user} chartData={chartData} flowData={flowData} />
    ).toBlob();
    setPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <Stack gap="md">
      {chartData.length > 0 && (
        <Stack gap="lg">
          <Chart 
            data={chartData} 
            type="bar" 
            title="Step Completion Statistics" 
            height={250}
          />
          
          <Chart 
            data={chartData} 
            type="pie" 
            title="Step Distribution" 
            height={300}
          />
        </Stack>
      )}

      {flowData && flowData.nodes.length > 0 && (
        <Stack gap="lg">
          <FlowChart 
            data={flowData} 
            title="Learning Path Flow" 
            height={400}
          />
        </Stack>
      )}

      <Button
        onClick={generatePdf}
        variant="filled"
        color="blue"
      >
        Generate PDF for {user.name}
      </Button>

      {pdfUrl && (
        <iframe
          src={pdfUrl}
          width="100%"
          height="500px"
          style={{ border: "1px solid #ddd" }}
        />
      )}

      <PDFDownloadLink
        document={<PDFDocument user={user} chartData={chartData} flowData={flowData} />}
        fileName="FlowAcademy.pdf"
      >
        {({ loading }) => (
          <Button variant="filled" color="blue">
            {loading ? "Generating PDF..." : "Download PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    </Stack>
  );
};

export default PDFViewer;
