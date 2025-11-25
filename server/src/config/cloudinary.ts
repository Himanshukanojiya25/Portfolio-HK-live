import { v2 as cloudinary } from 'cloudinary';
import { config } from './environment.js';

// Configure Cloudinary
if (config.cloudinary.isConfigured) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
  });
  console.log('☁️ Cloudinary configured successfully');
} else {
  console.warn('⚠️ Cloudinary not configured - file uploads will be disabled');
}

// Cloudinary utility functions
export const cloudinaryUtils = {
  // Upload file to Cloudinary
  uploadFile: async (file: Buffer, folder: string = 'portfolio') => {
    if (!config.cloudinary.isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: folder,
          timeout: 60000, // 60 seconds timeout
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      ).end(file);
    });
  },

  // Delete file from Cloudinary
  deleteFile: async (publicId: string) => {
    if (!config.cloudinary.isConfigured) {
      throw new Error('Cloudinary is not configured');
    }

    return await cloudinary.uploader.destroy(publicId);
  },

  // Check if Cloudinary is configured
  isConfigured: config.cloudinary.isConfigured,
};

export default cloudinaryUtils;