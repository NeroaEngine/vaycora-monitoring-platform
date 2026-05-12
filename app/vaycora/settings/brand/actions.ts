"use server";

import { redirect } from "next/navigation";
import { saveBrandSettings } from "@/lib/vaycora/repository";

function formString(formData: FormData, key: string, fallback: string) {
  const value = formData.get(key);
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

export async function saveBrandSettingsAction(formData: FormData) {
  await saveBrandSettings({
    tenantId: "tenant_demo",
    companyName: formString(formData, "companyName", "Vaycora Demo Operations"),
    shortName: formString(formData, "shortName", "Vaycora"),
    portalType: formString(formData, "portalType", "rental"),
    primaryColor: formString(formData, "primaryColor", "#123c2b"),
    accentColor: formString(formData, "accentColor", "#e96f12"),
    backgroundMode: formString(formData, "backgroundMode", "dark"),
    dashboardStyle: formString(formData, "dashboardStyle", "operations"),
    logoUrl: formString(formData, "logoUrl", ""),
  });

  redirect("/vaycora/settings/brand?saved=1");
}
