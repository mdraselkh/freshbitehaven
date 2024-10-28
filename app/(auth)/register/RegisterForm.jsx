"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";
import signInImg from "@/public/signInImg.png";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";

// Validation schema for the form
const formSchema = z
  .object({
    fullname: z
      .string()
      .min(1, { message: "Full Name is required." })
      .min(3, { message: "Full Name must be at least 3 characters." }),
    phone: z
      .string()
      .min(1, { message: "Phone number is required." })
      .regex(/^01[3-9]\d{8}$/, {
        message: "Please enter a valid phone number.",
      }),
    password: z
      .string()
      .min(1, { message: "Password is required." })
      .min(6, { message: "Password must be at least 6 characters." }),
    confirm_pass: z
      .string()
      .min(1, { message: "Confirm Password is required." })
      .min(6, { message: "Confirm Password must be at least 6 characters." }),
  })
  .superRefine((values, ctx) => {
    if (values.confirm_pass !== values.password) {
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match.",
        path: ["confirm_pass"],
      });
    }
  });

export function RegisterForm() {
  const router = useRouter();

  // Initialize form using react-hook-form and zod resolver
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      phone: "",
      password: "",
      confirm_pass: "",
    },
  });

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values), // Directly using values
      });

      if (response.ok) {
        router.push("/login");
        toast.success("Registration completed successfully");
      } else {
        toast.error("Registration Failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="flex w-4/5 max-w-7xl items-center justify-center">

        {/* Registration Form Section */}
        <div className="lg:px-6 lg:py-10 p-5 bg-white shadow-lg w-full sm:w-1/2 lg:w-2/5 h-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 lg:mb-4 text-center">Sign Up</h1>
          <p className="text-sm md:text-base text-gray-900 text-center mb-2 lg:mb-4">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-lime-700 hover:underline">Log In</Link>
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="lg:space-y-6 space-y-3">
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        {...field}
                        className="w-full p-4 border border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your phone number"
                        {...field}
                        className="w-full p-4 border border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        className="w-full p-4 border border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirm_pass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Re-enter your password"
                        {...field}
                        className="w-full p-4 border border-gray-300 rounded-md"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 text-sm lg:text-lg rounded-md"
              >
                Register
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-between my-4">
            <hr className="border-t border-gray-300 flex-grow mx-2" />
            <span className="text-xs lg:text-sm text-gray-500">Or Sign Up With</span>
            <hr className="border-t border-gray-300 flex-grow mx-2" />
          </div>
          <div className="flex items-center justify-between gap-3 lg:gap-6 xl:gap-10">
            <Button
              type="button"
              onClick={() => signIn("google")}
              className="flex items-center justify-center w-full bg-gray-50 hover:bg-red-600 border-2 border-red-500 px-3 text-black hover:text-white font-semibold py-5 text-sm lg:text-lg rounded-md"
            >
              <FaGoogle className="mr-3" /> Google
            </Button>

            <Button
              type="button"
              onClick={() => signIn("facebook")}
              className="flex items-center justify-center w-full bg-gray-50 hover:bg-blue-700 border-2 border-blue-500 px-3 text-black hover:text-white font-semibold py-5 text-sm lg:text-lg rounded-md"
            >
              <FaFacebook className="mr-3" /> Facebook
            </Button>
          </div>
        </div>

        {/* Image Section */}
        <div className="hidden md:block lg:w-3/5 w-1/2 h-[95vh]">
          <Image src={signInImg} alt="signInImg" className="w-full h-full object-fill" />
        </div>
      </div>
    </div>
  );
}
