import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin } from "lucide-react";

export default function Welcome() {
  return (
    <div className="justify-center flex flex-col items-center m-12">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center p-4 font-bold">
            Welcome to My GIS App
          </CardTitle>
          <CardDescription className="p-4 text-center text-lg">
            Here you can create your account first and then you can explore the
            world!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <MapPin size={250} color="#ea5353" strokeWidth={1.5} />
        </CardContent>
      </Card>

      <div className="flex flex-row justify-between w-[450px] m-4">
        <Button className="p-6 text-lg" asChild>
          <Link href="/register">Register</Link>
        </Button>
        <Button className="p-6 text-lg" asChild>
          <Link href="/login">Login</Link>
        </Button>
      </div>
    </div>
  );
}
