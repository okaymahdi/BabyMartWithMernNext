import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

(async function () {
  // 1️⃣ Cloudinary config
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  let uploadResult;
  try {
    uploadResult = await cloudinary.uploader.upload(
      'https://res.cloudinary.com/demo/image/upload/getting-started/shoes.jpg',
      { public_id: 'shoes' },
    );
    console.log('Upload result:', uploadResult);
  } catch (error) {
    console.error('Upload failed:', error);
  }

  // Optimize
  const optimizeUrl = cloudinary.url('shoes', {
    fetch_format: 'auto',
    quality: 'auto',
  });
  console.log('Optimized URL:', optimizeUrl);

  // Transform
  const autoCropUrl = cloudinary.url('shoes', {
    crop: 'fill',
    gravity: 'auto',
    width: 500,
    height: 500,
  });
  console.log('Transformed URL:', autoCropUrl);
})();

export default cloudinary;
