"use client"
import { useState } from 'react';
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
import Login from '@/services/Login';
import { useToast } from '@/components/ui/use-toast';
import { ToastAction } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast()
  const router = useRouter();
  const handleShowToast = () => {
    toast({
      variant: 'destructive',
      title: "Uh oh! Something went wrong.",
      description: "There was a problem with your credentials.",
      action: <ToastAction altText="Try again">Try again</ToastAction>,
    });
  };

  const handleLogin = async (e:any) => {
    e.preventDefault();
    const user = await Login(email, password);
    if(user?.password){
        localStorage.setItem("email", email);
        localStorage.setItem("pass", password);
        router.push('/home');
    }
    else{
        console.log("error");
        handleShowToast();
    }
  };

  return (
    <>
    <Card className="w-full max-w-sm">
      <form onSubmit={handleLogin}>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
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
          <Button className="w-full" type="submit">Sign in</Button>
        </CardFooter>
      </form>
    </Card>
    </>
  );
}
