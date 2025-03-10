// to run this page, run the command: npm run dev
// http://localhost:3000/mami-test


"use client"

import { useState } from 'react';
import Upload from '@/components/upload';
import { Container, Title, Text, Box, Divider, Paper, Group, Button } from '@mantine/core';

export default function TestUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  // This function will be called after successful upload
  const handleUploadSuccess = (url: string) => {
    setUploadedFiles(prev => [...prev, url]);
  };

  return (
    <Container size="md" py="xl">
      <Title order={2} mb="md">Bunny CDN Video Upload Test</Title>
      <Text mb="lg" c="dimmed">
        This page tests the video upload functionality using Bunny CDN. 
        Uploaded videos will be stored in your Bunny Storage Zone and can be viewed in the Bunny dashboard.
      </Text>
      
      <Paper withBorder p="md" mb="xl">
        <Title order={3} mb="md">Upload Component</Title>
        <Upload onSuccess={handleUploadSuccess} />
      </Paper>

      <Divider my="lg" label="Instructions" labelPosition="center" />
      
      <Box mb="xl">
        <Title order={4} mb="sm">How to Test:</Title>
        <Text component="ol" pl="md">
          <li>Select a video file using the file input above</li>
          <li>Click the &quot;Upload&quot; button</li>
          <li>Wait for the upload to complete</li>
          <li>Check for the success message with the file URL</li>
          <li>Visit your Bunny CDN dashboard to verify the upload</li>
        </Text>
      </Box>

      <Box mb="xl">
        <Title order={4} mb="sm">Bunny CDN Dashboard:</Title>
        <Text mb="md">
          To check if your uploaded videos appear in the Bunny dashboard:
        </Text>
        <Group>
          <Button 
            component="a" 
            href="https://dash.bunny.net/" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            Open Bunny Dashboard
          </Button>
        </Group>
      </Box>

      {uploadedFiles.length > 0 && (
        <Box>
          <Title order={4} mb="sm">Uploaded Files:</Title>
          <Paper withBorder p="md">
            {uploadedFiles.map((url, index) => (
              <Text key={index} component="div" mb="xs">
                <a href={url} target="_blank" rel="noopener noreferrer">{url}</a>
              </Text>
            ))}
          </Paper>
        </Box>
      )}
    </Container>
  );
} 