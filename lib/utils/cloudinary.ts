import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadVideo = async (file: string): Promise<{ url: string; public_id: string }> => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'video',
      folder: 'videos',
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    console.error('Error uploading video to Cloudinary:', error);
    throw new Error('Failed to upload video');
  }
};

export const deleteVideo = async (public_id: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(public_id, { resource_type: 'video' });
  } catch (error) {
    console.error('Error deleting video from Cloudinary:', error);
    throw new Error('Failed to delete video');
  }
}; 