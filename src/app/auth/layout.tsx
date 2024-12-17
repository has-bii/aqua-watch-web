import AuthSlider from "@/components/auth/auth-slider";
import Logo from "@/components/logo";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: Props) {
  return (
    <div className="grid h-screen w-screen lg:grid-cols-2">
      <div className="relative mx-auto flex h-full w-full px-12 lg:max-w-[32rem]">
        <div className="absolute top-10">
          <Logo />
        </div>
        <div className="my-auto w-full">{children}</div>
      </div>
      <div className="hidden w-full items-center justify-center bg-primary lg:flex">
        <AuthSlider />
      </div>
    </div>
  );
}
