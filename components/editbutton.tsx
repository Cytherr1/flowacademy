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
import { decreaseQuota, increaseQuota } from "@/lib/actions/quotaActions";

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

  const originalVideoType = workspace?.video_type;

  const isQuotaFull = quota
    ? (quota.videosUploaded || 0) >= (quota.maxVideosAllowed || 3)
    : false;

  const isInvalidQuotaSwitch = originalVideoType === "outsource" && isQuotaFull;

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
    if (
      originalVideoType === "outsource" &&
      form.values.video_type === "upload" &&
      isQuotaFull
    ) {
      setMessage({
        text: "Not enough quota available to switch from Outsource to Upload.",
        type: "error",
      });
      return;
    }

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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    form.validate();

    if (!form.isValid()) {
      return;
    }

    setMessage({ text: "", type: null });
    toggle();

    try {
      const formData = new FormData();
      formData.append("workspaceID", form.values.workspaceID?.toString() || "");
      formData.append("projectName", form.values.projectName);
      formData.append("with_video", String(form.values.with_video));
      formData.append("video_type", form.values.video_type);
      formData.append("description", form.values.description || "");
      formData.append("outsourceLink", form.values.outsourceLink || "");

      if (
        originalVideoType === "outsource" &&
        form.values.video_type === "upload"
      ) {
        if (isQuotaFull) {
          setMessage({
            text: "Not enough quota available to switch from Outsource to Upload.",
            type: "error",
          });
          toggle();
          return;
        }

        try {
          await increaseQuota(quota?.id || 0);
        } catch (error) {
          setMessage({
            text:
              error instanceof Error
                ? error.message
                : "Failed to increase quota",
            type: "error",
          });
          toggle();
          return;
        }
      }
      if (
        originalVideoType === "upload" &&
        form.values.video_type === "outsource"
      ) {
        try {
          await decreaseQuota(quota?.id || 0, workspace?.id || 0);
        } catch (error) {
          setMessage({
            text:
              error instanceof Error
                ? error.message
                : "Failed to decrease quota",
            type: "error",
          });
          toggle();
          return;
        }
      }
      if (fileUrl) {
        formData.append("fileUrl", fileUrl);
      }
      if (form.values.videoID) {
        formData.append("videoID", form.values.videoID.toString());
      }

      if (!workspace?.id) {
        setMessage({ text: "Workspace ID is required", type: "error" });
        toggle();
        return;
      }
      await deleteVideo(workspace.id);
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
        toggle();
      }
    } catch (error) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "error",
      });
      toggle();
    }
  };

  const isFileUploadDisabled =
    !form.values.file ||
    isLoading ||
    (originalVideoType === "outsource" &&
      form.values.video_type === "upload" &&
      isQuotaFull);

  const isSubmitButtonDisabled =
    (form.values.with_video &&
      form.values.video_type === "upload" &&
      !fileUrl) ||
    (originalVideoType === "outsource" &&
      form.values.video_type === "upload" &&
      isQuotaFull);
  const renderQuotaAlert = () => {
    if (
      originalVideoType === "outsource" &&
      form.values.video_type === "upload"
    ) {
      return isQuotaFull ? (
        <Alert color="red" mb="md">
          Not enough quota available to switch from Outsource to Upload.
        </Alert>
      ) : (
        <Alert color="red" mb="md">
          Changing from Outsource to Upload will increase your quota usage.
          <br />
          Are you sure you want to proceed?
        </Alert>
      );
    }

    if (
      originalVideoType === "upload" &&
      form.values.video_type === "outsource"
    ) {
      return (
        <Alert color="yellow" mb="md">
          Changing from Upload to Outsource will decrease your quota usage.
        </Alert>
      );
    }

    return null;
  };

  return (
    <Box>
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

      <form onSubmit={handleSubmit}>
        <Title order={2} mb="md">
          Update Project Details
        </Title>
        {renderQuotaAlert()}
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
            mb="md"
          >
            <Group mt="xs">
              <Radio
                value="upload"
                label="Upload"
                disabled={isInvalidQuotaSwitch}
              />
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
                  disabled={isInvalidQuotaSwitch}
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} size="md" radius="xl">
                    {`${uploadProgress}%`}
                  </Progress>
                )}

                <Button
                  onClick={handleFileUpload}
                  disabled={isFileUploadDisabled}
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
            {video?.file_path && (
              <>
                <Title order={4}>Current Video</Title>
                <AspectRatio ratio={16 / 9} mb="md">
                  <iframe
                    src={video.file_path}
                    style={{ border: 0, width: "100%", height: "100%" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </AspectRatio>
              </>
            )}
          </Stack>
        )}
        {form.values.with_video && form.values.video_type === "outsource" && (
          <Stack mb="md">
            <TextInput
              label="Outsource Link"
              placeholder="https://www.youtube.com/..."
              {...form.getInputProps("outsourceLink")}
              required
            />
            {video?.file_path && (
              <>
                <Title order={4}>Current Video</Title>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    title="Embedded video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    src={video.file_path}
                    style={{ border: 0, width: "100%", height: "100%" }}
                  />
                </AspectRatio>
              </>
            )}
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
          disabled={isSubmitButtonDisabled}
          onClick={toggle}
        >
          Update Project
        </Button>
        {message.text && message.type && (
          <Alert color={message.type === "success" ? "green" : "red"} mt="md">
            {message.text}
          </Alert>
        )}
      </form>
    </Box>
  );
}
