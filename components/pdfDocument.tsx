// pdfDocument.tsx
import React from "react";
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

interface PDFDocumentProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
});

const PDFDocument: React.FC<PDFDocumentProps> = ({ user }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.section}>User ID: {user.id}</Text>
      <Text style={styles.section}>Name: {user.name}</Text>
      <Text style={styles.section}>Email: {user.email}</Text>
    </Page>
  </Document>
);

export default PDFDocument;
