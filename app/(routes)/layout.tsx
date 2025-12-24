import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";

export default async function RoutesLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
