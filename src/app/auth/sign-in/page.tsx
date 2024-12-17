import { SignInForm } from "@/components/auth/sign-in-form";
import Link from "next/link";
import React from "react";

export default function SignInPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-primary">Sign in</h1>
        <p className="text-sm text-muted-foreground">
          Dont have an account?&nbsp;
          <Link
            href="sign-up"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Create now
          </Link>
        </p>
      </div>

      {/* Main */}
      <SignInForm />
    </div>
  );
}
