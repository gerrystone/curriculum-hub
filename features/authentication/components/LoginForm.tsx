import {useForm} from "react-hook-form";
import {LoginFormValues, loginSchema} from "@/features/authentication/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {useLogin} from "@/features/authentication/services/hooks/useLogin";

export default function LoginForm(){
    const {register, handleSubmit, formState: { errors, isSubmitting },} = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const loginMutation = useLogin()

    const onSubmit = async (values: LoginFormValues) => {

    };
    return (

    )
}