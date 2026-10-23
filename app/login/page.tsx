"use client";

import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import {useRouter} from "next/router";

type FieldErrors = { email?: string; password?: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [remember, setRemember] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [formError, setFormError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    function validate(): FieldErrors {
        const next: FieldErrors = {};
        const value = email.trim();
        if (!value) next.email = "Enter your email address.";
        else if (!EMAIL_RE.test(value)) next.email = "Enter a valid email, like name@company.com.";
        if (!password) next.password = "Enter your password.";
        return next;
    }

    async function onSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setFormError(null);

        const next = validate();
        setErrors(next);
        if (next.email) return emailRef.current?.focus();
        if (next.password) return passwordRef.current?.focus();

        setLoading(true);
        try {

            const res = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
             body: JSON.stringify({ email: email.trim(), password, remember }),
            });
             if (!res.ok) throw new Error("invalid");
            console.log(res, "response")
            await new Promise((r) => setTimeout(r, 900));
            throw new Error("invalid");
        } catch {
            setFormError(
                "That email and password don’t match. Check both and try again, or reset your password."
            );
        } finally {
            setLoading(false);
        }
    }

    const inputBase =
        "w-full rounded-lg border bg-field px-3.5 py-2.5 text-base placeholder:text-mute/70 focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand";

    return (
        <div className="min-h-full grid lg:grid-cols-2">
            <main className="flex items-center justify-center px-6 py-12 sm:px-12">
                <div className="w-full max-w-sm">
                    <div className="flex items-center gap-2 mb-10">
                        <span className="inline-block h-6 w-6 rounded-md bg-brand" />
                        <span className="font-display font-bold text-lg tracking-tight">Northbeam</span>
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight">
                        Sign in to your workspace
                    </h1>
                    <p className="mt-2 text-mute">Use the email you signed up with.</p>

                    {formError && (
                        <div
                            role="alert"
                            className="mt-6 rounded-lg border border-danger px-4 py-3 text-sm text-danger"
                        >
                            {formError}
                        </div>
                    )}

                    <form onSubmit={onSubmit} noValidate className="mt-8 space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-1.5">
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
                                className={`${inputBase} ${errors.email ? "border-danger" : "border-line"}`}
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-1.5 text-sm text-danger">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium">
                                    Password
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-mute underline underline-offset-4 hover:text-ink rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
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
                                    className={`${inputBase} pr-16 ${errors.password ? "border-danger" : "border-line"}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    aria-controls="password"
                                    aria-pressed={showPassword}
                                    className="absolute inset-y-0 right-0 px-3.5 text-sm font-medium text-mute hover:text-ink rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                                >
                                    {showPassword ? "Hide" : "Show"}
                                </button>
                            </div>
                            {errors.password && (
                                <p id="password-error" className="mt-1.5 text-sm text-danger">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <label className="flex items-center gap-2.5 text-sm select-none cursor-pointer">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={remember}
                                onChange={(e) => setRemember(e.target.checked)}
                                className="h-4 w-4 rounded border-line accent-[var(--brand)]"
                            />
                            Keep me signed in on this device
                        </label>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-brand text-onbrand font-semibold py-3 transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <p className="mt-8 text-sm text-mute">
                        New to Northbeam?{" "}
                        <Link
                            href="/signup"
                            className="text-ink font-medium underline underline-offset-4 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </main>

            <aside className="hidden lg:flex flex-col justify-end p-14 bg-panel">
                <p className="font-display text-4xl font-semibold leading-tight tracking-tight max-w-md text-[#eaf3ef]">
                    Every roadmap decision, with the evidence next to it.
                </p>
                <p className="mt-4 max-w-sm text-base text-[#b9cfc8]">
                    Pick up where your team left off: priorities, feedback, and launch plans in one place.
                </p>
            </aside>
        </div>
    );
}