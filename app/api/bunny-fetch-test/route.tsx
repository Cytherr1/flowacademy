import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const storageZoneName = process.env.BUNNY_STORAGE_ZONE_NAME;
    const apiKey = process.env.BUNNY_API_KEY;

    if (!storageZoneName || !apiKey) {
      throw new Error("Storage zone or API key not configured");
    }

    const listUrl = `${process.env.BUNNY_HOSTNAME}/${storageZoneName}/?recursive=true`;
    const response = await axios.get(listUrl, {
      headers: {
        AccessKey: apiKey,
      },
    });

    const videos = response.data.filter((item: { ObjectName: string }) =>
      item.ObjectName.match(/\.(mp4|webm|mov|mkv)$/i)
    );

    return NextResponse.json(videos);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}
