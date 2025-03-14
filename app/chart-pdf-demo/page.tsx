"use client";

import { useState } from "react";
import { Center, Stack, Title, TextInput, NumberInput, Button, Group, Paper, Text } from "@mantine/core";
import PDFViewer from "@/components/pdfViewer";
import Page from "@/components/page";
import { StepData } from "@/components/Chart";

const ChartPDFDemo: React.FC = () => {
  const [chartData, setChartData] = useState<StepData[]>([
    { name: "Step 1", value: 10, color: "#0088FE" },
    { name: "Step 2", value: 15, color: "#00C49F" },
    { name: "Step 3", value: 8, color: "#FFBB28" },
    { name: "Step 4", value: 12, color: "#FF8042" },
  ]);

  const [newStep, setNewStep] = useState<{ name: string; value: number }>({
    name: "",
    value: 0,
  });

  const user = {
    id: "1",
    name: "Murat Kağan Temel",
    email: "temelmuratkagan@gmail.com",
  };

  const addStep = () => {
    if (newStep.name && newStep.value > 0) {
      // Generate a random color
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
      
      setChartData([
        ...chartData,
        { name: newStep.name, value: newStep.value, color: randomColor },
      ]);
      
      // Reset form
      setNewStep({ name: "", value: 0 });
    }
  };

  const resetData = () => {
    setChartData([
      { name: "Step 1", value: 10, color: "#0088FE" },
      { name: "Step 2", value: 15, color: "#00C49F" },
      { name: "Step 3", value: 8, color: "#FFBB28" },
      { name: "Step 4", value: 12, color: "#FF8042" },
    ]);
  };

  return (
    <Center miw="100%" mah="100%">
      <Page>
        <Stack gap="xl" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          <Title order={1}>
            Chart to PDF Demo
          </Title>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Add New Step Data</Title>
              
              <Group grow>
                <TextInput
                  label="Step Name"
                  placeholder="Enter step name"
                  value={newStep.name}
                  onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                />
                
                <NumberInput
                  label="Value"
                  placeholder="Enter value"
                  min={0}
                  value={newStep.value}
                  onChange={(value) => setNewStep({ ...newStep, value: typeof value === 'number' ? value : 0 })}
                />
              </Group>
              
              <Group>
                <Button onClick={addStep} disabled={!newStep.name || newStep.value <= 0}>
                  Add Step
                </Button>
                
                <Button variant="outline" color="red" onClick={resetData}>
                  Reset Data
                </Button>
              </Group>
            </Stack>
          </Paper>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Current Step Data</Title>
              
              {chartData.map((step, index) => (
                <Group key={index} style={{ borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
                  <div style={{ width: 20, height: 20, backgroundColor: step.color, borderRadius: "4px" }} />
                  <Text>{step.name}: {step.value}</Text>
                </Group>
              ))}
            </Stack>
          </Paper>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Charts and PDF Generation</Title>
              <Text>
                The charts below will be included in the generated PDF. You can add or modify step data
                using the form above.
              </Text>
              <PDFViewer user={user} chartData={chartData} />
            </Stack>
          </Paper>
        </Stack>
      </Page>
    </Center>
  );
};

export default ChartPDFDemo; 