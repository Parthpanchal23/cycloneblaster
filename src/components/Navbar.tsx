"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";
import { User } from "next-auth";
import { Button } from "./ui/button";
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    <nav className="p-4 md:p-6 shadow-md">
      <div className="container mx-auto flex flex-xol md:flex-roe justify-between items-center">
        <a href="#">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-2xl ">
            Cyclonblaster
          </h1>
        </a>

        {session ? (
          <>
            <span className="mr-4">
              welcome {user?.username || user?.email}
            </span>
            <Button
              className="w-full md:w-auto"
              onClick={() => {
                signOut();
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="w-full md:w-auto">
              <>
                <Button>Login</Button>
              </>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
