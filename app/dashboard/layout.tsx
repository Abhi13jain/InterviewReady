import Link from 'next/link'
import { ReactNode } from 'react'
import Image from 'next/image'
import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import SignOutButton from '@/components/SignOutButton';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect('/sign-up');

    return (
        <div className="root-layout">
            <nav className="flex justify-between items-center">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/logo.svg"
                        alt="Interview Ready Logo"
                        width={38}
                        height={32}
                        sizes="38px"
                        priority
                    />
                    <h2 className="text-primary-100">Interview Ready</h2>
                </Link>
                <SignOutButton />
            </nav>
            {children}
        </div>
    )
}

export default DashboardLayout
