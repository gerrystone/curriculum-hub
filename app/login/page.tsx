"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type FieldErrors = { email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
    const router = useRouter();
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});

  /*  const mutation = useMutation({
        mutationFn: login,
        onSuccess: (data) => {
            router.push(data.redirectTo ?? "/dashboard");
        },
    });*/

    function validate(): FieldErrors {
        const next: FieldErrors = {};
        const value = email.trim();
        if (!value) next.email = "Enter your email address.";
        else if (!EMAIL_RE.test(value)) next.email = "Enter a valid email, like name@company.com.";
        if (!password) next.password = "Enter your password.";
        return next;
    }

    function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
       /* mutation.reset();

        const next = validate();
        setErrors(next);
        if (next.email) return emailRef.current?.focus();
        if (next.password) return passwordRef.current?.focus();

        mutation.mutate({ email: email.trim(), password, remember });*/
    }

    /*const loading = mutation.isPending;*/

    const inputBase =
        "w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700";

    return (
        <div className="grid min-h-full lg:grid-cols-2">
            <main className="flex items-center justify-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-sm">
                    <div className="mb-10 flex items-center gap-2">
                        <span className="inline-block h-6 w-6 rounded-md bg-teal-900" />
                        <span className="font-display text-lg font-bold tracking-tight">Northbeam</span>
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight">
                        Sign in to your workspace
                    </h1>
                    <p className="mt-2 text-slate-600">Use the email you signed up with.</p>

                  {/*  {mutation.isError && (
                        <div
                            role="alert"
                            className="mt-6 rounded-lg border border-red-600 bg-red-50 px-4 py-3 text-sm text-red-700"
                        >
                            {mutation.error.message}
                        </div>
                    )}*/}

                    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                inputMode="email"
                                placeholder="you@company.com"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
                                }}
                                aria-invalid={!!errors.email}
                                aria-describedby={errors.email ? "email-error" : undefined}
                                className={`${inputBase} ${errors.email ? "border-red-600" : "border-slate-300"}`}
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-1.5 text-sm text-red-700">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="mb-1.5 flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="rounded text-sm text-slate-600 underline underline-offset-4 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <input
                                    ref={passwordRef}
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
                                    }}
                                    aria-invalid={!!errors.password}
                                    aria-describedby={errors.password ? "password-error" : undefined}
                                    className={`${inputBase} pr-16 ${errors.password ? "border-red-600" : "border-slate-300"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-controls="password"
                                    aria-pressed={showPassword}
                                    className="absolute inset-y-0 right-0 rounded-r-lg px-3.5 text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && (
                                <p id="password-error" className="mt-1.5 text-sm text-red-700">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <label className="flex cursor-pointer select-none items-center gap-2.5 text-sm">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 accent-teal-900"
                            />
                            Keep me signed in on this device
                        </label>
                        <button
                            type="submit"

                            className="w-full rounded-lg bg-teal-900 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                           Sign In
                        </button>
                        {/*<button
                            type="submit"
                            disabled={loading || mutation.isSuccess}
                            className="w-full rounded-lg bg-teal-900 py-3 font-semibold text-white transition hover:bg-teal-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>*/}
                    </form>


                </div>
            </main>

            <aside className="hidden flex-col justify-end bg-teal-900 p-14 lg:flex">
                <p className="max-w-md font-display text-4xl font-semibold leading-tight tracking-tight text-teal-50">
                    Every roadmap decision, with the evidence next to it.
                </p>
                <p className="mt-4 max-w-sm text-base text-teal-200">
                    Pick up where your team left off: priorities, feedback, and launch plans in one place.
                </p>
            </aside>
        </div>
    );
}