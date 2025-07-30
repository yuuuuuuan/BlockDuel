import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <h1 className="text-6xl font-extrabold tracking-tight mb-4">404</h1>
      <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </p>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}