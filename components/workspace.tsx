"use client";
import CreateNewButton from "@/components/createnewbutton";
import { deleteWorkspace } from "@/lib/actions/workspaceActions";
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Group,
  Modal,
  Stack,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconPointerFilled,
  IconCircleCheckFilled,
  IconCircleXFilled,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditButton from "./editbutton";
interface WorkspaceItem {
  id: number;
  project_name: string;
  description: string;
  userId: string;
  created_at: Date;
  with_video: boolean;
  video_type?: string;
  outsourceLink?: string;
  fileUrl?: string;
  videoID?: string;
}

type Quota = {
  id: number;
  userId: string;
  videosUploaded: number;
  maxVideosAllowed: number;
  lastUpdated: Date;
} | null;

interface WorkspaceProps {
  workspaces: WorkspaceItem[];
  quota: Quota;
}

export default function Workspace({ workspaces, quota }: WorkspaceProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceItem | null>(null);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<WorkspaceItem | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const handleDelete = (workspace: WorkspaceItem) => {
    setWorkspaceToDelete(workspace);
    setDeleteModalOpen(true);
  };

  const handleEdit = async (workspace: WorkspaceItem) => {
    setWorkspaceToEdit(workspace);
    setEditModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!workspaceToDelete) return;
      const result = await deleteWorkspace(workspaceToDelete.id, quota?.id);

      if (result.success) {
        setDeleteModalOpen(false);
        setMessage({ text: "Workspace deleted successfully", type: "success" });
        router.refresh();
      } else {
        setMessage({
          text: result.error || "Failed to delete workspace",
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
  };

  const rows = workspaces.map((element) => (
    <TableTr key={element.id}>
      <TableTd>{element.project_name}</TableTd>
      <TableTd>{element.description}</TableTd>
      <TableTd>
        <Link href={`/workspace/${element.id}`}>
          <ActionIcon variant="default" size="input-sm" color="blue">
            <IconPointerFilled />
          </ActionIcon>
        </Link>
        <ActionIcon
          variant="default"
          size="input-sm"
          color="blue"
          onClick={() => handleEdit(element)}
        >
          <IconEdit />
        </ActionIcon>
        <ActionIcon
          variant="light"
          size="input-sm"
          color="red"
          onClick={() => handleDelete(element)}
        >
          <IconTrash />
        </ActionIcon>
      </TableTd>
    </TableTr>
  ));

  return (
    <Center miw="100%" mah="100%">
      <Stack w="90%">
        <Group justify="space-between" w="100%">
          <Button
            color={
              (quota?.videosUploaded ?? 0) >= (quota?.maxVideosAllowed ?? 0)
                ? "red"
                : "blue"
            }
          >
            Quota Remaining: {quota?.videosUploaded}/{quota?.maxVideosAllowed}
          </Button>
          <CreateNewButton quota={quota} />
        </Group>
        {message && (
          <Alert
            color={message.type === "success" ? "green" : "red"}
            withCloseButton
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Table align="right" horizontalSpacing="xl">
          <TableThead>
            <TableTr>
              <TableTh>Project Name</TableTh>
              <TableTh>Project Description</TableTh>
              <TableTh>Actions</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{rows}</TableTbody>
        </Table>

        <Modal
          centered
          withCloseButton={false}
          size="lg"
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Delete"
        >
          <Text>
            Are you sure you want to delete{" "}
            <b>{workspaceToDelete?.project_name}</b>?
          </Text>
          <Text mt="md">This process is irreversible!</Text>
          <Group justify="center" align="center" mt="md">
            <Button color="red" onClick={handleConfirmDelete}>
              <IconCircleCheckFilled size={16} style={{ marginRight: 8 }} />
              Delete
            </Button>
            <Button variant="outline" onClick={() => setDeleteModalOpen(false)}>
              <IconCircleXFilled size={16} style={{ marginRight: 8 }} />
              Cancel
            </Button>
          </Group>
        </Modal>
        <Modal
          centered
          withCloseButton={false}
          size="lg"
          opened={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit"
        >
          <EditButton workspace={workspaceToEdit}></EditButton>
        </Modal>
      </Stack>
    </Center>
  );
}
