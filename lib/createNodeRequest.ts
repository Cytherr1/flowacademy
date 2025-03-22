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
  const nodeReq = Object.assign(stream, {
    headers,
    method: request.method,
    url: request.url
  }) as Readable & Pick<IncomingMessage, 'headers' | 'method' | 'url'>;
  
  return nodeReq as IncomingMessage;
}