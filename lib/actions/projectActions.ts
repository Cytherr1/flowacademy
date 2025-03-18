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
    const projectName = formData.get("projectName") as string;
    const withVideo = formData.get("withVideo") === "true";
    const videoType = formData.get("videoType") as string;
    const description = formData.get("description") as string;
    const outsourceLink = formData.get("outsourceLink") as string;
    const fileUrl = formData.get("fileUrl") as string;

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

    const workspace = await db.workspace.create({
      data: {
        project_name: projectName,
        user: { connect: { id: userID } },
        created_at: new Date(),
        description: description,
        video: withVideo
          ? {
              create: {
                file_path: videoType === "upload" ? fileUrl : outsourceLink,
                upload_time: new Date(),
              },
            }
          : undefined,
      },
      include: {
        video: true,
      },
    });
    const targetUrl = `/workspace/${workspace.id}`;
    return { success: true, targetUrl };
  } catch (error) {
    console.error("Project creation error:", JSON.stringify(error));
    return {
      success: false,
      targetUrl: "",
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
