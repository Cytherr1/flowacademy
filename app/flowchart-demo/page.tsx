"use client";

import { useState } from "react";
import { Center, Stack, Title, TextInput, Button, Group, Paper, Text, Select, Textarea } from "@mantine/core";
import PDFViewer from "@/components/pdfViewer";
import Page from "@/components/page";
import { StepData } from "@/components/Chart";
import { FlowData, FlowNode } from "@/components/FlowChart";
import { Edge } from "reactflow";

const FlowchartDemo: React.FC = () => {
  // Sample chart data
  const [chartData] = useState<StepData[]>([
    { name: "Step 1", value: 10, color: "#0088FE" },
    { name: "Step 2", value: 15, color: "#00C49F" },
    { name: "Step 3", value: 8, color: "#FFBB28" },
    { name: "Step 4", value: 12, color: "#FF8042" },
  ]);

  // Sample flowchart data
  const [flowData, setFlowData] = useState<FlowData>({
    nodes: [
      {
        id: '1',
        type: 'custom',
        data: { label: 'Introduction', description: 'Getting started with the course' },
        position: { x: 250, y: 0 },
      },
      {
        id: '2',
        type: 'custom',
        data: { label: 'Basic Concepts', description: 'Learning the fundamentals' },
        position: { x: 250, y: 100 },
      },
      {
        id: '3',
        type: 'custom',
        data: { label: 'Advanced Topics', description: 'Diving deeper into complex subjects' },
        position: { x: 250, y: 200 },
      },
      {
        id: '4',
        type: 'custom',
        data: { label: 'Project Work', description: 'Applying knowledge in real projects' },
        position: { x: 250, y: 300 },
      },
      {
        id: '5',
        type: 'custom',
        data: { label: 'Final Assessment', description: 'Evaluating your knowledge' },
        position: { x: 250, y: 400 },
      },
    ],
    edges: [
      { id: 'e1-2', source: '1', target: '2', label: 'Next', type: 'smoothstep' },
      { id: 'e2-3', source: '2', target: '3', label: 'Continue', type: 'smoothstep' },
      { id: 'e3-4', source: '3', target: '4', label: 'Apply', type: 'smoothstep' },
      { id: 'e4-5', source: '4', target: '5', label: 'Complete', type: 'smoothstep' },
    ],
  });

  // Form state for adding new nodes
  const [newNode, setNewNode] = useState<{
    label: string;
    description: string;
  }>({
    label: '',
    description: '',
  });

  // Form state for adding new edges
  const [newEdge, setNewEdge] = useState<{
    source: string;
    target: string;
    label: string;
  }>({
    source: '',
    target: '',
    label: '',
  });

  const user = {
    id: "1",
    name: "Murat Kağan Temel",
    email: "temelmuratkagan@gmail.com",
  };

  // Add a new node to the flowchart
  const addNode = () => {
    if (newNode.label) {
      const newId = (flowData.nodes.length + 1).toString();
      const newNodeObj: FlowNode = {
        id: newId,
        type: 'custom',
        data: { 
          label: newNode.label, 
          description: newNode.description || undefined 
        },
        position: { x: 250, y: flowData.nodes.length * 100 },
      };

      setFlowData({
        ...flowData,
        nodes: [...flowData.nodes, newNodeObj],
      });

      // Reset form
      setNewNode({ label: '', description: '' });
    }
  };

  // Add a new edge to the flowchart
  const addEdge = () => {
    if (newEdge.source && newEdge.target) {
      const newEdgeObj: Edge = {
        id: `e${newEdge.source}-${newEdge.target}`,
        source: newEdge.source,
        target: newEdge.target,
        label: newEdge.label || undefined,
        type: 'smoothstep',
      };

      setFlowData({
        ...flowData,
        edges: [...flowData.edges, newEdgeObj],
      });

      // Reset form
      setNewEdge({ source: '', target: '', label: '' });
    }
  };

  // Reset flowchart to default
  const resetFlowchart = () => {
    setFlowData({
      nodes: [
        {
          id: '1',
          type: 'custom',
          data: { label: 'Introduction', description: 'Getting started with the course' },
          position: { x: 250, y: 0 },
        },
        {
          id: '2',
          type: 'custom',
          data: { label: 'Basic Concepts', description: 'Learning the fundamentals' },
          position: { x: 250, y: 100 },
        },
        {
          id: '3',
          type: 'custom',
          data: { label: 'Advanced Topics', description: 'Diving deeper into complex subjects' },
          position: { x: 250, y: 200 },
        },
        {
          id: '4',
          type: 'custom',
          data: { label: 'Project Work', description: 'Applying knowledge in real projects' },
          position: { x: 250, y: 300 },
        },
        {
          id: '5',
          type: 'custom',
          data: { label: 'Final Assessment', description: 'Evaluating your knowledge' },
          position: { x: 250, y: 400 },
        },
      ],
      edges: [
        { id: 'e1-2', source: '1', target: '2', label: 'Next', type: 'smoothstep' },
        { id: 'e2-3', source: '2', target: '3', label: 'Continue', type: 'smoothstep' },
        { id: 'e3-4', source: '3', target: '4', label: 'Apply', type: 'smoothstep' },
        { id: 'e4-5', source: '4', target: '5', label: 'Complete', type: 'smoothstep' },
      ],
    });
  };

  return (
    <Center miw="100%" mah="100%">
      <Page>
        <Stack gap="xl" style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}>
          <Title order={1}>
            Flowchart to PDF Demo
          </Title>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Add New Node</Title>
              
              <TextInput
                label="Node Label"
                placeholder="Enter node label"
                value={newNode.label}
                onChange={(e) => setNewNode({ ...newNode, label: e.target.value })}
              />
              
              <Textarea
                label="Description (optional)"
                placeholder="Enter node description"
                value={newNode.description}
                onChange={(e) => setNewNode({ ...newNode, description: e.target.value })}
              />
              
              <Button onClick={addNode} disabled={!newNode.label}>
                Add Node
              </Button>
            </Stack>
          </Paper>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Add New Connection</Title>
              
              <Group grow>
                <Select
                  label="From Node"
                  placeholder="Select source node"
                  data={flowData.nodes.map(node => ({ value: node.id, label: `${node.data.label} (${node.id})` }))}
                  value={newEdge.source}
                  onChange={(value) => setNewEdge({ ...newEdge, source: value || '' })}
                />
                
                <Select
                  label="To Node"
                  placeholder="Select target node"
                  data={flowData.nodes.map(node => ({ value: node.id, label: `${node.data.label} (${node.id})` }))}
                  value={newEdge.target}
                  onChange={(value) => setNewEdge({ ...newEdge, target: value || '' })}
                />
              </Group>
              
              <TextInput
                label="Connection Label (optional)"
                placeholder="Enter connection label"
                value={newEdge.label}
                onChange={(e) => setNewEdge({ ...newEdge, label: e.target.value })}
              />
              
              <Group>
                <Button onClick={addEdge} disabled={!newEdge.source || !newEdge.target}>
                  Add Connection
                </Button>
                
                <Button variant="outline" color="red" onClick={resetFlowchart}>
                  Reset Flowchart
                </Button>
              </Group>
            </Stack>
          </Paper>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Current Flowchart Structure</Title>
              
              <Text fw="bold">Nodes:</Text>
              {flowData.nodes.map((node, index) => (
                <Group key={index} style={{ borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
                  <Text>ID: {node.id}</Text>
                  <Text>Label: {node.data.label}</Text>
                  {node.data.description && <Text size="sm" color="dimmed">Description: {node.data.description}</Text>}
                </Group>
              ))}
              
              <Text fw="bold" mt="md">Connections:</Text>
              {flowData.edges.map((edge, index) => {
                const sourceNode = flowData.nodes.find(n => n.id === edge.source);
                const targetNode = flowData.nodes.find(n => n.id === edge.target);
                return (
                  <Group key={index} style={{ borderBottom: "1px solid #eee", paddingBottom: "8px" }}>
                    <Text>
                      {sourceNode?.data.label || edge.source} → {targetNode?.data.label || edge.target}
                      {edge.label && ` (${edge.label})`}
                    </Text>
                  </Group>
                );
              })}
            </Stack>
          </Paper>
          
          <Paper withBorder p="md">
            <Stack gap="md">
              <Title order={3}>Flowchart and PDF Generation</Title>
              <Text>
                The flowchart below will be included in the generated PDF. You can add or modify nodes
                and connections using the forms above.
              </Text>
              <PDFViewer user={user} chartData={chartData} flowData={flowData} />
            </Stack>
          </Paper>
        </Stack>
      </Page>
    </Center>
  );
};

export default FlowchartDemo; 