"use client";

import React, { useCallback } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  NodeTypes,
  Panel,
  useNodesState,
  useEdgesState,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';

export interface FlowNode extends Node {
  data: {
    label: string;
    description?: string;
  };
}

export interface FlowData {
  nodes: FlowNode[];
  edges: Edge[];
}

interface FlowChartProps {
  data: FlowData;
  title?: string;
  width?: string | number;
  height?: number;
  isInteractive?: boolean;
}

// Custom node component
const CustomNode = ({ data }: { data: FlowNode['data'] }) => {
  return (
    <div
      style={{
        padding: '10px',
        borderRadius: '5px',
        background: 'white',
        border: '1px solid #ddd',
        width: '150px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{data.label}</div>
      {data.description && (
        <div style={{ fontSize: '10px' }}>{data.description}</div>
      )}
    </div>
  );
};

// Define custom node types
const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

const FlowChart: React.FC<FlowChartProps> = ({
  data,
  title,
  width = '100%',
  height = 400,
  isInteractive = true,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(data.nodes);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [edges, setEdges, onEdgesChange] = useEdgesState(data.edges);

  // Handle node click if interactive
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      if (!isInteractive) return;
      console.log('Node clicked:', node);
    },
    [isInteractive]
  );

  return (
    <div style={{ width, height: Number(height) + 50 }}>
      {title && (
        <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{title}</h3>
      )}
      <div style={{ width: '100%', height }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={isInteractive ? onNodesChange : undefined}
          onEdgesChange={isInteractive ? onEdgesChange : undefined}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          attributionPosition="bottom-left"
          connectionLineType={ConnectionLineType.SmoothStep}
        >
          <Controls showInteractive={isInteractive} />
          <MiniMap />
          <Background />
          {isInteractive && (
            <Panel position="top-right">
              <div style={{ background: 'white', padding: '5px', borderRadius: '3px' }}>
                Interactive Mode: Click nodes to select
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};

export default FlowChart; 