"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaGoogle, FaFacebook } from "react-icons/fa";
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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import loginImg from "@/public/loginImg.png";

// Update the schema to include phone and password validations
const formSchema = z.object({
  phone: z
    .string()
    .min(1, { message: "Phone number is required." })
    .regex(/^01[3-9]\d{8}$/, { message: "Please enter a valid phone number." }),
  password: z
    .string()
    .min(1, { message: "Password is required." })
    .min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const [error, setError] = useState(null);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  const { status } = useSession();
  const router = useRouter();

  // Handle form submission for credentials (phone and password)
  const onSubmit = async (data) => {
    try {
      const signInData = await signIn("credentials", {
        phone: data.phone,
        password: data.password,
        redirect: false, // Prevent auto-redirect
      });

      if (signInData?.error) {
        toast.error("Invalid phone or password. Please try again!");
      } else if (signInData?.ok) {
        toast.success("Login Successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleGoogleLogin = async () => {
    const signInResult = await signIn("google", { redirect: false });
  
    if (signInResult?.error) {
      if (signInResult.error === 'OAuthAccountNotLinked') {
        // Call a function to handle account linking
        handleAccountLinking(signInResult);
      } else {
        console.error("Google sign-in error:", signInResult.error);
        toast.error("Something went wrong during Google login. Please try again.");
      }
    } else if (signInResult?.ok) {
      toast.success("Login Successful!");
      router.push("/dashboard");
    }
  };
  
  const handleAccountLinking = async (signInResult) => {
    const email = signInResult.user.email; // Get the email from the sign-in result
    
    // Check if the email exists in your database
    const user = await checkIfUserExists(email); // Implement this function to query your database
    
    if (user) {
      // Link the accounts in your database
      await linkGoogleAccountToUser(user.id, signInResult); // Implement this function to handle linking
      toast.success("Account linked successfully. Logging you in...");
      router.push("/dashboard"); // Redirect to the dashboard
    } else {
      // Prompt user to create a new account
      toast.error("This Google account is not linked to any existing account. Please sign up.");
      // Optionally, redirect them to a sign-up page
    }
  };
  
  
  

  // Handle Google and Facebook OAuth sign-in
  const handleOAuthSignIn = async (provider) => {
    try {
      const result = await signIn(provider, { redirect: false });
      if (result?.error) {
        toast.error(`Failed to sign in with ${provider}. Please try again.`);
      } else {
        toast.success("Login Successful!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // useEffect(() => {
  //   if (status === "authenticated") {
  //     router.push("/dashboard");
  //   }
  // }, [status, router]);

  return (
    <div className="bg-gray-50 h-screen flex items-center justify-center">
      <div className="flex w-4/5 max-w-7xl items-center justify-center">
        {/* Image Section */}
        <div className="hidden md:block lg:w-3/5 h-[95vh] w-1/2">
          <Image
            src={loginImg}
            alt="loginImg"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Login Form Section */}
        <div className="lg:px-6 lg:py-10 p-5 bg-white shadow-lg w-full sm:w-1/2 lg:w-2/5 h-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 lg:mb-4 text-center">
            Login
          </h1>
          <p className="text-sm lg:text-base text-gray-900 text-center mb-2 lg:mb-4">
            Don&apos;t have an account yet?{" "}
            <Link
              href="/register"
              className="font-semibold text-lime-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="lg:space-y-6 space-y-3"
            >
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        type="phone"
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

              <Button
                type="submit"
                className="w-full bg-lime-700 hover:bg-lime-800 text-white font-semibold py-3 text-sm lg:text-lg rounded-md"
              >
                Login
              </Button>
            </form>
          </Form>

          <div className="flex items-center justify-between my-4">
            <hr className="border-t border-gray-300 flex-grow mx-2" />
            <span className="text-xs lg:text-sm text-gray-500">
              Or Sign In With
            </span>
            <hr className="border-t border-gray-300 flex-grow mx-2" />
          </div>

          {/* OAuth Buttons */}
          <div className="flex items-center justify-between gap-3 lg:gap-6 xl:gap-10">
            <Button
              type="button"
              onClick={() => handleGoogleLogin()}
              className="flex items-center justify-center w-full bg-gray-50 hover:bg-red-600 border-2 border-red-500 px-3 text-black hover:text-white font-semibold py-5 text-sm lg:text-lg rounded-md"
            >
              <FaGoogle className="mr-3" /> Google
            </Button>

            <Button
              type="button"
              onClick={() => handleOAuthSignIn("facebook")}
              className="flex items-center justify-center w-full bg-gray-50 hover:bg-blue-700 border-2 border-blue-500 px-3 text-black hover:text-white font-semibold py-5 text-sm lg:text-lg rounded-md"
            >
              <FaFacebook className="mr-3" /> Facebook
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
