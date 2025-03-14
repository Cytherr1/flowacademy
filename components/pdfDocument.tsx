// pdfDocument.tsx
import React from "react";
import { Document, Page, Text, StyleSheet, View } from "@react-pdf/renderer";
import PDFChart from "./PDFChart";
import { StepData } from "./Chart";

interface PDFDocumentProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
  chartData?: StepData[];
}

const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subheader: {
    fontSize: 12,
    marginBottom: 10,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

const PDFDocument: React.FC<PDFDocumentProps> = ({ user, chartData = [] }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Flow Academy User Report</Text>
      
      <Text style={styles.subheader}>User Information</Text>
      <Text style={styles.section}>User ID: {user.id}</Text>
      <Text style={styles.section}>Name: {user.name}</Text>
      <Text style={styles.section}>Email: {user.email}</Text>
      
      {chartData.length > 0 && (
        <View>
          <Text style={styles.subheader}>Performance Data</Text>
          <PDFChart 
            data={chartData} 
            type="bar" 
            title="Step Completion Statistics" 
          />
          
          <Text style={styles.subheader}>Distribution</Text>
          <PDFChart 
            data={chartData} 
            type="pie" 
            title="Step Distribution" 
          />
        </View>
      )}
    </Page>
  </Document>
);

export default PDFDocument;
