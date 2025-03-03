/* 

localhost:3000/api/bunny/fetch/[id] olarak derlemeniz gerekir.
534434 id numaralı user'ın id'sini URL'e eklerseniz sadece o kişiye ait videolar size gelir.
Kullanıcı log-in olduktan sonra bu API sayesinde ilgili workspace'lerin videoları bu şekilde çekilebilir.
Videoların isimlerinin formatı UserID-VideoID-UploadTime olabilir (unique olması bakımından).

*/

import axios from "axios";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    console.log(listUrl)

    const userId = await params.id;

    const videos = response.data.filter((item: { ObjectName: string }) => {
      return (
        item.ObjectName.match(/\.(mp4|webm|mov|mkv)$/i) &&
        item.ObjectName.startsWith(`${userId}-`)
      );
    });

    return Response.json(videos);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Failed to fetch videos" },
      { status: 500 }
    );
  }
}