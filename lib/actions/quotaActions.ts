"use server";

import db from "../db";

export async function getQuota(id: number | undefined) {
  try {
    if (!id) {
      throw new Error("Missing quotaID");
    }

    const quota = await db.quota.findFirst({
      where: {
        id: id,
      },
    });

    return quota;
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error fetching quota:", err.message);
    throw new Error(err.message || "Failed to fetch quota name");
  }
}

export async function assignQuota(userId: string) {
  try {
    if (!userId) {
      throw new Error("Missing userID");
    }

    await db.quota.create({
      data: {
        userId: userId,
      },
    });
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error fetching quota:", err.message);
    throw new Error(err.message || "Failed to fetch quota name");
  }
}

export async function increaseQuota(id: number | undefined) {
  try {
    if (!id) {
      throw new Error("Missing userID");
    }

    await db.quota.update({
      where: {
        id: id,
      },
      data: {
        videosUploaded: {
          increment: 1,
        },
      },
    });

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error increasing quota:", err.message);
    throw new Error(err.message || "Failed to increase quota");
  }
}

export async function decreaseQuota(
  id: number | undefined,
  workspaceID: number | undefined
): Promise<{ success: true }> {
  try {
    if (!id) {
      throw new Error("Missing or userID");
    }

    if (workspaceID != -1) {
      const videoType = await db.video.findFirst({
        where: {
          workspaceId: workspaceID,
        },
        select: {
          is_outsource: true,
        },
      });

      if (videoType?.is_outsource === false) {
        await db.quota.update({
          where: {
            id: id,
          },
          data: {
            videosUploaded: {
              decrement: 1,
            },
          },
        });
      }
    } else {
      await db.quota.update({
        where: {
          id: id,
        },
        data: {
          videosUploaded: {
            decrement: 1,
          },
        },
      });
    }

    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error decreasing quota:", err.message);
    throw new Error(err.message || "Failed to decrease quota");
  }
}
