import { inventoryApi } from "@/app/api/settings"
import ClientPage from "./client-page"


// Fetch media item by ID
async function getMedia(id: string) {
    try {
      const response = await inventoryApi.get(`/${id}`);
      return response.data;
    }
    catch (e) {
      console.error(e)
    }
  }

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params;

  const mediaItem = await getMedia(id);
  
  return (
    <ClientPage media={mediaItem}/>
  )
}