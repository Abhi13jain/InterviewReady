'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { auth } from '@/firebase/client';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { toast } from 'sonner';

export default function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await firebaseSignOut(auth);

            // Clear the session cookie by making a request to a sign-out endpoint
            await fetch('/api/auth/signout', {
                method: 'POST',
            });

            toast.success('Signed out successfully');
            router.push('/sign-up');
        } catch (error) {
            console.error('Sign out error:', error);
            toast.error('Failed to sign out');
        }
    };

    return (
        <Button
            onClick={handleSignOut}
            className="btn-secondary"
            variant="outline"
        >
            Sign Out
        </Button>
    );
}
