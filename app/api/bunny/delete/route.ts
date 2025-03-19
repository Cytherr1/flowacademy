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
    const deletedFiles = [];

    // Log only once before we try to delete files
    console.log(`Attempting to delete video: ${videoID}`);

    for (const ext of allowedExtensions) {
      const filePath = `${process.env.BUNNY_HOSTNAME}${storageZoneName}/${videoID}.${ext}`;
      
      try {
        await axios.delete(filePath, {
          headers: {
            AccessKey: apiKey,
          },
        });
        deletedFiles.push(ext);
        deletedAny = true;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          // Don't log 404 errors - this is expected for extensions that don't exist
          continue;
        } else {
          const errorMessage = axiosError.response?.data || axiosError.message || "Failed to delete video";
          throw new Error(typeof errorMessage === 'string' ? errorMessage : 'Failed to delete video');
        }
      }
    }

    if (deletedAny) {
      console.log(`Successfully deleted video ${videoID} with formats: ${deletedFiles.join(', ')}`);
      return Response.json({ 
        message: "Video deleted successfully",
        formats: deletedFiles
      });
    } else {
      console.log(`No files found for video ID: ${videoID}`);
      return Response.json({ error: "File not found with any allowed extensions" }, { status: 404 });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error deleting video:", err.message);
    return Response.json(
      { error: err.message || "Failed to delete video" },
      { status: 500 }
    );
  }
}