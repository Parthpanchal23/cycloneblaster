"use client";
// import { useSession, signIn, signOut } from "next-auth/react";
// export default function Component() {
//   const { data: session } = useSession();
//   if (session) {
//     return (
//       <>
//         Signed in as {session?.user?.email} <br />
//         <button onClick={() => signOut()}>Sign out</button>
//       </>
//     );
//   }
//   return (
//     <div
//       style={{
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         height: "100vh",
//       }}
//     >
//       Not signed in <br />
//       <button
//         className="bg-orange-500 rounded-md p-1 m-2"
//         onClick={() => signIn()}
//       >
//         Sign in
//       </button>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { APIResponse } from "@/types/ApiResonse";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [username, setUserName] = useState("");
  const [usernameMessage, setUserNameMessage] = useState("");
  const [isChecingUserName, setIsChecingUserName] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUserName, 500);
  //   const debouncedUserName = useDebounceValue(username, 500);

  const { toast } = useToast();
  const router = useRouter();

  // Zod implementation
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //   useEffect(() => {
  //     const checkUsernameUnique = async () => {
  //       if (username) {
  //         setIsChecingUserName(true);
  //         setUserNameMessage("");
  //         try {
  //           let response = await axios.get(
  //             `/api/check-username-unique?username=${username}`
  //           );
  //           let message = response?.data.message;
  //           setUserNameMessage(message);
  //         } catch (error) {
  //           const AxiosError = error as AxiosError<APIResponse>;
  //           setUserNameMessage(
  //             AxiosError?.response?.data?.message || "Error checking user name"
  //           );
  //         } finally {
  //           setIsChecingUserName(false);
  //         }
  //       }
  //     };
  //     checkUsernameUnique();
  //   }, [username]);

  const onSubmit = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<APIResponse>("/api/sign-up", data);
      toast({ title: "Sucess", description: response?.data?.message });
      router.replace(`/verify/${username}`);
    } catch (error) {
      const AxiosError = error as AxiosError<APIResponse>;
      let errorMEssage = AxiosError?.respose?.data?.message;
      toast({
        title: "Signup Failed",
        description: errorMEssage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-greay-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Cyclone Dutt
          </h1>
          <p className="mb-4 text-slate-500">
            Sign up to start your anonymous adventure
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e?.target?.value);
                      }}
                    />
                  </FormControl>
                  {isChecingUserName && <Loader2 className="animate -spin" />}
                  <p
                    className={`text-sm ${
                      usernameMessage === "Username is unique"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {" "}
                    test {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="abc@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            already a member?
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
