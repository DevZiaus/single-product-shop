import { getSession } from 'next-auth/react';
import Order from '../../../models/Order';
import connectDB from '../../../lib/connectDB';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const orders = await Order.find({ user: session.user.id }).populate('product');
      res.status(200).json(orders);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else if (req.method === 'POST') {
    try {
      const order = new Order({ ...req.body, user: session.user.id });
      await order.save();
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}