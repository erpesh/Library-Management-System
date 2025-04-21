import { inventoryApi } from "@/app/api/settings"
import ClientPage from "./client-page"
import { getCurrentUser } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";


// Fetch media item by ID
async function getMedia(id: string) {
    try {
      const user = await getCurrentUser();
      const cookiesList = await cookies();

      const url = user ? `/${id}?userId=${user?.id}` : `/${id}`;
      const token = await getToken({
        req: { cookies: cookiesList },
        secret: process.env.NEXTAUTH_SECRET,
        raw: true,
      });

      console.log("Token in getMedia:", token);

      const response = await inventoryApi.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    catch (e) {
      console.error(e)
    }
  }

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const user = await getCurrentUser();
  const mediaItem = await getMedia(id);
  
  return (
    <ClientPage media={mediaItem} userRole={user?.role}/>
  )
}