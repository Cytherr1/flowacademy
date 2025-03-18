import axios from "axios";
import { AxiosError } from "axios";

export async function DELETE(request: Request) {
  try {
    const { videoID } = await request.json(); 

    if (!videoID) {
      return Response.json({ error: "Missing videoID" }, { status: 400 });
    }

    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
    const apiKey = process.env.BUNNY_API_KEY;

    if (!storageZoneName || !apiKey) {
      throw new Error("Storage zone or API key not configured");
    }

    const allowedExtensions = ['mp4', 'webm', 'mov', 'mkv'];
    let deletedAny = false;

    for (const ext of allowedExtensions) {
      const filePath = `${process.env.BUNNY_HOSTNAME}${storageZoneName}/${videoID}.${ext}`;
      console.log(`Attempting to delete file: ${filePath}`);

      try {
        await axios.delete(filePath, {
          headers: {
            AccessKey: apiKey,
          },
        });
        console.log(`Deleted file: ${filePath}`);
        deletedAny = true;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          console.log(`File not found for extension ${ext}: ${filePath}`);
          continue;
        } else {
          const errorMessage = axiosError.response?.data || axiosError.message || "Failed to delete video";
          throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Failed to delete video');
        }
      }
    }

    if (deletedAny) {
      return Response.json({ message: "Video deleted successfully" });
    } else {
      return Response.json({ error: "File not found with any allowed extensions" }, { status: 404 });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.log("Error deleting video:", err.message);
    return Response.json(
      { error: err.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}