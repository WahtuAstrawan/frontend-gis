import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "@/components/RegisterForm";

export default function Register() {
  return (
    <div className="justify-center flex flex-col items-center m-12">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle className="text-3xl text-center p-4 font-bold">
            Register
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Here you can register your account!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center w-full">
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
}
