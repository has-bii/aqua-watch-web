import { SignUpForm } from "@/components/auth/sign-up-form";
import Link from "next/link";
import React from "react";

export default function SignUpPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-primary">Create Account</h1>
        <p className="text-sm text-muted-foreground">
          Already have an account?&nbsp;
          <Link
            href="sign-in"
            className="font-semibold text-primary underline underline-offset-2"
          >
            Sign in
          </Link>
        </p>
      </div>

      {/* Main */}
      <SignUpForm />
    </div>
  );
}
