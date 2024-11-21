import axios from "axios";

export const inventoryApi = axios.create({
    baseURL: process.env.NEXT_PUBLIC_INVENTORY_SERVICE_URL,
});