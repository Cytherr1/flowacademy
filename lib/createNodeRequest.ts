"use server"

import { Readable } from "stream";
import { IncomingMessage } from "http";

export default async function createNodeRequest(request: Request): Promise<IncomingMessage> {
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