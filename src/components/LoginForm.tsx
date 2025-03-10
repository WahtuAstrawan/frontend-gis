"use client";

import { loginFormSchema } from "@/lib/form-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { apiClient } from "@/lib/utils";
import { UserResponse } from "@/lib/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    try {
      const response: UserResponse = await login(values);

      console.log("Login success:", response);
      Cookies.set("token", response.data.data.token ?? "error", { expires: 1 });
      router.push("/home");
    } catch (error: any) {
      console.error(error);
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        toast.error(error.response.data.errors?.message || "Invalid request");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  async function login(
    values: z.infer<typeof loginFormSchema>
  ): Promise<UserResponse> {
    try {
      const result = await apiClient.post("/users/login", values);
      return result;
    } catch (error: any) {
      throw error;
    }
  }

  useEffect(() => {
    Cookies.remove("token");
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 flex flex-col"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Username" {...field} />
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
                <div className="relative">
                  <FormControl>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <button
                    type="button"
                    className="absolute right-3 top-2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="text-md p-5 w-full">
            Login
          </Button>
        </form>
      </Form>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
