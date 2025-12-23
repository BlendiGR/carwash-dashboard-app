"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { loginSchema, LoginData } from "@/schemas/loginSchema"
import { login } from "@/app/actions/auth"
import { FormField } from "./form"
import { Input } from "./input"
import { Button } from "./button"
import { Mail, Key } from "lucide-react"

export function LoginForm() {
    const t = useTranslations('Login')
    const [authError, setAuthError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginData) => {
        setAuthError(null)
        setIsLoading(true)

        try {
            const result = await login(data.email, data.password)
            
            if (result?.error) {
                setAuthError(result.error)
            }
        } catch {
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} aria-label="Login Form" className="flex flex-col gap-4 w-full">
            {authError && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                    {authError}
                </div>
            )}
            <FormField label={t('email')} error={errors.email?.message}>
                <Input 
                   type="email" 
                   placeholder={t('email')} 
                   startIcon={<Mail className="size-4 text-gray-400" />}
                   {...register("email")} 
                />
            </FormField>
            <FormField label={t('password')} error={errors.password?.message}>
                <Input 
                   type="password" 
                   placeholder={t('password')} 
                   startIcon={<Key className="size-4 text-gray-400" />}
                   {...register("password")} 
                />
            </FormField>
            <Button type="submit" size="lg" disabled={isLoading}>
                {isLoading ? t('loading') : t('submit')}
            </Button>
        </form>
    )
}

