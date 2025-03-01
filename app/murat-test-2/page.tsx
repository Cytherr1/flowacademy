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
    const url = "https://uurmurti.b-cdn.net/";
    const API_URL = "https://storage.bunnycdn.com/deneme-uur-murti/";
    const API_KEY = "05476f05-562e-4c1e-aa56d129d480-0843-4a52";
    
    if (!API_KEY) {
      throw new Error('BUNNY_API_KEY environment variable is not defined.');
    }
    
    const res = await fetch(API_URL, {
      headers: {
        AccessKey: API_KEY,
      },
      cache: 'no-store',
    });
    
    if (!res.ok) {
      throw new Error("Failed to fetch files from Bunny CDN");
    }
    
    const files: BunnyFile[] = await res.json();
    console.log(files);
    
    return (
      <div>
        {files.map((file) => (
          <div key={file.Guid} className="mb-8">
            <video
              controls
              src={`${url}${file.ObjectName}`}
              className="w-full"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        ))}
      </div>
    );
  }