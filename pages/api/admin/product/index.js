import { getSession } from 'next-auth/react';
import Product from '../../../../models/Product';
import connectDB from '../../../../lib/connectDB';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session || session.user.role !== 'admin') {
    return res.status(401).json({ error: 'Not authorized' });
  }

  await connectDB();

  if (req.method === 'POST') {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'GET') {
    try {
      const products = await Product.find({});
      res.status(200).json(products);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}