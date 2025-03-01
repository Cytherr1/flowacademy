// app/api/videos/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET() {
  try {
    const storageZoneName = 'deneme-uur-murti';
        const apiKey = '05476f05-562e-4c1e-aa56d129d480-0843-4a52';
    if (!storageZoneName || !apiKey) {
      throw new Error("Storage zone or API key not configured");
    }

    const listUrl = `https://storage.bunnycdn.com/${storageZoneName}/?recursive=true`;
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
