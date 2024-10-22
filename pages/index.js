import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function Home() {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await axios.get('/api/product');
      setProduct(res.data[0]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast({
        title: "Error",
        description: "Failed to fetch product. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value)));
  };

  const applyCoupon = async () => {
    try {
      const res = await axios.post('/api/coupon/validate', { code: couponCode });
      setDiscount(res.data.discount);
      toast({
        title: "Success",
        description: `Coupon applied! ${res.data.discount}% discount.`,
      });
    } catch (error) {
      console.error('Invalid coupon', error);
      toast({
        title: "Error",
        description: "Invalid or expired coupon",
        variant: "destructive",
      });
    }
  };

  const calculateShipping = () => {
    return product ? Math.ceil(product.weight * 0.5) : 0;
  };

  const calculateTotal = () => {
    if (!product) return 0;
    const subtotal = product.price * quantity;
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount + calculateShipping();
  };

  const handleCheckout = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    const stripe = await stripePromise;
    const total = calculateTotal();

    try {
      const response = await axios.post('/api/create-payment-intent', {
        amount: Math.round(total * 100),
      });

      const result = await stripe.confirmCardPayment(response.data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: session.user.name,
          },
        }
      });

      if (result.error) {
        toast({
          title: "Error",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          router.push('/confirmation');
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg shadow-lg" />
            </div>
            <div>
              <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
              <div className="mb-4">
                <label htmlFor="quantity" className="block mb-2 font-semibold">Quantity:</label>
                <Input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-20"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="coupon" className="block mb-2 font-semibold">Coupon Code:</label>
                <div className="flex">
                  <Input
                    type="text"
                    id="coupon"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow"
                  />
                  <Button onClick={applyCoupon} className="ml-2">
                    Apply
                  </Button>
                </div>
              </div>
              {discount > 0 && (
                <p className="mb-4 text-green-600 font-semibold">Discount applied: {discount}%</p>
              )}
              <p className="mb-4">Shipping: ${calculateShipping().toFixed(2)}</p>
              <p className="text-xl font-bold mb-4">
                Total: ${calculateTotal().toFixed(2)}
              </p>
              <Button onClick={handleCheckout} className="w-full">
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}