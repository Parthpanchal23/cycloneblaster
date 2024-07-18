"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message, User } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { APIResponse } from "@/types/ApiResonse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const Dashboardpage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();
  const handleDeleteMessage = (messagesId: string) => {
    setMessages(messages.filter((message) => message._id !== messagesId));
  };
  const { data: session } = useSession();
  const form = useForm({ resolver: zodResolver(acceptMessageSchema) });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<APIResponse>("/api/accept-messages");
      setValue("acceptMessages", response?.data?.isaAcceptingMessage);
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error ",
        description:
          axiosError.response?.data?.message ||
          "Failed to fetch  message settings",
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const respose = await axios.get<APIResponse>("/api/get-messages");
        setMessages(respose.data.messages || []);
        if (refresh) {
          toast({
            title: "Refresh Messages",
            description: "Showing letteest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<APIResponse>;
        toast({
          title: "Error ",
          description:
            axiosError.response?.data?.message ||
            "Failed to fetch  message settings",
          variant: "destructive",
        });
      } finally {
        setIsSwitchLoading(false);
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages();
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  // handle switch Change

  const handleSwitchChange = async () => {
    try {
      const resonse = await axios.post<APIResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast({ title: resonse?.data?.message, variant: "default" });
    } catch (error) {
      const axiosError = error as AxiosError<APIResponse>;
      toast({
        title: "Error ",
        description:
          axiosError.response?.data?.message ||
          "Failed to fetch  message settings",
        variant: "destructive",
      });
    }
  };
  const { username } = session?.user as User;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url coppied",
      description: "Profile Url has been coppied to clip board",
    });
  };
  // if (!session || !session.user) {
  //   return <>Please Login</>;
  // }
  return (
    <div className="text-center">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
        Welcome to Cyclone Dutt
      </h1>
      <p className="mb-4 text-slate-500">Sign In to Enjoy adventure</p>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard} className="mb-4">
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages :{acceptMessages ? "on" : "off"}
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="=h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message?._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p> no message display</p>
        )}
      </div>
    </div>
  );
};

export default Dashboardpage;
