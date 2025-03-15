import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { FlowData, FlowNode } from './FlowChart';

interface PDFFlowChartProps {
  data: FlowData;
  title?: string;
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderStyle: 'solid',
  },
  title: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  flowContainer: {
    marginTop: 10,
  },
  nodeContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderStyle: 'solid',
    padding: 8,
    borderRadius: 3,
  },
  nodeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  nodeDescription: {
    fontSize: 8,
  },
  edgeContainer: {
    marginTop: 5,
    marginBottom: 10,
  },
  edgeText: {
    fontSize: 8,
    color: '#666666',
  },
  note: {
    fontSize: 8,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
    color: '#666666',
  },
});

const PDFFlowChart: React.FC<PDFFlowChartProps> = ({
  data,
  title,
}) => {
  // Get node by ID helper function
  const getNodeById = (id: string): FlowNode | undefined => {
    return data.nodes.find(node => node.id === id);
  };

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      
      <View style={styles.flowContainer}>
        {/* Render nodes */}
        {data.nodes.map((node, index) => (
          <View key={index} style={styles.nodeContainer}>
            <Text style={styles.nodeTitle}>
              {node.data.label} (ID: {node.id})
            </Text>
            {node.data.description && (
              <Text style={styles.nodeDescription}>{node.data.description}</Text>
            )}
            
            {/* Render connections from this node */}
            <View style={styles.edgeContainer}>
              {data.edges
                .filter(edge => edge.source === node.id)
                .map((edge, edgeIndex) => {
                  const targetNode = getNodeById(edge.target);
                  return (
                    <Text key={edgeIndex} style={styles.edgeText}>
                      → Connects to: {targetNode?.data.label || edge.target}
                      {edge.label && ` (${edge.label})`}
                    </Text>
                  );
                })}
            </View>
          </View>
        ))}
      </View>
      
      <Text style={styles.note}>
        Note: This is a simplified representation of the flowchart for PDF format.
        For interactive flowchart, please view in the web application.
      </Text>
    </View>
  );
};

export default PDFFlowChart; 