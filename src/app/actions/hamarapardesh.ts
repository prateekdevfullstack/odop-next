"use server";

import { fetchHamaraPradeshDetailByid } from "@/services/hamara-pradesh.service";
import { decrypt128 } from "@/lib/api";

export async function getHamaraPradeshVideoIntro(id: number | string) {
  try {
    const response = await fetchHamaraPradeshDetailByid(id);

    let data: any;

    if ((response.data as any)?.body && typeof (response.data as any).body === "string") {
      const decryptedData = await decrypt128((response.data as any).body);
      data = typeof decryptedData === "string" ? JSON.parse(decryptedData) : decryptedData;
    } else {
      data = response.data;
    }
    return { success: true, data: data?.data || data };
  } catch (error) {
    console.error("Error in getHamaraPradeshVideoIntro:", error);
    return { success: false, error: "Failed to fetch industrial detail" };
  }
}