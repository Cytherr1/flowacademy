"use client"

import { useState } from 'react';
import { Button, FileInput, Paper, Group, Stack, Alert } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { handleError } from '@/lib/errorHandler';

interface FormValues {
  file: File | null;
}

interface UploadProps {
  onSuccess?: (url: string) => void;
}

const Upload = ({ onSuccess }: UploadProps = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({
    text: '',
    type: null,
  });

  const form = useForm<FormValues>({
    initialValues: {
      file: null,
    },
    validate: {
      file: (value) => (value ? null : 'Please select a file'),
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!values.file) return;

    setIsLoading(true);
    setMessage({ text: '', type: null });

    const formData = new FormData();
    formData.append('file', values.file);

    try {
      const response = await fetch('/api/bunny/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: `File uploaded successfully: ${data.url}`,
          type: 'success',
        });
        form.reset();
        
        // Call the onSuccess callback if provided
        if (onSuccess && data.url) {
          onSuccess(data.url);
        }
      } else {
        // Use the error handler to process the API error
        const errorResponse = handleError(
          data.error || 'Upload failed',
          'Failed to upload file'
        );
        
        setMessage({
          text: errorResponse.message,
          type: 'error',
        });
      }
    } catch (error) {
      // Use the error handler for unexpected errors
      const errorResponse = handleError(
        error,
        'An error occurred during the upload'
      );
      
      setMessage({
        text: errorResponse.message,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <FileInput
            label="Select file to upload"
            placeholder="Click to select file"
            accept="video/*,image/*"
            leftSection={<IconUpload size={14} />}
            {...form.getInputProps('file')}
          />

          {message.text && (
            <Alert
              icon={message.type === 'success' ? <IconCheck /> : <IconAlertCircle />}
              title={message.type === 'success' ? 'Success' : 'Error'}
              color={message.type === 'success' ? 'green' : 'red'}
            >
              {message.text}
            </Alert>
          )}

          <Group justify="flex-start">
            <Button
              type="submit"
              loading={isLoading}
              disabled={!form.values.file}
              mb="md"
            >
              Upload
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
};

export default Upload; 