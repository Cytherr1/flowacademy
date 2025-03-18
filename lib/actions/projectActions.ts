"use server";

import { revalidatePath } from "next/cache";

type CreateProjectResult = {
  success: boolean;
  url?: string;
  error?: string;
};

export async function createProjectWithoutFile(formData: FormData): Promise<CreateProjectResult> {
  try {
    const projectName = formData.get("projectName") as string;
    const withVideo = formData.get("withVideo") === "true";
    const videoType = formData.get("videoType") as string;
    const description = formData.get("description") as string;
    const outsourceLink = formData.get("outsourceLink") as string;
    const fileUrl = formData.get("fileUrl") as string;

    if (!projectName) {
      return { success: false, error: "Project name is required" };
    }

    if (withVideo) {
      if (!videoType) {
        return { success: false, error: "Video type is required" };
      }

      if (videoType === "upload" && !fileUrl) {
        return { success: false, error: "File URL is required" };
      }

      if (videoType === "outsource" && !outsourceLink) {
        return { success: false, error: "Outsource link is required" };
      }
    }

    const project = {
      projectName,
      withVideo,
      videoType: withVideo ? videoType : null,
      description: description || null,
      outsourceLink: (withVideo && videoType === "outsource") ? outsourceLink : null,
      fileUrl: (withVideo && videoType === "upload") ? fileUrl : null,
      createdAt: new Date(),
    };
    console.log("Project created:", project);

    revalidatePath("/projects");
    
    return { 
      success: true, 
      url: fileUrl 
    };
  } catch (error) {
    console.error("Project creation error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "An unexpected error occurred" 
    };
  }
}