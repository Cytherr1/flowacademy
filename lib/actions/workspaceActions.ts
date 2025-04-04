"use server";

import db from "../db";
import { decreaseQuota } from "./quotaActions";

export async function deleteWorkspace(
  workspaceID: number,
  quotaID: number | undefined
) {
  try {
    if (!workspaceID || !quotaID) {
      return {
        success: false,
        error: "WorkspaceID and quotaID is required",
      };
    }

    const video = await db.video.findFirst({
      where: {
        workspaceId: workspaceID,
      },
    });

    try {
      if (video?.is_outsource === false) {
        await decreaseQuota(quotaID, workspaceID);
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
          return result;
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
