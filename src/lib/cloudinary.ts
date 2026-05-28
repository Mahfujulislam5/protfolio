/// <reference types="vite/client" />
export function uploadToCloudinary(file: File, onProgress?: (progress: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dh0yxnlcc";
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "z_eMg6RM7lTHj2HVW52ZJoqo0e8";

    if (!cloudName || !uploadPreset) {
      reject(new Error("Cloudinary credentials are missing. Please set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your app's environment variables."));
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.secure_url);
      } else {
        const error = JSON.parse(xhr.responseText);
        reject(new Error(error.error?.message || "Failed to upload image to Cloudinary"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error occurred while uploading."));
    };

    xhr.send(formData);
  });
}

