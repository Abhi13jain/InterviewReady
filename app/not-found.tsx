import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h2 className="text-2xl font-semibold text-primary-100">404 - Page Not Found</h2>
            <p className="text-light-100 text-center max-w-md">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild className="btn-primary">
                <Link href="/">Go Home</Link>
            </Button>
        </div>
    );
}
