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

export async function POST(request: Request) {
  const nodeReq = await createNodeRequest(request);
  const form = new IncomingForm();

  return new Promise((resolve) => {
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

      const fileStream = fs.createReadStream(file.filepath);

      try {
        const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
        const apiKey = process.env.BUNNY_API_KEY;
        const uploadUrl = `${process.env.BUNNY_HOSTNAME}${storageZoneName}/${file.originalFilename}`;

        await axios.put(uploadUrl, fileStream, {
          headers: {
            AccessKey: apiKey,
            "Content-Type": file.mimetype || "application/octet-stream",
          },
        });

        return resolve(
          Response.json({
            url: `${process.env.BUNNY_PULL_ZONE}${file.originalFilename}`,
          })
        );
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
