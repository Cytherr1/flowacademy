"use client";
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
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";

export default function CreateProjectButton() {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      mode: "uncontrolled",
      projectName: "",
      withVideo: false,
      videoType: "",
      description: "",
      outsourceLink: "",
    },
    onSubmitPreventDefault: "validation-failed",
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log(values);
  };

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

          {form.values.videoType === "upload" && /*<Upload />*/ <div>UploadComponent</div>}

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

      <ActionIcon w={225} h={350} p="md" variant="default" onClick={open}>
        <IconPlus size={48} />
      </ActionIcon>
    </Box>
  );
}
