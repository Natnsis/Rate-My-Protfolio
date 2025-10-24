import streamifier from 'streamifier';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

export const ImageUploader = (
  bufferImage: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      if (!result) return reject(new Error('No upload result from Cloudinary'));
      resolve(result);
    });
    streamifier.createReadStream(bufferImage).pipe(stream);
  });
};
