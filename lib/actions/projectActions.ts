"use server";

import { auth } from "../auth";
import db from "../db";

type CreateProjectResult = {
  success: boolean;
  url?: string;
  targetUrl: string;
  error?: string;
};

export async function createProjectWithoutFile(
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
    const videoType = formData.get("videoType")?.toString() || "";
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
      if (!videoType) {
        return {
          success: false,
          targetUrl: "",
          error: "Video type is required",
        };
      }
      if (videoType === "upload" && !fileUrl) {
        return { success: false, targetUrl: "", error: "File URL is required" };
      }
      if (videoType === "outsource" && !outsourceLink) {
        return {
          success: false,
          targetUrl: "",
          error: "Outsource link is required",
        };
      }
    }

    try {
      await db.$queryRaw`
        INSERT INTO Workspace (userId, project_name, description, created_at) 
        VALUES (${userID}, ${projectName}, ${description}, NOW())
      `;

      const idResult = await db.$queryRaw`SELECT LAST_INSERT_ID() as id`;

      type QueryResult = { id: number };
      const results = idResult as QueryResult[];

      if (!results.length || !results[0].id) {
        throw new Error("Failed to create workspace");
      }

      const workspaceId = results[0].id;

      if (withVideo) {
        const filePath = videoType === "upload" ? fileUrl : outsourceLink;
        await db.$queryRaw`
          INSERT INTO Video (workspaceId, file_path, upload_time)
          VALUES (${workspaceId}, ${filePath}, NOW())
        `;

        if (videoType === "upload" && videoID) {
          console.log(
            `Video reference: ${videoID} for workspace ID: ${workspaceId}`
          );
        }
      }

      const targetUrl = `/workspace1/${workspaceId}`;
      return { success: true, targetUrl };
    } catch (dbError) {
      const errorMessage =
        dbError instanceof Error ? dbError.message : String(dbError);
      console.error("Database error:", errorMessage);
      return {
        success: false,
        targetUrl: "",
        error: `Database error: ${errorMessage}`,
      };
    }
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
