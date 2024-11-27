import { Metadata } from "next"
import Link from "next/link"
import { getCurrentUser } from "@/lib/auth"
import { UserAuthForm } from "@/components/user-auth-form"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
}

export default async function SignInPage() {
  const user = await getCurrentUser()

  if (user) {
    redirect('/')
  }

  return (
    <div className="h-page flex items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email below to sign in to your account
          </p>
        </div>
        <UserAuthForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

