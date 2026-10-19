import React from "react";

export interface LoginVariantProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  submitting: boolean;
  accessDeniedError: string | null;
  generalError: string | null;
  timeStr: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
