import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoginForm from "@/components/LoginForm";

export default function Login() {
  return (
    <div className="justify-center flex flex-col items-center m-12">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center p-4 font-bold">
            Login
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Here you can login your account!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center w-full">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
