
import Image from "next/image";
import { LoginForm } from "@/components/ui/LoginForm";

export default function Home() {
  return (
      <main className="flex min-h-screen items-center justify-center bg-brand-gradient w-full">
        <div className="flex flex-col items-center justify-center w-full gap-8">
          <Image
            src="/logo-opus.png"
            alt="opus logo"
            width={400}
            height={400}
            className="w-60 object-contain"
            priority
          />
    
          <div className="flex w-full max-w-md flex-col items-center justify-center relative gap-8 p-5 shadow-md border border-gray-200 rounded-2xl">
            <div className="flex w-full flex-col absolute top-0 left-0 items-center justify-center gap-2 rounded-t-2xl bg-primary-gradient p-6 text-white">
              <h1 className="text-2xl font-bold">Login</h1>
              <p className="text-sm text-white">Login to your account</p>
            </div>
            <div className="pt-30 w-full">
              <LoginForm />
            </div>
          </div>
        </div>
       
      
      </main>
  );
}
