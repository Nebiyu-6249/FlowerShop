"use client";
import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import { useI18n } from "@/lib/i18n/provider";

export function WhatsAppFab() {
  const { t } = useI18n();
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Fleuraya!%20I'd%20like%20to%20order%20flowers.`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("order_on_whatsapp")}
      className="fixed bottom-5 z-40 flex h-13 items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lift transition-transform hover:scale-105 ltr:right-5 rtl:left-5"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="hidden sm:inline">{t("order_on_whatsapp")}</span>
    </a>
  );
}
