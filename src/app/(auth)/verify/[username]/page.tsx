"use client";
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
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verifySchema";
import { APIResponse } from "@/types/ApiResonse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const VerifyAccountPage = () => {
  const router = useRouter();
  const param = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    alert(data);
    try {
      const response = await axios.post("/api/verify-code", {
        username: param.username,
        code: data.code,
      });
      toast({ title: "Sucess", description: response?.data?.message });
      router.replace(`/sign-in`);
    } catch (error) {
      const AxiosError = error as AxiosError<APIResponse>;
      let errorMEssage = AxiosError?.respose?.data?.message;
      toast({
        title: "Signup Failed",
        description: errorMEssage,
        variant: "destructive",
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-greay-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4 text-slate-500">
            enter the verification code sen to your email
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button type="submit">Submit</Button>
      </div>
    </div>
  );
};

export default VerifyAccountPage;
