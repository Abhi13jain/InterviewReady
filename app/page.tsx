import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/actions/auth.action';

export default async function HomePage() {
    const user = await getCurrentUser();

    if (user) {
        redirect('/dashboard');
    } else {
        redirect('/sign-up');
    }
}
