'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Global error:', error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <h2 className="text-2xl font-semibold text-destructive-100">Something went wrong!</h2>
            <p className="text-light-100 text-center max-w-md">
                We encountered an unexpected error. Please try again.
            </p>
            <Button onClick={reset} className="btn-primary">
                Try again
            </Button>
        </div>
    );
}
