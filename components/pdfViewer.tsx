"use client";

import { useState, useEffect } from "react";
import { Button } from "@mantine/core";
import { pdf, PDFDownloadLink } from "@react-pdf/renderer";
import PDFDocument from "./pdfDocument";

interface User {
  id: string;
  name: string;
  email: string;
}

const PDFViewer: React.FC<{ user: User }> = ({ user }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const generatePdf = async () => {
    const blob = await pdf(
      <PDFDocument user={user} />
    ).toBlob();
    setPdfUrl(URL.createObjectURL(blob));
  };

  return (
    <div>
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
        document={<PDFDocument user={user} />}
        fileName="FlowAcademy.pdf"
      >
        {({ loading }) => (
          <Button variant="filled" color="blue">
            {loading ? "Generating PDF..." : "Download PDF"}
          </Button>
        )}
      </PDFDownloadLink>
    </div>
  );
};

export default PDFViewer;
