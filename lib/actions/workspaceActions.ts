"use server";

import db from "../db";

type CreateProjectResult = {
  success: boolean;
  url?: string;
  targetUrl: string;
  error?: string;
};

export async function deleteWorkspace(workspaceID: number) {
  try {
    if (!workspaceID) {
      return {
        success: false,
        error: "WorkspaceID is required",
      };
    }

    try {
      const video = await db.video.findFirst({
        where: {
          workspaceId: workspaceID,
        },
        select: {
          id: true,
          file_path: true,
        },
      });

      if (video) {
        let videoIDForBunny = String(video.id);

        if (video.file_path) {
          const filePathParts = video.file_path.split("/");
          const fileNameWithExtension = filePathParts[filePathParts.length - 1];

          if (fileNameWithExtension) {
            const videoIDFromPath = fileNameWithExtension.split(".")[0];
            if (videoIDFromPath) {
              videoIDForBunny = videoIDFromPath;
              console.log(`Extracted videoID from path: ${videoIDForBunny}`);
            }
          }
        }

        try {
          const response = await fetch(
            `http://localhost:3000/api/bunny/delete`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ videoID: videoIDForBunny }),
            }
          );

          const result = await response.json();
          console.log(`Bunny deletion result:`, result);
        } catch (fetchError) {
          console.error("Error deleting from Bunny CDN:", fetchError);
        }
      }
    } catch (videoError) {
      console.error("Error processing video for deletion:", videoError);
    }

    await db.video.deleteMany({
      where: {
        workspaceId: workspaceID,
      },
    });

    await db.rows.deleteMany({
      where: {
        workspaceId: workspaceID,
      },
    });

    await db.workspace.delete({
      where: {
        id: workspaceID,
      },
    });

    return { success: true };
  } catch (error) {
    console.error(
      "Workspace deletion error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function editWorkspace(
  formData: FormData
): Promise<CreateProjectResult> {
  try {
    const projectName = formData.get("projectName")?.toString().trim() || "";
    const videoType = formData.get("videoType")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const workspaceIdStr = formData.get("workspaceId")?.toString();
    const workspaceId = workspaceIdStr ? Number(workspaceIdStr) : null;

    let video = "";
    if (videoType === "upload") {
      video = formData.get("fileUrl")?.toString().trim() || "";
    } else if (videoType === "outsource") {
      video = formData.get("outsourceLink")?.toString().trim() || "";
    }

    if (!workspaceId) {
      return {
        success: false,
        targetUrl: "",
        error: "Workspace ID is required",
      };
    }
    if (!projectName) {
      return {
        success: false,
        targetUrl: "",
        error: "Project name is required",
      };
    }
    if (!videoType) {
      return {
        success: false,
        targetUrl: "",
        error: "Video type is required",
      };
    }
    if (!video) {
      return {
        success: false,
        targetUrl: "",
        error: "Video data is required",
      };
    }

    try {
      await db.$queryRaw`
        UPDATE Workspace
        SET project_name = ${projectName},
            description = ${description},
            video = ${video}
        WHERE id = ${workspaceId}
      `;

      const targetUrl = `/workspace/${workspaceId}`;
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
    console.error("Edit workspace error:", errorMessage);
    return {
      success: false,
      targetUrl: "",
      error: errorMessage || "An unexpected error occurred",
    };
  }
}
