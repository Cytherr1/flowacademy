"use server";

import { auth } from "../auth";
import db from "../db";

type CreateProjectResult = {
  success: boolean;
  url?: string;
  targetUrl: string;
  error?: string;
};
interface saveProjectRowsProps {
  workspaceID: number;
  activities: Rows[];
}
type Rows = {
  distance: number;
  time: number;
  remarks: string | null;
  activityNo: number;
  activityName: string;
  symbolIndex: number | null;
};

interface DeleteRowProps {
  workspaceID: number;
  activityNo: number;
}

export async function createProject(
  formData: FormData
): Promise<CreateProjectResult> {
  try {
    const session = await auth();
    const userID = session?.user?.id;
    if (!userID) {
      return {
        success: false,
        targetUrl: "",
        error: "User not authenticated",
      };
    }

    const projectName = formData.get("projectName")?.toString() || "";
    const withVideo = formData.get("withVideo") === "true";
    const video_type = formData.get("video_type")?.toString() || "";
    const description =
      formData.get("description")?.toString() || "No description provided";
    const outsourceLink = formData.get("outsourceLink")?.toString() || "";
    const fileUrl = formData.get("fileUrl")?.toString() || "";
    const videoID = formData.get("videoID")?.toString() || "";

    if (!projectName) {
      return {
        success: false,
        targetUrl: "",
        error: "Project name is required",
      };
    }

    if (withVideo) {
      if (!video_type) {
        return {
          success: false,
          targetUrl: "",
          error: "Video type is required",
        };
      }
      if (video_type === "upload" && !fileUrl) {
        return { success: false, targetUrl: "", error: "File URL is required" };
      }
      if (video_type === "outsource" && !outsourceLink) {
        return {
          success: false,
          targetUrl: "",
          error: "Outsource link is required",
        };
      }
    }

    const workspace = await db.workspace.create({
      data: {
        userId: userID,
        project_name: projectName,
        description: description,
        created_at: new Date(),
        with_video: withVideo,
        video_type: video_type,
        ...(withVideo && {
          video: withVideo
            ? {
                create: {
                  file_path:
                    video_type === "upload"
                      ? fileUrl
                      : await urlToEmbed(outsourceLink),
                  upload_time: new Date(),
                  is_outsource: video_type !== "upload",
                },
              }
            : undefined,
        }),
      },
    });

    if (video_type === "upload" && videoID) {
      console.log(
        `Video reference: ${videoID} for workspace ID: ${workspace.id}`
      );
    }

    const targetUrl = `/workspace/${workspace.id}`;
    return { success: true, targetUrl };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Project creation error:", errorMessage);
    return {
      success: false,
      targetUrl: "",
      error: errorMessage || "An unexpected error occurred",
    };
  }
}

export async function editProject(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const projectName = formData.get("projectName")?.toString() || "";
    const withVideo = formData.get("withVideo") === "true";
    const video_type = formData.get("video_type")?.toString() || "";
    const description =
      formData.get("description")?.toString() || "No description provided";
    const outsourceLink = formData.get("outsourceLink")?.toString() || "";
    const fileUrl = formData.get("fileUrl")?.toString() || "";
    const workspaceID = formData.get("workspaceID")?.toString() || "";

    if (!projectName) {
      return {
        success: false,
        targetUrl: "",
        error: "Project name is required",
      };
    }

    if (withVideo) {
      if (!video_type) {
        return {
          success: false,
          targetUrl: "",
          error: "Video type is required",
        };
      }
      if (video_type === "upload" && !fileUrl) {
        return { success: false, targetUrl: "", error: "File URL is required" };
      }
      if (video_type === "outsource" && !outsourceLink) {
        return {
          success: false,
          targetUrl: "",
          error: "Outsource link is required",
        };
      }
    }

    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;

    if (isNaN(parsedWorkspaceID)) {
      return {
        success: false,
        error: "Invalid workspaceID format",
      };
    }

    const workspace = await db.workspace.findFirst({
      where: {
        id: parsedWorkspaceID,
      },
    });

    if (!workspace) {
      return {
        success: false,
        error: "Workspace not found",
      };
    }

    await db.workspace.update({
      where: {
        id: workspace?.id,
      },
      data: {
        userId: workspace?.userId,
        project_name:
          projectName !== ""
            ? (projectName as string)
            : (workspace?.project_name as string),
        description:
          description !== ""
            ? (description as string)
            : (workspace?.description as string),
        created_at: workspace?.created_at,
        with_video: workspace?.with_video,
        video_type: workspace?.video_type,
        ...(workspace?.with_video && {
          video: {
            update: {
              file_path:
                workspace?.video_type === "upload"
                  ? (fileUrl as string)
                  : await urlToEmbed(outsourceLink as string),
            },
          },
        }),
      },
    });
    const targetUrl = `/workspace/${workspace?.id}`;
    return { success: true, targetUrl };
  } catch {
    throw new Error("Project edit error.");
  }
}

export async function createProjectWithoutQuota(
  formData: FormData
): Promise<CreateProjectResult> {
  try {
    const session = await auth();
    const userID = session?.user?.id;
    if (!userID) {
      return {
        success: false,
        targetUrl: "",
        error: "User not authenticated",
      };
    }

    const projectName = formData.get("projectName")?.toString() || "";
    const withVideo = formData.get("withVideo") === "true";
    const video_type = formData.get("video_type")?.toString() || "";
    const description =
      formData.get("description")?.toString() || "No description provided";
    const outsourceLink = formData.get("outsourceLink")?.toString() || "none";

    if (!projectName) {
      return {
        success: false,
        targetUrl: "",
        error: "Project name is required",
      };
    }

    console.log("With Video:", withVideo);
    console.log("Video Type:", video_type);
    console.log("Outsource Link:", outsourceLink);

    if (withVideo && video_type === "outsource" && !outsourceLink) {
      return {
        success: false,
        targetUrl: "",
        error: "Outsource link is required",
      };
    }

    const workspace = await db.workspace.create({
      data: {
        userId: userID,
        project_name: projectName,
        description: description,
        created_at: new Date(),
        with_video: withVideo,
        video_type: video_type,
      },
    });

    if (withVideo && video_type === "outsource") {
      const embedUrl = await urlToEmbed(outsourceLink);

      await db.video.create({
        data: {
          workspaceId: workspace.id,
          file_path: embedUrl,
          upload_time: new Date(),
          is_outsource: true,
        },
      });
    }

    const targetUrl = `/workspace/${workspace.id}`;
    return { success: true, targetUrl };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Project creation error:", errorMessage);
    return {
      success: false,
      targetUrl: "",
      error: errorMessage || "An unexpected error occurred",
    };
  }
}

export async function fetchVideo(workspaceID: number | string) {
  try {
    if (!workspaceID) {
      throw new Error("Missing workspaceID");
    }

    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;

    if (isNaN(parsedWorkspaceID)) {
      throw new Error("Invalid workspaceID format");
    }

    const video = await db.video.findFirst({
      where: {
        workspaceId: parsedWorkspaceID,
      },
    });

    const videoPath = video?.file_path;

    return videoPath;
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error fetching workspace name:", err.message);
    throw new Error(err.message || "Failed to fetch workspace name");
  }
}

export async function fetchWorkspaceName(workspaceID: number | string) {
  try {
    if (!workspaceID) {
      throw new Error("Missing workspaceID");
    }

    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;

    if (isNaN(parsedWorkspaceID)) {
      throw new Error("Invalid workspaceID format");
    }

    const workspace = await db.workspace.findFirst({
      where: {
        id: parsedWorkspaceID,
      },
    });

    return workspace?.project_name;
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error fetching workspace name:", err.message);
    throw new Error(err.message || "Failed to fetch workspace name");
  }
}

export async function fetchProjectRows(workspaceID: number | string) {
  try {
    if (!workspaceID) {
      throw new Error("Missing workspaceID");
    }

    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;

    if (isNaN(parsedWorkspaceID)) {
      throw new Error("Invalid workspaceID format");
    }

    const rows = await db.rows.findMany({
      where: {
        workspaceId: parsedWorkspaceID,
      },
      select: {
        id: false,
        workspaceId: false,
        createdAt: false,
        updatedAt: false,
        workspace: false,
        activityNo: true,
        activityName: true,
        distance: true,
        time: true,
        symbolIndex: true,
        remarks: true,
      },
      orderBy: {
        activityNo: "asc",
      },
    });

    return rows;
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error fetching project rows:", err.message);
    throw new Error(err.message || "Failed to fetch project rows");
  }
}

export async function saveProjectRows({
  workspaceID,
  activities,
}: saveProjectRowsProps) {
  try {
    if (!workspaceID || !activities) {
      throw new Error("Missing workspaceID or activities");
    }
    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;
    if (isNaN(parsedWorkspaceID)) {
      throw new Error("Invalid workspaceID format");
    }

    await db.rows.deleteMany({
      where: {
        workspaceId: parsedWorkspaceID,
      },
    });

    await db.rows.createMany({
      data: activities.map((activity) => ({
        workspaceId: parsedWorkspaceID,
        activityNo: activity.activityNo,
        activityName: activity.activityName,
        distance: activity.distance,
        time: activity.time,
        symbolIndex: activity.symbolIndex,
        remarks: activity.remarks,
      })),
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error saving project rows:", err.message);
    throw new Error(err.message || "Failed to save project rows");
  }
}

export async function deleteRow({ workspaceID, activityNo }: DeleteRowProps) {
  try {
    if (!workspaceID || activityNo === undefined) {
      throw new Error("Missing workspaceID or activityNo");
    }

    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;

    if (isNaN(parsedWorkspaceID)) {
      throw new Error("Invalid workspaceID format");
    }

    await db.rows.deleteMany({
      where: {
        workspaceId: parsedWorkspaceID,
        activityNo: activityNo,
      },
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error deleting row:", err.message);
    throw new Error(err.message || "Failed to delete row");
  }
}

export async function isOutsource(workspaceID: number | string) {
  try {
    if (!workspaceID === undefined) {
      throw new Error("Missing workspaceID");
    }

    const parsedWorkspaceID =
      typeof workspaceID === "string" ? parseInt(workspaceID, 10) : workspaceID;

    if (isNaN(parsedWorkspaceID)) {
      throw new Error("Invalid workspaceID format");
    }

    const is_outsource = await db.video.findFirst({
      where: {
        workspaceId: parsedWorkspaceID,
      },
      select: {
        id: false,
        workspaceId: false,
        file_path: false,
        upload_time: false,
        workspace: false,
        is_outsource: true,
      },
    });

    return is_outsource?.is_outsource;
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error fetching is_outsource:", err.message);
    throw new Error(err.message || "Failed to fetch is_outsource");
  }
}

export async function urlToEmbed(
  outsourceLink: string | undefined
): Promise<string> {
  try {
    if (!outsourceLink) {
      throw new Error("Missing outsourceLink");
    }

    const regExp =
      /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|watch\?.*?&v=)([^#&?]{11}).*/;
    const match = outsourceLink.match(regExp);
    if (!match) {
      throw new Error("Invalid YouTube URL format");
    }
    const videoID = match[1];

    return `https://www.youtube.com/embed/${videoID}`;
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error converting URL to embed format:", err.message);
    throw new Error(err.message || "Failed to convert URL to embed");
  }
}
