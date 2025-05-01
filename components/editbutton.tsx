"use client";

import { useState, useEffect, useRef } from "react";
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
  }>({ text: "", type: null });
  const [visible, { toggle }] = useDisclosure(false);

  const originalVideoType = workspace?.video_type;
  const isQuotaFull =
    (quota?.videosUploaded ?? 0) >= (quota?.maxVideosAllowed || 0);
  const isInvalidQuotaSwitch =
    originalVideoType === "outsource" && isQuotaFull;

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
      projectName: (v) => (v ? null : "Project name is required"),
      video_type: (v, values) =>
        values.with_video && !v ? "Video type is required" : null,
      outsourceLink: (v, values) =>
        values.with_video &&
        values.video_type === "outsource" &&
        !v
          ? "Outsource link is required"
          : null,
      file: (v, values) =>
        values.with_video &&
        values.video_type === "upload" &&
        !fileUrl &&
        !v
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
    const base = form.values.file.name.split(".")[0];
    const videoID = `${base}_${timestamp}`;
    formData.append("videoID", videoID);

    try {
      const userResp = await fetch("/api/user/current");
      if (userResp.ok) {
        const { id } = await userResp.json();
        formData.append("userID", id);
      }

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/bunny/upload", true);

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setUploadProgress(
            Math.round((e.loaded / e.total) * 100)
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          setFileUrl(res.url);
          setMessage({
            text: `File uploaded successfully: ${res.url}`,
            type: "success",
          });
          form.setFieldValue("file", null);
          form.setFieldValue("videoID", res.videoID);
        } else {
          setMessage({
            text: "Upload failed: " + xhr.statusText,
            type: "error",
          });
        }
        setIsLoading(false);
      };

      xhr.onerror = () => {
        setMessage({ text: "Network error during upload", type: "error" });
        setIsLoading(false);
      };

      xhr.send(formData);
    } catch (err) {
      setMessage({
        text:
          err instanceof Error ? err.message : "Unexpected error",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    form.validate();
    if (!form.isValid()) return;

    setMessage({ text: "", type: null });
    toggle();

    try {
      if (
        originalVideoType === "outsource" &&
        form.values.video_type === "upload"
      ) {
        if (isQuotaFull) {
          setMessage({
            text: "Not enough quota to switch to Upload.",
            type: "error",
          });
          toggle();
          return;
        }
        await increaseQuota(quota?.id || 0);
      }
      if (
        originalVideoType === "upload" &&
        form.values.video_type === "outsource"
      ) {
        await decreaseQuota(quota?.id || 0, workspace?.id || 0);
      }

      const payload = new FormData();
      payload.append("workspaceID", String(form.values.workspaceID));
      payload.append("projectName", form.values.projectName);
      payload.append("with_video", String(form.values.with_video));
      payload.append("video_type", form.values.video_type);
      payload.append("description", form.values.description);
      payload.append("outsourceLink", form.values.outsourceLink || "");
      if (fileUrl) payload.append("fileUrl", fileUrl);
      if (form.values.videoID)
        payload.append("videoID", String(form.values.videoID));

      if (!workspace?.id) {
        setMessage({ text: "Workspace ID missing", type: "error" });
        toggle();
        return;
      }

      await deleteVideo(workspace.id);
      const result = await editProject(payload);

      if (result.success && result.targetUrl) {
        setMessage({ text: "Project updated!", type: "success" });
        setFileUrl(null);
        router.push(result.targetUrl);
      } else {
        setMessage({
          text: result.error || "Failed to update project",
          type: "error",
        });
        toggle();
      }
    } catch (err) {
      setMessage({
        text:
          err instanceof Error ? err.message : "Unexpected error",
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

  const isSubmitDisabled =
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
          Not enough quota to switch to Upload.
        </Alert>
      ) : (
        <Alert color="yellow" mb="md">
          Switching to Upload will consume quota.
        </Alert>
      );
    }
    if (
      originalVideoType === "upload" &&
      form.values.video_type === "outsource"
    ) {
      return (
        <Alert color="green" mb="md">
          Switching to Outsource frees up quota.
        </Alert>
      );
    }
    return null;
  };

  return (
    <Box>
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ blur: 2 }} />

      <form onSubmit={handleSubmit}>
        <Title order={2} mb="md">
          Update Project Details
        </Title>

        {renderQuotaAlert()}

        <TextInput
          label="Project Name"
          placeholder="Enter project name"
          {...form.getInputProps("projectName")}
          mb="md"
          required
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
            mb="md"
            required
          >
            <Group mt="xs">
              <Radio
                value="upload"
                label="Upload"
                disabled={isInvalidQuotaSwitch}
              />
              <Radio value="outsource" label="YouTube" />
            </Group>
          </Radio.Group>
        )}

        {form.values.with_video && form.values.video_type === "upload" && (
          <Stack gap="md">
            {!fileUrl ? (
              <>
                <FileInput
                  label="Select file to upload"
                  placeholder="Click to select"
                  accept="video/*"
                  leftSection={<IconUpload size={14} />}
                  {...form.getInputProps("file")}
                  disabled={isInvalidQuotaSwitch}
                  required
                />

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress value={uploadProgress} mt="sm" radius="xl" />
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
              <Alert icon={<IconCheck />} color="green">
                File uploaded successfully!
              </Alert>
            )}

            {video?.file_path && (
              <>
                <Title order={4}>Current Video</Title>
                <AspectRatio ratio={16 / 9} mb="md">
                  <iframe
                    src={video.file_path}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="Current video"
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
              placeholder="https://youtube.com/..."
              {...form.getInputProps("outsourceLink")}
              required
            />

            {video?.file_path && (
              <>
                <Title order={4}>Current Video</Title>
                <AspectRatio ratio={16 / 9}>
                  <iframe
                    src={video.file_path}
                    style={{ border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    title="Embedded video"
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

        <Button fullWidth type="submit" disabled={isSubmitDisabled}>
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
