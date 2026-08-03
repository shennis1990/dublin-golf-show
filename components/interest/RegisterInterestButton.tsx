"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useInterestModal } from "@/components/interest/InterestModalProvider";

type RegisterInterestButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "ghost";
  size?: "default" | "sm";
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "type">;

export function RegisterInterestButton({
  children = "Get Ticket Updates",
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: RegisterInterestButtonProps) {
  const { openInterestModal } = useInterestModal();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={openInterestModal}
      {...props}
    >
      {children}
    </Button>
  );
}
