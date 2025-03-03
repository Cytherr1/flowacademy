import axios from "axios";

export async function DELETE(request: Request) {
  try {
    const { userID, videoID, uploadTime } = await request.json(); 

    if (!userID || !videoID || !uploadTime) {
      return Response.json({ error: "Missing userID, videoID, or uploadTime" }, { status: 400 });
    }

    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
    const apiKey = process.env.BUNNY_API_KEY;

    if (!storageZoneName || !apiKey) {
      throw new Error("Storage zone or API key not configured");
    }

    const allowedExtensions = ['mp4', 'webm', 'mov', 'mkv'];

    for (let ext of allowedExtensions) {
      const filePath = `${process.env.BUNNY_HOSTNAME}/${storageZoneName}/${userID}-${videoID}-${uploadTime}.${ext}`;
      console.log(`Attempting to delete file: ${filePath}`);

      try {
        await axios.delete(filePath, {
          headers: {
            AccessKey: apiKey,
          },
        });
        console.log(`Deleted file: ${filePath}`);
        return Response.json({ message: "Video deleted successfully" });
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log(`File not found for extension ${ext}: ${filePath}`);
          continue;
        } else {
          throw new Error(error.response?.data || error.message || "Failed to delete video");
        }
      }
    }

    return Response.json({ error: "File not found with any allowed extensions" }, { status: 404 });
  } catch (error: any) {
    console.log("Error deleting video:", error.response?.data || error.message);
    return Response.json(
      { error: error.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}