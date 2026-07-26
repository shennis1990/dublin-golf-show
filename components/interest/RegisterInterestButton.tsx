"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useInterestModal } from "@/components/interest/InterestModalProvider";

type RegisterInterestButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "type">;

export function RegisterInterestButton({
  children = "Register Interest",
  variant = "primary",
  className = "",
  ...props
}: RegisterInterestButtonProps) {
  const { openInterestModal } = useInterestModal();

  return (
    <Button
      type="button"
      variant={variant}
      className={className}
      onClick={openInterestModal}
      {...props}
    >
      {children}
    </Button>
  );
}
