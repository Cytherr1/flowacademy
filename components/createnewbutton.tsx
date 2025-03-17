"use client";
import { handleError } from "@/lib/errorHandler";
import {
  ActionIcon,
  Button,
  Checkbox,
  Modal,
  Radio,
  TextInput,
  Textarea,
  Group,
  Box,
  Title,
  Stack,
  FileInput,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconAlertCircle,
  IconCheck,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import { useState } from "react";

interface UploadProps {
  onSuccess?: (url: string) => void;
}
interface FormValues {
  file: File | null,
  projectName: String,
  videoType: String,
  description: String | null,
  outsourceLink: String | null,
}

export default function CreateNewButton({ onSuccess }: UploadProps = {}) {
  const [opened, { open, close }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({
    text: "",
    type: null,
  });

  const handleSubmit = async (values: FormValues) => {
    if (!values.file) return;

    setIsLoading(true);
    setMessage({ text: "", type: null });

    const formData = new FormData();
    formData.append("file", values.file);

    try {
      console.log(values);
      const response = await fetch("/api/bunny/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          text: `File uploaded successfully: ${data.url}`,
          type: "success",
        });
        form.reset();

        if (onSuccess && data.url) {
          onSuccess(data.url);
        }
      } else {
        const errorResponse = handleError(
          data.error || "Upload failed",
          "Failed to upload file"
        );

        setMessage({
          text: errorResponse.message,
          type: "error",
        });
      }
    } catch (error) {
      const errorResponse = handleError(
        error,
        "An error occurred during the upload"
      );

      setMessage({
        text: errorResponse.message,
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const form = useForm({
    initialValues: {
      mode: "uncontrolled",
      projectName: "",
      withVideo: false,
      videoType: "",
      description: "",
      outsourceLink: "",
      file: null,
    },
    // validate yazılacak
    onSubmitPreventDefault: "validation-failed",
  });

  return (
    <Box>
      <Modal
        centered={true}
        opened={opened}
        onClose={close}
        withCloseButton={false}
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Title order={2} mb="md">
            Create New Project
          </Title>
          <TextInput
            label="Project Name"
            placeholder="Enter project name"
            {...form.getInputProps("projectName")}
            required
            mb="md"
          />

          <Checkbox
            label="With Video?"
            {...form.getInputProps("withVideo", { type: "checkbox" })}
            mb="md"
          />

          {form.values.withVideo && (
            <Radio.Group
              label="Video Type"
              {...form.getInputProps("videoType")}
              required
              mb="md"
            >
              <Group mt="xs">
                <Radio value="upload" label="Upload" />
                <Radio value="outsource" label="Outsource" />
              </Group>
            </Radio.Group>
          )}

          {form.values.videoType === "upload" && (
            <Stack gap="md">
              <FileInput
                label="Select file to upload"
                placeholder="Click to select file"
                accept="video/*,image/*"
                leftSection={<IconUpload size={14} />}
                {...form.getInputProps("file")}
              />

              {message.text && (
                <Alert
                  icon={
                    message.type === "success" ? (
                      <IconCheck />
                    ) : (
                      <IconAlertCircle />
                    )
                  }
                  title={message.type === "success" ? "Success" : "Error"}
                  color={message.type === "success" ? "green" : "red"}
                >
                  {message.text}
                </Alert>
              )}

              <Group justify="flex-start">
              </Group>
            </Stack>
          )}

          {form.values.videoType === "outsource" && (
            <TextInput
              label="Outsource Link"
              placeholder="Enter video link"
              {...form.getInputProps("outsourceLink")}
              required
              mb="md"
            />
          )}

          <Textarea
            label="Project Description (Optional)"
            placeholder="Enter description"
            {...form.getInputProps("description")}
            mb="md"
          />

          <Button fullWidth type="submit" mb="md">
            Create Project
          </Button>
          
        </form>
      </Modal>

      <Button rightSection={<IconPlus/>}>Create new</Button>
    </Box>
  );
}
