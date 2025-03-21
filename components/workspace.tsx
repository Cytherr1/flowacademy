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

interface WorkspaceItem {
  id: number;
  project_name: string;
  description: string;
  userId: string;
  created_at: Date;
}

interface DeleteWorkspaceProps {
  workspaces: WorkspaceItem[];
}

export default function Workspace({ workspaces }: DeleteWorkspaceProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceItem | null>(null);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const handleDelete = (workspace: WorkspaceItem) => {
    setWorkspaceToDelete(workspace);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      if (!workspaceToDelete) return;
      const result = await deleteWorkspace(workspaceToDelete.id);
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
      </TableTd>
      <TableTd>
        <ActionIcon variant="default" size="input-sm" color="blue">
          <IconEdit />
        </ActionIcon>
      </TableTd>
      <TableTd>
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
      <Stack align="flex-start" w="90%">
        <CreateNewButton />
        {message && (
          <Alert
            color={message.type === "success" ? "green" : "red"}
            withCloseButton
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        <Table horizontalSpacing="xl">
          <TableThead>
            <TableTr>
              <TableTh>Project Name</TableTh>
              <TableTh>Project Description</TableTh>
              <TableTh>Go To Workspace</TableTh>
              <TableTh>Edit</TableTh>
              <TableTh>Delete</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{rows}</TableTbody>
        </Table>

        <Modal
          centered
          opened={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          title="Confirm Deletion"
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
      </Stack>
    </Center>
  );
}
