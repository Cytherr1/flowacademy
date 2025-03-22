import { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";
import axios from "axios";
import createNodeRequest from "@/lib/createNodeRequest";
import { handleError } from "@/lib/errorHandler";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: Request): Promise<Response> {
  const nodeReq = await createNodeRequest(request);
  const form = new IncomingForm();

  return new Promise<Response>((resolve) => {
    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        const errorResponse = handleError(
          err,
          "File upload failed"
        );
        
        return resolve(
          Response.json(
            { error: errorResponse.message },
            { status: 500 }
          )
        );
      }

      const fileField = files.file;
      let file: FormidableFile | undefined;

      if (Array.isArray(fileField)) {
        file = fileField[0];
      } else {
        file = fileField;
      }

      if (!file) {
        const errorResponse = handleError(
          new Error("No file uploaded"),
          "No file uploaded"
        );
        
        return resolve(
          Response.json(
            { error: errorResponse.message },
            { status: 400 }
          )
        );
      }

      // Extract video ID from form fields
      const videoID = fields.videoID ? 
        (Array.isArray(fields.videoID) ? fields.videoID[0] : fields.videoID) : 
        null;

      if (!videoID) {
        const errorResponse = handleError(
          new Error("Video ID is required"),
          "Video ID is required"
        );
        
        return resolve(
          Response.json(
            { error: errorResponse.message },
            { status: 400 }
          )
        );
      }
      
      // Get optional userID from form fields
      const userID = fields.userID ? 
        (Array.isArray(fields.userID) ? fields.userID[0] : fields.userID) : 
        'user';
        
      // Get optional workspaceID from form fields
      const workspaceID = fields.workspaceID ? 
        (Array.isArray(fields.workspaceID) ? fields.workspaceID[0] : fields.workspaceID) : 
        'temp';

      // Get file extension from original filename
      const fileExtension = file.originalFilename?.split('.').pop() || 'mp4';
      
      // Create a structured file name for better organization
      const structuredVideoID = `${userID}_${workspaceID}_${videoID}`;

      const fileStream = fs.createReadStream(file.filepath);

      try {
        const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
        const apiKey = process.env.BUNNY_API_KEY;
        const uploadUrl = `${process.env.BUNNY_HOSTNAME}${storageZoneName}/${structuredVideoID}.${fileExtension}`;

        axios.put(uploadUrl, fileStream, {
          headers: {
            AccessKey: apiKey,
            "Content-Type": file.mimetype || "application/octet-stream",
          },
        })
        .then(() => {
          resolve(
            Response.json({
              url: `${process.env.BUNNY_PULL_ZONE}${structuredVideoID}.${fileExtension}`,
              videoID: structuredVideoID,
              originalVideoID: videoID // Keep the original for reference
            })
          );
        })
        .catch((error) => {
          const errorResponse = handleError(
            error,
            "File upload to Bunny CDN failed"
          );
          
          resolve(
            Response.json(
              { error: errorResponse.message },
              { status: 500 }
            )
          );
        });
      } catch (error) {
        const errorResponse = handleError(
          error,
          "File upload to Bunny CDN failed"
        );
        
        return resolve(
          Response.json(
            { error: errorResponse.message },
            { status: 500 }
          )
        );
      }
    });
  });
}