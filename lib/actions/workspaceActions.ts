"use server"

import db from "../db";

export async function deleteWorkspace(workspaceID: number) {
  try {
    if (!workspaceID) {
      return {
        success: false,
        error: "WorkspaceID is required",
      };
    }

    const file = await db.video.findFirst({
      where: {
        workspaceId: workspaceID,
      },
      select: {
        id: true,
      }
    });

    if (file) {
      await fetch(`http://localhost:3000/api/bunny/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoID: file.id }),
      });
    }    

    await db.video.deleteMany({
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
