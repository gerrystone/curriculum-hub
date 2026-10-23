"use client";
import LoginForm from "@/features/authentication/components/LoginForm";

export default function LoginPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2 bg-white">
            <main className="flex items-center justify-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-sm">
                    <div className="mb-10 flex items-center gap-2">
                        <span className="inline-block h-6 w-6 rounded-md bg-teal-900" />
                        <span className="font-display text-lg font-bold tracking-tight">Curriculum Hub</span>
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight">
                        Sign in to your workspace
                    </h1>
                    <p className="mt-2 text-slate-600">Use the email you signed up with.</p>
                    <LoginForm/>
                </div>
            </main>

        </div>
    );
}