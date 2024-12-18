import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import AddMediaForm from "./add-media-form";

export default async function Page() {
  const user = await getCurrentUser();

  if (user?.role !== "admin") {
    redirect("/signin");
  }

  return (
    <AddMediaForm/>
  )
}