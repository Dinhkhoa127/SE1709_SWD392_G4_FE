// Cloudinary upload service
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

export const uploadToCloudinary = async (file, customFileName = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', import.meta.env.VITE_CLOUDINARY_FOLDER || 'biosample'); // Optional: organize uploads
    
    if (customFileName) {
      formData.append('public_id', `${customFileName}`);
    } else {
      formData.append('public_id', `${import.meta.env.VITE_CLOUDINARY_FOLDER || 'biosample'}/${file.name}`);
    }
    const response = await fetch(CLOUDINARY_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: file.name
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

// For video/audio uploads
export const uploadMediaToCloudinary = async (file, customFileName = null) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'biology-recognition/media');
    formData.append('resource_type', 'auto'); // Auto-detect resource type

    if (customFileName) {
      formData.append('public_id', `biology-recognition/media/${customFileName}`);
    }

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      originalName: file.name,
      resourceType: data.resource_type
    };
  } catch (error) {
    console.error('Cloudinary media upload error:', error);
    throw error;
  }
};
