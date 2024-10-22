import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Confirmation() {
  const router = useRouter();

  useEffect(() => {
    // You might want to clear the cart or perform other post-purchase actions here
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Order Confirmation</CardTitle>
          <CardDescription>Thank you for your purchase!</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Your order has been successfully placed and is being processed.</p>
          <p className="mb-4">You will receive an email confirmation shortly.</p>
          <Button onClick={() => router.push('/')}>
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}