'use client'

import { LogIn, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function AuthButton() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => signOut()}
        name="Sign out"
      >
        <LogOut className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      asChild
      name="Sign in"
    >
      <Link href="/signin">
        <LogIn className="w-4 h-4" />
      </Link>
    </Button>
  )
}