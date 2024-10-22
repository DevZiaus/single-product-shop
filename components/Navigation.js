import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from "@/components/ui/button"

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Single Product Shop
        </Link>
        <div>
          {session ? (
            <>
              <span className="mr-4">Welcome, {session.user.name}</span>
              <Link href="/orders" className="mr-4 hover:text-gray-300">
                <Button variant="ghost">Orders</Button>
              </Link>
              {session.user.role === 'admin' && (
                <Link href="/admin/product" className="mr-4 hover:text-gray-300">
                  <Button variant="ghost">Manage Product</Button>
                </Link>
              )}
              <Button variant="ghost" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/auth/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}