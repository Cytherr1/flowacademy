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
  LoadingOverlay,
  AspectRatio,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconCheck, IconUpload } from "@tabler/icons-react";
import { editProject } from "@/lib/actions/projectActions";
import { deleteVideo } from "@/lib/actions/videoActions";
import { useDisclosure } from "@mantine/hooks";

interface EditButtonProps {
  workspace: Workspace;
  video: Video;
  quota: Quota;
}

type Video = {
  id: number;
  workspaceId: number;
  file_path: string;
  upload_time: Date;
  is_outsource: boolean;
} | null;

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

type Quota = {
  id: number;
  userId: string;
  videosUploaded: number;
  maxVideosAllowed: number;
  lastUpdated: Date;
} | null;

export default function EditButton({
  workspace,
  video,
  quota,
}: EditButtonProps) {
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
  const [visible, { toggle }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      workspaceID: workspace?.id,
      projectName: workspace?.project_name || "",
      with_video: workspace?.with_video || false,
      video_type: workspace?.video_type || "",
      description: workspace?.description || "",
      outsourceLink: video?.file_path || "",
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
        values.with_video &&
        values.video_type === "upload" &&
        !fileUrl &&
        !value
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
    const fileName = form.values.file.name.split(".")[0];
    const videoID = `${fileName}_${timestamp}`;

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
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form
        action={async (formData: FormData) => {
          form.validate();
          if (!form.isValid()) {
            return;
          }
          setMessage({ text: "", type: null });

          try {
            formData.append(
              "workspaceID",
              form.values.workspaceID?.toString() || ""
            );
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

            if (!workspace?.id) {
              setMessage({ text: "Workspace ID is required", type: "error" });
              return;
            }

            await deleteVideo(workspace?.id);

            const result = await editProject(formData);
            if (result.success && result.targetUrl) {
              setMessage({
                text: "Project edited successfully",
                type: "success",
              });
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
        <input type="hidden" name="workspaceId" value={workspace?.id} />
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
        />

        {form.values.with_video && (
          <Radio.Group
            label="Video Type"
            {...form.getInputProps("video_type")}
            required
            mb="xl"
          >
            <Group mt="xs">
              <Radio value="upload" label="Upload" />
              <Radio value="outsource" label="Youtube" />
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
            <Title order={4}>Current Video</Title>
            <AspectRatio
              ratio={16 / 9}
              style={{ minWidth: "400px", margin: "0 auto" }}
              mb="md"
            >
              <iframe
                src={video?.file_path}
                style={{ border: 0, width: "100%", height: "100%" }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </AspectRatio>
          </Stack>
        )}
        {form.values.with_video && form.values.video_type === "outsource" && (
          <Stack mb="md">
            <TextInput
              label="Outsource Link"
              placeholder="https://www.youtube.com/..."
              {...form.getInputProps("outsourceLink")}
              required
              mb="md"
            />
            <Title order={4}>Current Video</Title>
            <AspectRatio
              ratio={16 / 9}
              style={{ minWidth: "400px", margin: "0 auto" }}
            >
              <iframe
                title="Embedded video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                src={video?.file_path}
                style={{ border: 0, width: "100%", height: "100%" }}
              />
            </AspectRatio>
          </Stack>
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
          onClick={toggle}
        >
          Update Project
        </Button>
      </form>
    </Box>
  );
}
