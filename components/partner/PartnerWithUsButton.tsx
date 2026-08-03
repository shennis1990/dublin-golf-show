"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { usePartnerModal } from "@/components/partner/PartnerModalProvider";

type PartnerWithUsButtonProps = {
  children?: ReactNode;
  variant?: "primary" | "ghost";
  size?: "default" | "sm";
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick" | "type">;

export function PartnerWithUsButton({
  children = "Exhibit at The Dublin Golf Show",
  variant = "ghost",
  size = "default",
  className = "",
  ...props
}: PartnerWithUsButtonProps) {
  const { openPartnerModal } = usePartnerModal();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={className}
      onClick={openPartnerModal}
      {...props}
    >
      {children}
    </Button>
  );
}
