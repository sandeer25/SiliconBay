"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignInValues = z.infer<typeof signInSchema>;

const SignIn = () => {
  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: SignInValues) => {
    console.log("Form submitted:", data);
    // Add your API call here (login request)
  };

  return (
    <Card className="w-[400px] mb-8 rounded-lg border-0 sm:border shadow-none">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-medium">Sign in to your account</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full mt-2 rounded-full bg-amber-600 hover:bg-amber-700" type="submit">
              Sign In
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600">By signing in, you agree to SiliconBay's <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.</p>
      </CardContent>

      <CardFooter>
        <div className="grid border-t pt-4 w-full gap-2">
          <span className="font-bold text-sm">New to SiliconBay?</span>
          <Link href="/sign-up" className="text-sm text-blue-600 hover:underline">
            Create a free account
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignIn;
