import { getSession } from 'next-auth/react';
import Product from '../../../../models/Product';
import connectDB from '../../../../lib/connectDB';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Not authorized' });
  }

  await connectDB();

  const { id } = req.query;

  if (req.method === 'PUT') {
    try {
      const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'DELETE') {
    try {
      const product = await Product.findByIdAndDelete(id);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}