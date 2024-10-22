import Coupon from '../../../models/Coupon';
import connectDB from '../../../lib/connectDB';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  await connectDB();

  const { code } = req.body;

  try {
    const coupon = await Coupon.findOne({ code, expiresAt: { $gt: new Date() } });
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }
    res.status(200).json({ discount: coupon.discount });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}