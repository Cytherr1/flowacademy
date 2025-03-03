export interface BunnyFile {
  Guid: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  ServerId: number;
  ArrayNumber: number;
  IsDirectory: boolean;
  UserId: string;
  ContentType: string;
  DateCreated: string;
  StorageZoneId: number;
  Checksum: string;
  ReplicatedZones: string;
}

export default async function Display() {
  const pullZone = process.env.BUNNY_PULL_ZONE?.trim();
  const API_URL = process.env.BUNNY_API_URL?.trim();
  const API_KEY = process.env.BUNNY_API_KEY?.trim();

  console.log(API_URL);

  if (!API_URL) {
    throw new Error("BUNNY_API_URL environment variable is not defined.");
  }

  if (!API_KEY) {
    throw new Error("BUNNY_API_KEY environment variable is not defined.");
  }

  const res = await fetch(API_URL, {
    headers: {
      AccessKey: API_KEY,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch files from Bunny CDN");
  }

  const files: BunnyFile[] = await res.json();

  return (
    <div>
      {files.map((file) => (
        <div key={file.Guid} className="mb-8">
          <video
            controls
            src={`${pullZone}${file.ObjectName}`}
            className="w-full"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
}
