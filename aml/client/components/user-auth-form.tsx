"use client"

import * as React from "react"
import { signIn } from "next-auth/react"
import { z } from "zod"
import { toast } from 'sonner'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Github, Loader2 } from 'lucide-react'

const emailSchema = z.string().email("Please enter a valid email address")

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isEmailLoading, setIsEmailLoading] = React.useState<boolean>(false)
  const [isGithubLoading, setIsGithubLoading] = React.useState<boolean>(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState<boolean>(false)
  const [email, setEmail] = React.useState<string>("")
  const [emailError, setEmailError] = React.useState<string | null>(null)
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false)

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsEmailLoading(true)
    setEmailError(null)

    try {
      emailSchema.parse(email)
      await signIn("email", { 
        email, 
        callbackUrl: "/",
        isAdmin: isAdmin ? "true" : "false" // Pass the admin flag
      })
      toast.success('Verification email sent', {
        description: 'Please check your inbox to verify your email.',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setEmailError(error.errors[0].message)
      } else {
        console.error("Error:", error)
        toast.error('An error occurred', {
          description: 'Please try again.',
        })
      }
    } finally {
      setIsEmailLoading(false)
    }
  }

  // ... (rest of the component remains unchanged)

  return (
    <div className={cn("grid gap-4", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isEmailLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
            />
            {emailError && (
              <p className="text-sm text-red-500" id="email-error">{emailError}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="admin" 
              checked={isAdmin} 
              onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            />
            <Label htmlFor="admin">Sign in as admin</Label>
          </div>
          <Button disabled={isEmailLoading}>
            {isEmailLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  )
}

