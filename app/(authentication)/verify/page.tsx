"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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

const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "Code must be 6 digits")
    .regex(/^[0-9]+$/, "Only numbers allowed"),
});

type VerificationValues = z.infer<typeof verificationSchema>;

const VerifyCode = () => {
  const form = useForm<VerificationValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (data: VerificationValues) => {
    console.log("Verification code submitted:", data);
    // Call your backend verify API here
  };

  return (
    <Card className="w-[400px] mb-8 rounded-lg border-0 sm:border shadow-none">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-medium">Enter Verification Code</h2>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <p className="text-sm text-gray-600">
          We sent a 6-digit verification code to your email.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            {/* Verification Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={6}
                      placeholder="123456"
                      {...field}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, "");
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full mt-2 rounded-full bg-amber-600 hover:bg-amber-700"
              type="submit"
            >
              Verify
            </Button>
          </form>
        </Form>

        <p className="text-sm text-gray-600">
          Didn’t get the code?{" "}
          <button className="text-blue-600 hover:underline" type="button">
            Resend
          </button>
        </p>
      </CardContent>

      <CardFooter>
        <div className="grid border-t pt-4 w-full gap-2">
          <Link href="/sign-in" className="text-sm text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};

export default VerifyCode;
