import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NavBar from "@/components/layout/NavBar";

export default async function RoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return redirect("/");
  }
  return (
    <div className="h-full w-full">
      <NavBar />
      {children}
    </div>
  );
}