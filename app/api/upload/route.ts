import { NextRequest, NextResponse } from 'next/server';
import { IncomingForm, File as FormidableFile } from 'formidable';
import fs from 'fs';
import axios from 'axios';
import { Readable } from 'stream';
import { IncomingMessage } from 'http';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper to convert NextRequest to a Node.js IncomingMessage
async function createNodeRequest(request: NextRequest): Promise<IncomingMessage> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });
  const buffer = Buffer.from(await request.arrayBuffer());
  const stream = Readable.from(buffer);
  const nodeReq = stream as any;
  nodeReq.headers = headers;
  nodeReq.method = request.method;
  nodeReq.url = request.url;
  return nodeReq as IncomingMessage;
}

export async function POST(request: NextRequest) {
  const nodeReq = await createNodeRequest(request);
  const form = new IncomingForm();

  return new Promise((resolve) => {
    form.parse(nodeReq, async (err, fields, files) => {
      if (err) {
        return resolve(
          NextResponse.json({ error: 'File upload failed' }, { status: 500 })
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
          NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
        );
      }

      const fileStream = fs.createReadStream(file.filepath);

      try {
        const storageZoneName = 'deneme-uur-murti';
        const apiKey = '05476f05-562e-4c1e-aa56d129d480-0843-4a52';
        const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${file.originalFilename}`;

        await axios.put(uploadUrl, fileStream, {
          headers: {
            AccessKey: apiKey,
            'Content-Type': file.mimetype || 'application/octet-stream',
          },
        });

        return resolve(
          NextResponse.json({
            url: `https://uurmurti.b-cdn.net/${file.originalFilename}`,
          })
        );
      } catch (error: any) {
        return resolve(
          NextResponse.json(
            { error: error.message || 'File upload failed' },
            { status: 500 }
          )
        );
      }
    });
  });
}