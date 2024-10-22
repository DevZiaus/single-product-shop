import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';

export default function AdminProduct() {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/auth/signin');
    } else {
      fetchProduct();
    }
  }, [session, status]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get('/api/product');
      setProduct(res.data[0]); // Assuming we're managing the first product
      setIsLoading(false);
    } catch (error) {
      setError('Error fetching product');
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (product._id) {
        await axios.put(`/api/admin/product/${product._id}`, product);
      } else {
        await axios.post('/api/admin/product', product);
      }
      alert('Product saved successfully');
    } catch (error) {
      setError('Error saving product');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      setProduct(prev => ({ ...prev, image: res.data.secure_url }));
    } catch (error) {
      setError('Error uploading image');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Manage Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-2">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product?.name || ''}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="description" className="block mb-2">Description:</label>
          <textarea
            id="description"
            name="description"
            value={product?.description || ''}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="price" className="block mb-2">Price:</label>
          <input
            type="number"
            id="price"
            name="price"
            value={product?.price || ''}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="weight" className="block mb-2">Weight (in kg):</label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={product?.weight || ''}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="image" className="block mb-2">Image:</label>
          <input
            type="file"
            id="image"
            onChange={handleImageUpload}
            className="w-full border rounded px-3 py-2"
          />
          {product?.image && (
            <img src={product.image} alt="Product" className="mt-2 w-32 h-32 object-cover" />
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Product
        </button>
      </form>
    </div>
  );
}
</boltArtifact>

This implementation covers all the requirements you specified:

1. Backend: Node.js, Express.js, and MongoDB
2. Frontend: Next.js and Tailwind CSS
3. Authentication: NextAuth.js with email/password and Google Sign-In
4. Admin functionality: Separate route for product management (upload, edit, delete)
5. Discount system with coupon codes
6. Price calculation based on quantity and weight, with shipping
7. Stripe payment integration
8. Cloudinary for image storage

To complete the setup:

1. Replace the placeholder values in the `.env` file with your actual credentials.
2. Set up your MongoDB database and connect it using the provided URI.
3. Configure your Google OAuth credentials for Google Sign-In.
4. Set up your Stripe account and add the necessary keys.
5. Create a Cloudinary account and add the credentials.

To run the project:

1. Start the backend server:
   ```
   npm run server
   ```

2. Start the Next.js development server:
   ```
   npm run dev
   ```

This setup provides a solid foundation for your single product online shop. You can access the admin page at `/admin/product` to manage the product details. The main product page is on the home route `/`.

To further enhance the project, you might want to:

1. Implement error handling and validation on both frontend and backend.
2. Add more robust security measures, especially for admin routes.
3. Implement order tracking and management.
4. Add email notifications for order updates.
5. Optimize the UI/UX for better user experience.
6. Implement SEO best practices.

Let me know if you need any clarification or have any questions about the im