import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

export const ImageUploader = (bufferImage: Buffer) => {
  return new Promise((reject, resolved) => {
    const stream = cloudinary.uploader.upload_stream((err, result) => {
      if (err) return reject(err);
      resolved(result);
    });
    streamifier.createReadStream(bufferImage).pipe(stream);
  });
};
