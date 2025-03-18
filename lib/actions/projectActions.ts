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
    const userID = session?.user?.id
    if (!userID) {
      return {
        success: false,
        targetUrl: "",
        error: "User not authenticated",
      };
    }

    const projectName = formData.get("projectName") as string;
    const withVideo = formData.get("withVideo") === "true";
    const videoType = formData.get("videoType") as string;
    const description = formData.get("description") as string;
    const outsourceLink = formData.get("outsourceLink") as string;
    const fileUrl = formData.get("fileUrl") as string;
    const videoID = formData.get("videoID") as string;

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
      // Create workspace with required fields only
      const workspace = await db.workspace.create({
        data: {
          project_name: projectName,
          userId: userID,
        },
      });
      
      // Set description using Prisma's executeRaw method
      await db.$executeRaw`UPDATE Workspace SET description = ${description || "No description provided"} WHERE id = ${workspace.id}`;
      
      if (withVideo) {
        await db.video.create({
          data: {
            file_path: videoType === "upload" ? fileUrl : outsourceLink,
            workspaceId: workspace.id,
          },
        });
      }
      
      if (withVideo && videoID && videoType === "upload") {
        console.log(`Stored video reference: ${videoID} for workspace ID: ${workspace.id}`);
      }
      
      const targetUrl = `/workspace1/${workspace.id}`;
      return { success: true, targetUrl };
    } catch (dbError) {
      console.error("Database error:", dbError);
      return {
        success: false,
        targetUrl: "",
        error: "Database error creating workspace",
      };
    }
  } catch (error) {
    console.error("Project creation error:", error);
    return {
      success: false,
      targetUrl: "",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
