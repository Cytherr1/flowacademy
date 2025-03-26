"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Checkbox,
  Radio,
  TextInput,
  Textarea,
  Group,
  Box,
  Title,
  Stack,
  FileInput,
  Alert,
  Progress,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { editWorkspace } from "@/lib/actions/workspaceActions";

interface EditButtonProps {
  workspace: Workspace;
}

type Workspace = {
  id: number;
  project_name: string;
  description: string;
  userId: string;
  created_at: Date;
  with_video?: boolean;
  video_type?: string;
  outsourceLink?: string;
  fileUrl?: string;
  videoID?: string;
} | null;

export default function EditButton({ workspace }: EditButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | null;
  }>({
    text: "",
    type: null,
  });

  const form = useForm({
    initialValues: {
      projectName: workspace?.project_name || "",
      with_video: workspace?.with_video || false,
      video_type: workspace?.video_type || "",
      description: workspace?.description || "",
      outsourceLink: workspace?.outsourceLink || "",
      file: null as File | null,
      videoID: workspace?.videoID || "",
    },
    validate: {
      projectName: (value) => (value ? null : "Project name is required"),
      video_type: (value, values) =>
        values.with_video && !value ? "Video type is required" : null,
      outsourceLink: (value, values) =>
        values.with_video && values.video_type === "outsource" && !value
          ? "Outsource link is required"
          : null,
      file: (value, values) =>
        values.with_video && values.video_type === "upload" && !fileUrl && !value
          ? "File is required"
          : null,
    },
  });

  useEffect(() => {
    if (!form.values.with_video) {
      form.setFieldValue("video_type", "");
      form.setFieldValue("outsourceLink", "");
      form.setFieldValue("file", null);
      setFileUrl(null);
    }
  }, [form.values.with_video]);

  const handleFileUpload = async () => {
    if (!form.values.file) return;

    setIsLoading(true);
    setUploadProgress(0);
    setMessage({ text: "Uploading file...", type: null });

    const formData = new FormData();
    formData.append("file", form.values.file);

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const videoID = `video_${timestamp}_${randomStr}`;

    formData.append("videoID", videoID);

    try {
      const userResponse = await fetch("/api/user/current");
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.id) {
          formData.append("userID", userData.id);
        }
      }
    } catch (error) {
      console.error("Error getting current user:", error);
    }

    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/bunny/upload", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round(
            (event.loaded / event.total) * 100
          );
          setUploadProgress(percentComplete);
        }
      };

      xhr.onload = function () {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFileUrl(response.url);
          setMessage({
            text: `File uploaded successfully: ${response.url}`,
            type: "success",
          });
          form.setFieldValue("file", null);
          form.setFieldValue("videoID", response.videoID);
        } else {
          setMessage({
            text: "Upload failed: " + xhr.statusText,
            type: "error",
          });
        }
        setIsLoading(false);
      };

      xhr.onerror = function () {
        setMessage({
          text: "Upload failed: Network error",
          type: "error",
        });
        setIsLoading(false);
      };

      xhr.send(formData);
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <form
        action={async (formData: FormData) => {
          form.validate();
          if (!form.isValid()) {
            return;
          }
          setMessage({ text: "", type: null });

          try {
            formData.append("projectName", form.values.projectName);
            formData.append("with_video", String(form.values.with_video));
            formData.append("video_type", form.values.video_type);
            formData.append("description", form.values.description || "");
            formData.append("outsourceLink", form.values.outsourceLink || "");

            if (fileUrl) {
              formData.append("fileUrl", fileUrl);
            }

            if (form.values.videoID) {
              formData.append("videoID", form.values.videoID.toString());
            }

            // API SHOULD BE EDITED

            const result = await editWorkspace(formData);
            if (result.success && result.targetUrl) {
              setMessage({
                text: "Project edited successfully",
                type: "success",
              });
              form.reset();
              setFileUrl(null);
              router.push(result.targetUrl);
            } else {
              setMessage({
                text: result.error || "Failed to edit project",
                type: "error",
              });
            }
          } catch (error) {
            setMessage({
              text:
                error instanceof Error
                  ? error.message
                  : "An unexpected error occurred",
              type: "error",
            });
          }
        }}
      >
        <Title order={2} mb="md">
          Update Project Details
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
          {...form.getInputProps("with_video", { type: "checkbox" })}
          mb="md"
          disabled
        />

        {form.values.with_video && (
          <Radio.Group
            label="Video Type"
            {...form.getInputProps("video_type")}
            required
            mb="md"
          >
            <Group mt="xs">
              <Radio value="upload" label="Upload" disabled/>
              <Radio value="outsource" label="Youtube" disabled/>
            </Group>
          </Radio.Group>
        )}
        {form.values.with_video && form.values.video_type === "upload" && (
          <Stack gap="md">
            {!fileUrl ? (
              <>
                <FileInput
                  label="Select file to upload"
                  placeholder="Click to select file"
                  accept="video/*"
                  leftSection={<IconUpload size={14} />}
                  {...form.getInputProps("file")}
                  required
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress
                    value={uploadProgress}
                    size="md"
                    radius="xl"
                  >{`${uploadProgress}%`}</Progress>
                )}
                <Button
                  onClick={handleFileUpload}
                  disabled={!form.values.file || isLoading}
                  loading={isLoading}
                >
                  Upload File
                </Button>
              </>
            ) : (
              <Alert
                icon={<IconCheck />}
                title="File Uploaded"
                color="green"
                mb="md"
              >
                File uploaded successfully
              </Alert>
            )}
          </Stack>
        )}
        {form.values.with_video && form.values.video_type === "outsource" && (
          <TextInput
            label="Outsource Link"
            placeholder="https://www.youtube.com/..."
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
        <Button
          fullWidth
          type="submit"
          disabled={
            form.values.with_video &&
            form.values.video_type === "upload" &&
            !fileUrl
          }
        >
          Update Project
        </Button>
      </form>
    </Box>
  );
}
