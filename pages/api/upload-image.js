import { v2 as cloudinary } from 'cloudinary';
import { getSession } from 'next-auth/react';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Not authorized' });
  }

  const { image } = req.body;

  try {
    const uploadResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'ml_default',
    });

    res.status(200).json({ url: uploadResponse.secure_url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}