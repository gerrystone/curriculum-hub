import {useForm} from "react-hook-form";
import {LoginFormValues, loginSchema} from "@/features/authentication/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLogin} from "@/features/authentication/services/hooks/useLogin";
import {Button} from "@/app/components/Button";
import {toast} from "react-toastify";
import {useRouter} from "next/navigation";
import {accessTokenStorage} from "@/features/authentication/utils/access-token";

export default function LoginForm(){
    const {register, handleSubmit, formState: { errors, isSubmitting }, reset} = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const router = useRouter();

    const loginMutation = useLogin()


    const onSubmit = async (values: LoginFormValues) => {
        loginMutation.mutate(values,{
            onSuccess:(response)=>{
                console.log(response)
                toast.success("Login successful")
                accessTokenStorage.set(response.accessToken);
                reset()
                if (response.role === "curriculum_lead"){
                    router.push("/lead/dashboard")
                } else if (response.role === "teacher") {
                    router.push("/teacher/dashboard")
                } else {
                    router.push("/unauthorized")
                }
            },
            onError:(error)=>{
                toast.error(error.message ? error.message : "An error occurred!")
            }
        })
    };
    const inputBase =
        "w-full rounded-lg border bg-white px-3.5 py-2.5 text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-700 focus:border-teal-700";
    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate className={"space-y-4 mt-4"}>
            <div>
                <label htmlFor="email" >Email</label>

                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    placeholder="you@company.com"
                    {...register("email")}
                    aria-invalid={!!errors.email}
                    aria-describedby={
                        errors.email ? "email-error" : undefined
                    }
                    className={inputBase}
                />

                {errors.email && (
                    <p id="email-error" role="alert">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <label htmlFor="password">Password</label>

                <input
                    id="password"
                    className={inputBase}
                    type="password"
                    autoComplete="current-password"
                    {...register("password")}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                        errors.password ? "password-error" : undefined
                    }
                />

                {errors.password && (
                    <p id="password-error" role="alert">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {loginMutation.isError && (
                <p role="alert">
                    {loginMutation.error.message}
                </p>
            )}

            <Button
                type="submit"
                isLoading={isSubmitting || loginMutation.isPending}
                loadingText="Signing in..."
            >
                Sign in
            </Button>
        </form>
    )
}