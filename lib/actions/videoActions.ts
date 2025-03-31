"use server";

import db from "../db";

export async function deleteVideo(workspaceID: number) {
  try {
    if (!workspaceID) {
      return {
        success: false,
        error: "WorkspaceID is required",
      };
    }

    const video = await db.video.findFirst({
      where: {
        workspaceId: workspaceID,
      },
    });
    
    if (video?.is_outsource === false) {
      let videoIDForBunny = String(video?.id);

      if (video?.file_path) {
        const filePathParts = video?.file_path.split("/");
        const fileNameWithExtension = filePathParts[filePathParts.length - 1];

        if (fileNameWithExtension) {
          const videoIDFromPath = fileNameWithExtension.split(".")[0];
          if (videoIDFromPath) {
            videoIDForBunny = videoIDFromPath;
          }
        }
      }

      try {
        const response = await fetch(`http://localhost:3000/api/bunny/delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ videoID: videoIDForBunny }),
        });

        const result = await response.json();
        return result;
      } catch (fetchError) {
        return {
            success: false,
            targetUrl: "",
            error: fetchError || "An unexpected error occurred",
          };
      }
    }
  } catch (videoError) {
    return {
        success: false,
        targetUrl: "",
        error: videoError || "An unexpected error occurred",
      };
  }
}
