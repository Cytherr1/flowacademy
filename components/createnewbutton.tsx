"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
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
  Progress,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  IconCheck,
  IconExclamationCircle,
  IconPlus,
  IconUpload,
} from "@tabler/icons-react";
import {
  createProject,
  createProjectWithoutQuota,
} from "@/lib/actions/projectActions";
import { decreaseQuota, increaseQuota } from "@/lib/actions/quotaActions";
import { useDisclosure } from "@mantine/hooks";

type Quota = {
  id: number;
  userId: string;
  videosUploaded: number;
  maxVideosAllowed: number;
  lastUpdated: Date;
} | null;

type Message = {
  text: string;
  type: "success" | "error" | null;
};
interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: (targetUrl: string) => void;
  quota: Quota;
}

const CreateProjectModal = ({
  onClose,
  onSuccess,
  quota,
}: CreateProjectModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visible, { toggle }] = useDisclosure(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<Message>({ text: "", type: null });

  const form = useForm({
    initialValues: {
      projectName: "",
      withVideo: false,
      video_type: "",
      description: "",
      outsourceLink: "",
      file: null as File | null,
      videoID: "",
    },
    validate: {
      projectName: (value) => (value ? null : "Project name is required"),
      video_type: (value, values) =>
        values.withVideo && !value ? "Video type is required" : null,
      outsourceLink: (value, values) =>
        values.withVideo && values.video_type === "outsource" && !value
          ? "Outsource link is required"
          : null,
      file: (value, values) =>
        values.withVideo && values.video_type === "upload" && !fileUrl && !value
          ? "File is required"
          : null,
    },
  });

  useEffect(() => {
    if (!form.values.withVideo) {
      form.setFieldValue("video_type", "");
      form.setFieldValue("outsourceLink", "");
      form.setFieldValue("file", null);
      setFileUrl(null);
    }
  }, [form.values.withVideo]);

  const handleFileUpload = async () => {
    if (!form.values.file || !quota) return;

    await increaseQuota(quota.id);

    setIsLoading(true);
    setUploadProgress(0);
    setMessage({ text: "Uploading file...", type: null });

    const uploadData = new FormData();
    uploadData.append("file", form.values.file);

    const timestamp = Date.now();
    const fileName = form.values.file.name.split(".")[0];
    const videoID = `${fileName}_${timestamp}`;
    uploadData.append("videoID", videoID);

    try {
      const userResponse = await fetch("/api/user/current");
      if (userResponse.ok) {
        const userData = await userResponse.json();
        if (userData.id) {
          uploadData.append("userID", userData.id);
        }
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      await decreaseQuota(quota.id, -1);
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

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setFileUrl(response.url);
          setMessage({ text: "File uploaded successfully", type: "success" });
          form.setFieldValue("file", null);
          form.setFieldValue("videoID", response.videoID);
        } else {
          setMessage({
            text: `Upload failed: ${xhr.statusText}`,
            type: "error",
          });
        }
        setIsLoading(false);
      };

      xhr.onerror = () => {
        setMessage({ text: "Upload failed: Network error", type: "error" });
        setIsLoading(false);
      };

      xhr.send(uploadData);
    } catch (error: any) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "error",
      });
      setIsLoading(false);
      await decreaseQuota(quota.id, -1);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.validate();
    if (!form.isValid()) return;

    setMessage({ text: "", type: null });
    const submissionData = new FormData();
    submissionData.append("projectName", form.values.projectName);
    submissionData.append("withVideo", String(form.values.withVideo));
    submissionData.append("video_type", form.values.video_type);
    submissionData.append("description", form.values.description || "");
    submissionData.append("outsourceLink", form.values.outsourceLink || "");

    if (fileUrl) {
      submissionData.append("fileUrl", fileUrl);
    }
    if (form.values.videoID) {
      submissionData.append("videoID", form.values.videoID.toString());
    }

    try {
      const result = await createProject(submissionData);
      if (result.success && result.targetUrl) {
        setMessage({ text: "Project created successfully", type: "success" });
        setFileUrl(null);
        onSuccess(result.targetUrl);
      } else {
        setMessage({
          text: result.error || "Failed to create project",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "error",
      });
    }
  };

  return (
    <Modal centered opened onClose={onClose} withCloseButton={false} size="lg">
      <LoadingOverlay
        visible={visible}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      <form onSubmit={handleSubmit}>
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
          <>
            <Radio.Group
              label="Video Type"
              {...form.getInputProps("video_type")}
              required
              mb="md"
            >
              <Group mt="xs">
                <Radio value="upload" label="Upload" />
                <Radio value="outsource" label="Youtube" />
              </Group>
            </Radio.Group>

            {form.values.video_type === "upload" && (
              <Stack gap="md" mb="md">
                {!fileUrl ? (
                  <>
                    <FileInput
                      label="Select file to upload"
                      placeholder="Click to select file"
                      accept="video/*"
                      leftSection={<IconUpload size={14} />}
                      {...form.getInputProps("file")}
                    />
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <Progress value={uploadProgress} size="md" radius="xl">
                        {`${uploadProgress}%`}
                      </Progress>
                    )}
                    <Button
                      onClick={handleFileUpload}
                      disabled={!form.values.file || isLoading}
                      loading={isLoading}
                      type="button"
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
            {form.values.video_type === "outsource" && (
              <TextInput
                label="Outsource Link"
                placeholder="https://www.youtube.com/..."
                {...form.getInputProps("outsourceLink")}
                mb="md"
              />
            )}
          </>
        )}
        <Textarea
          label="Project Description (Optional)"
          placeholder="Enter description"
          {...form.getInputProps("description")}
          mb="md"
        />
        {message.text && (
          <Alert color={message.type === "error" ? "red" : "green"} mb="md">
            {message.text}
          </Alert>
        )}
        <Button
          fullWidth
          type="submit"
          onClick={toggle}
          disabled={
            form.values.withVideo &&
            form.values.video_type === "upload" &&
            !fileUrl
          }
        >
          Create Project
        </Button>
      </form>
    </Modal>
  );
};
interface CreateProjectWithoutQuotaModalProps {
  onClose: () => void;
  onSuccess: (targetUrl: string) => void;
}

const CreateProjectWithoutQuotaModal = ({
  onClose,
  onSuccess,
}: CreateProjectWithoutQuotaModalProps) => {
  const [message, setMessage] = useState<Message>({ text: "", type: null });
  const [visible, { toggle }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      projectName: "",
      outsourceLink: "",
      description: "",
      video_type: "",
    },
    validate: {
      projectName: (value) => (value ? null : "Project name is required"),
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.validate();
    if (!form.isValid()) return;

    setMessage({ text: "", type: null });
    const submissionData = new FormData();

    submissionData.append("projectName", form.values.projectName);
    submissionData.append("description", form.values.description || "");
    submissionData.append(
      "withVideo",
      form.values.outsourceLink ? "true" : "false"
    );
    submissionData.append(
      "video_type",
      form.values.outsourceLink ? "outsource" : ""
    );
    submissionData.append("outsourceLink", form.values.outsourceLink || "");

    try {
      const result = await createProjectWithoutQuota(submissionData);
      if (result.success && result.targetUrl) {
        setMessage({ text: "Project created successfully", type: "success" });
        onSuccess(result.targetUrl);
      } else {
        setMessage({
          text: result.error || "Failed to create project",
          type: "error",
        });
      }
    } catch (error: any) {
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "error",
      });
    }
  };

  return (
    <Modal centered opened onClose={onClose} withCloseButton={false} size="lg">
      <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <form onSubmit={handleSubmit}>
        <Title order={2} mb="md">
          Create New Project
        </Title>
        <Alert
          variant="light"
          color="red"
          radius="xl"
          title="No Quota Remaining!"
          icon={<IconExclamationCircle />}
          mb="md"
        >
          You need to delete at least one workspace to create a new one with a
          video. You can still proceed with a YouTube link.
        </Alert>
        <TextInput
          label="Project Name"
          placeholder="Enter project name"
          {...form.getInputProps("projectName")}
          mb="md"
          required
        />
        <TextInput
          label="Outsource Link"
          placeholder="https://www.youtube.com/..."
          {...form.getInputProps("outsourceLink")}
          mb="md"
        />
        <Textarea
          label="Project Description (Optional)"
          placeholder="Enter description"
          {...form.getInputProps("description")}
          mb="md"
        />
        {message.text && (
          <Alert color={message.type === "error" ? "red" : "green"} mb="md">
            {message.text}
          </Alert>
        )}
        <Button onClick={toggle} fullWidth type="submit">
          Create Project
        </Button>
      </form>
    </Modal>
  );
};
interface CreateNewButtonProps {
  quota: Quota;
}

export default function CreateNewButton({ quota }: CreateNewButtonProps) {
  const router = useRouter();
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isNoQuotaModalOpen, setNoQuotaModalOpen] = useState(false);

  const handleSuccess = (targetUrl: string) => {
    router.push(targetUrl);
  };

  const handleOpenModal = () => {
    if (quota && quota.videosUploaded < quota.maxVideosAllowed) {
      setProjectModalOpen(true);
    } else {
      setNoQuotaModalOpen(true);
    }
  };

  return (
    <Box>
      <Button rightSection={<IconPlus />} onClick={handleOpenModal}>
        Create new
      </Button>
      {isProjectModalOpen && (
        <CreateProjectModal
          onClose={() => setProjectModalOpen(false)}
          onSuccess={handleSuccess}
          quota={quota}
        />
      )}
      {isNoQuotaModalOpen && (
        <CreateProjectWithoutQuotaModal
          onClose={() => setNoQuotaModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </Box>
  );
}
