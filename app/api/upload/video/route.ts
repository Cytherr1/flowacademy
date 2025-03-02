import { NextRequest, NextResponse } from 'next/server';
import { uploadVideo } from '@/lib/utils/cloudinary';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const video = formData.get('video') as File;
    
    if (!video) {
      return NextResponse.json(
        { error: 'No video file provided' },
        { status: 400 }
      );
    }

    // Create a temporary file path
    const bytes = await video.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempPath = join('/tmp', video.name);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const result = await uploadVideo(tempPath);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in video upload:', error);
    return NextResponse.json(
      { error: 'Error uploading video' },
      { status: 500 }
    );
  }
} 