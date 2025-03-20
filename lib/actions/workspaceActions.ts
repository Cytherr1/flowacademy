"use server";

import db from "../db";

export async function deleteWorkspace(workspaceID: number) {
  try {
    if (!workspaceID) {
      return {
        success: false,
        error: "WorkspaceID is required",
      };
    }

    try {
      // Find the associated video first
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
        // Extract the videoID from the file_path if possible
        // The file_path may contain the videoID in the format: endpoint/videoID.extension
        let videoIDForBunny = String(video.id); // Default to the database ID

        if (video.file_path) {
          // Try to extract the videoID from the file path
          const filePathParts = video.file_path.split("/");
          const fileNameWithExtension = filePathParts[filePathParts.length - 1];

          if (fileNameWithExtension) {
            // Remove extension from filename
            const videoIDFromPath = fileNameWithExtension.split(".")[0];
            if (videoIDFromPath) {
              videoIDForBunny = videoIDFromPath;
              console.log(`Extracted videoID from path: ${videoIDForBunny}`);
            }
          }
        }

        // Delete the video from Bunny CDN
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
          // Continue with database deletion even if Bunny deletion fails
        }
      }
    } catch (videoError) {
      console.error("Error processing video for deletion:", videoError);
      // Continue with database deletion even if video processing fails
    }

    // Delete from database
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
