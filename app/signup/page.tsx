"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/lib/supabase";

// Define a proper error type instead of using any
type AuthError = {
  message: string;
  [key: string]: unknown;
};

export default function SignupPage() {
  // Redirect to home page immediately
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
  return null;
} 