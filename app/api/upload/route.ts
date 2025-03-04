import { IncomingForm, File as FormidableFile } from "formidable";
import fs from "fs";
import axios from "axios";
import createNodeRequest from "@/lib/createNodeRequest";

const ALLOWED_VIDEO_FORMATS = ["video/mp4", "video/webm", "video/quicktime", "video/x-matroska"];

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
        return resolve(
          Response.json({ error: "File upload failed" }, { status: 500 })
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
        return resolve(
          Response.json({ error: "No file uploaded" }, { status: 400 })
        );
      }

      if (!ALLOWED_VIDEO_FORMATS.includes(file.mimetype || "")) {
        return resolve(
          Response.json(
            { error: "Invalid file type. Only mp4, webm, mov, and mkv are allowed." },
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
            url: `${process.env.BUNNY_PULL_ZONE}/${file.originalFilename}`,
          })
        );
      } catch (error: any) {
        return resolve(
          Response.json(
            { error: error.message || "File upload failed" },
            { status: 500 }
          )
        );
      }
    });
  });
}