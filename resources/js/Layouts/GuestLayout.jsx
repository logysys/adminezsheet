import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/">
                        <ApplicationLogo className="mx-auto h-16 w-auto text-indigo-600" />
                    </Link>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your account
                    </p>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg ring-1 ring-black ring-opacity-5">
                    {children}
                </div>
                
            </div>
        </div>
    );
}