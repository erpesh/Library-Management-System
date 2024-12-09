import { inventoryApi } from "@/app/api/settings"
import ClientPage from "./client-page"
import { getCurrentUser } from "@/lib/auth";


// Fetch media item by ID
async function getMedia(id: string) {
    try {
      const user = await getCurrentUser();

      const url = user ? `/${id}?userId=${user?.id}` : `/${id}`;

      const response = await inventoryApi.get(url);
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