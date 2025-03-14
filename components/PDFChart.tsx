import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';
import { StepData } from './Chart';

interface PDFChartProps {
  data: StepData[];
  type: 'bar' | 'pie';
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
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
  },
  pieContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 5,
  },
  bar: {
    width: 20,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 8,
    textAlign: 'center',
  },
  valueLabel: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 2,
  },
  pieSlice: {
    position: 'absolute',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 5,
  },
  legendColor: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 8,
  },
});

const PDFChart: React.FC<PDFChartProps> = ({
  data,
  type,
  title,
}) => {
  // Calculate the maximum value for scaling
  const maxValue = Math.max(...data.map(item => item.value));
  
  // Bar chart rendering
  const renderBarChart = () => (
    <View style={styles.chartContainer}>
      {data.map((item, index) => {
        const barHeight = (item.value / maxValue) * 120; // Scale to max height of 120
        return (
          <View key={index} style={styles.barContainer}>
            <Text style={styles.valueLabel}>{item.value}</Text>
            <View
              style={{
                ...styles.bar,
                height: barHeight,
                backgroundColor: item.color,
              }}
            />
            <Text style={styles.barLabel}>{item.name}</Text>
          </View>
        );
      })}
    </View>
  );

  // Simplified pie chart rendering (just colored boxes for legend)
  const renderPieChart = () => (
    <View>
      <View style={styles.pieContainer}>
        <Text>Pie chart representation</Text>
        <Text style={{ fontSize: 8 }}>See legend for data breakdown</Text>
      </View>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View
              style={{
                ...styles.legendColor,
                backgroundColor: item.color,
              }}
            />
            <Text style={styles.legendText}>
              {item.name}: {item.value} ({((item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100).toFixed(0)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      {type === 'bar' ? renderBarChart() : renderPieChart()}
    </View>
  );
};

export default PDFChart; 