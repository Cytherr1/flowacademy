"use client";
import CreateNewButton from "@/components/createnewbutton";
import { deleteWorkspace } from "@/lib/actions/workspaceActions";
import {
  ActionIcon,
  Alert,
  Button,
  Center,
  Group,
  Menu,
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
  IconCircleCheckFilled,
  IconCircleXFilled,
  IconAdjustments,
} from "@tabler/icons-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import EditButton from "./editbutton";

type WorkspaceItem = {
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
} | null;

interface Quota {
  id: number;
  userId: string;
  videosUploaded: number;
  maxVideosAllowed: number;
  lastUpdated: Date;
}

type VideoItem = {
  id: number;
  workspaceId: number;
  file_path: string;
  upload_time: Date;
  is_outsource: boolean;
} | null;

interface WorkspaceProps {
  workspaces: WorkspaceItem[];
  quota: Quota;
  videos: VideoItem[];
}

export default function Workspace({
  workspaces,
  quota,
  videos,
}: WorkspaceProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceItem | null>(null);
  const [workspaceToEdit, setWorkspaceToEdit] = useState<WorkspaceItem | null>(
    null
  );
  const [videoToEdit, setVideoToEdit] = useState<VideoItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();

  const handleDelete = (workspace: WorkspaceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaceToDelete(workspace);
    setDeleteModalOpen(true);
  };

  const handleEdit = (workspace: WorkspaceItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setWorkspaceToEdit(workspace);
    const matchingVideo = filterVideos(videos, workspace?.id);
    setVideoToEdit(matchingVideo);
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
      console.log("Error deleting workspace:", error);
      setMessage({
        text:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        type: "error",
      });
    }
  };

  const filterVideos = (
    videos: VideoItem[],
    workspaceId: number | undefined
  ): VideoItem => {
    const matchingVideos = videos.filter(
      (video) => video?.workspaceId === workspaceId
    );
    return matchingVideos[0] || null;
  };

  const rows = workspaces.map((element) => {
    if (!element) return null;
    const handleRowClick = (e: React.MouseEvent) => {
      if (
        e.target instanceof Element &&
        (e.target.closest(".menu-container") ||
          e.target.closest(".menu-dropdown"))
      ) {
        return;
      }
      router.push(`/workspace/${element.id}`);
    };

    return (
      <TableTr
        key={element.id}
        onClick={handleRowClick}
        style={{ cursor: "pointer" }}
      >
        <TableTd>{element.project_name}</TableTd>
        <TableTd>{element.description}</TableTd>
        <TableTd>
          <div className="menu-container" onClick={(e) => e.stopPropagation()}>
            <Menu
              trigger="hover"
              openDelay={100}
              closeDelay={400}
              transitionProps={{ transition: "rotate-right", duration: 150 }}
            >
              <Menu.Target>
                <ActionIcon
                  variant="filled"
                  size="xl"
                  radius="xl"
                  aria-label="Settings"
                >
                  <IconAdjustments
                    style={{ width: "70%", height: "70%" }}
                    stroke={1.5}
                  />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown className="menu-dropdown">
                <Menu.Item
                  className="action-button"
                  variant="default"
                  color="blue"
                  onClick={(e) => handleEdit(element, e)}
                  leftSection={<IconEdit size={28} />}
                >
                  Edit
                </Menu.Item>
                <Menu.Item
                  className="action-button"
                  variant="default"
                  color="red"
                  onClick={(e) => handleDelete(element, e)}
                  leftSection={<IconTrash size={28} />}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </div>
        </TableTd>
      </TableTr>
    );
  });

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

        <Table
          align="right"
          horizontalSpacing="xl"
          withColumnBorders
          highlightOnHover
        >
          <TableThead>
            <TableTr>
              <TableTh>Project Name</TableTh>
              <TableTh>Project Description</TableTh>
              <TableTh></TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{rows}</TableTbody>
        </Table>

        <Modal
          centered
          withCloseButton={false}
          size="xl"
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
          size="xl"
          opened={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <EditButton
            workspace={workspaceToEdit}
            video={videoToEdit}
            quota={quota}
          ></EditButton>
        </Modal>
      </Stack>
    </Center>
  );
}
