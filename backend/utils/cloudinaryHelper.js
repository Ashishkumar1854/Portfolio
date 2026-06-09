import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const uploadToCloudinary = async (localFilePath, folderName) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `ashish_portfolio/${folderName}`,
      resource_type: 'auto',
    });

    // Remove the locally saved temporary file
    fs.unlinkSync(localFilePath);
    
    return response.secure_url;
  } catch (error) {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    console.error('Cloudinary upload error:', error);
    throw new Error('Image upload failed');
  }
};

export const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;
    
    // Extract public_id from secure_url
    const urlParts = imageUrl.split('/');
    const folderWithFile = urlParts.slice(-3).join('/'); // ashish_portfolio/folderName/filename.jpg
    const publicId = folderWithFile.split('.')[0]; // remove extension
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
};
