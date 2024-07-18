"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRef } from "react";

export default function Home() {
  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into ther world of anonymous Conversations
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Expolore Mystry Message -where your identity remains a secret
          </p>
        </section>

        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <Carousel className="w-full " plugins={[plugin.current]}>
            <CarouselContent className="-ml-1">
              {messages.map((message, index) => (
                <CarouselItem
                  key={index}
                  className="pl-1 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card>
                      <CardHeader>{message.title}</CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6">
                        <span className="text-2xl font-semibold">
                          " {message.content} "
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </main>
      <footer className="text-center p-4 md:p-6">
        <p>@2024 Cyclonblaster all right reserved</p>
      </footer>
    </>
  );
}
