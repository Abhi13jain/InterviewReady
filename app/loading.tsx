import LoadingSpinner from '@/components/LoadingSpinner';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4">
                <LoadingSpinner size="lg" />
                <p className="text-light-100">Loading...</p>
            </div>
        </div>
    );
}
