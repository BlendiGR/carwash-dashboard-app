"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { loginSchema } from "@/schemas/loginSchema"
import { FormField } from "./form"
import { Input } from "./input"
import { Button } from "./button"
import { Mail, Key } from "lucide-react"

export function LoginForm() {
    const { register, handleSubmit } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = (data: z.infer<typeof loginSchema>) => {
        console.log(data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} aria-label="Login Form" className="flex flex-col gap-4 w-full">
            <FormField label="Email" aria-label="Email">
                <Input 
                   type="email" 
                   placeholder="Email" 
                   startIcon={<Mail className="size-4 text-gray-400" />}
                   {...register("email")} 
                />
            </FormField>
            <FormField label="Password" aria-label="Password">
                <Input 
                   type="password" 
                   placeholder="Password" 
                   startIcon={<Key className="size-4 text-gray-400" />}
                   {...register("password")} 
                />
            </FormField>
            <Button type="submit" size="lg">Login</Button>
        </form>
    )
}

