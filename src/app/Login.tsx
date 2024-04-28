"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import logo from "../../public/logo.png";
import Image from "next/image";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const router = useRouter();
  const handleShowToast = () => {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your credentials.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("https://tbl-nodeserver.vercel.app/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const user = await response.json();
        localStorage.setItem("id", user._id);
        router.push("/home");
      } else {
        handleShowToast();
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <div className="flex items-center mb-8">
            <div className="w-16 rounded">
                <Image src={logo} alt={""} />
              </div>
              <div className="font-bold text-xl mt-4 ml-4 max-w-[150px]">
              <div className="text-xs font-light">
                <p>Welcome to</p>
              </div>
                <p>Trial Balance Ledger App</p>
              </div>
            </div>
            <CardTitle className="text-2xl">
              Login
            </CardTitle>
            <CardDescription>
              Enter your account below to login.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit">
              Sign in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  );
}
