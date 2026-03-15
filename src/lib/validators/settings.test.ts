import { describe, expect, it } from "vitest";

import { siteSettingsSchema } from "@/lib/validators/settings";

const validSettings = {
  site_name: "Digital Bit Solutions",
  hero_badge: "Liderazgo Tecnico en PHP & WP",
  hero_available_badge: "Disponible para nuevos proyectos",
  hero_title: "Software a medida para negocios que quieren moverse rapido.",
  hero_subtitle:
    "Disenamos, construimos y mantenemos landings, paneles y automatizaciones con una base clara.",
  hero_primary_cta: "Solicitar propuesta",
  hero_secondary_cta: "Ver casos",
  hero_image_url: "https://digitalbitsolutions.com/founder.jpg",
  hero_panel_label: "Liderazgo tecnico senior",
  hero_panel_title: "PHP, WordPress, producto web e integracion moderna.",
  hero_stat_years_value: "20+",
  hero_stat_years_label: "anos",
  hero_stat_projects_value: "12+",
  hero_stat_projects_label: "proyectos",
  hero_stat_ops_value: "IA",
  hero_stat_ops_label: "ops",
  hero_delivery_label: "Delivery premium",
  default_locale: "es",
  enabled_locales: ["es", "en", "ca", "qu"],
  groq_translation_model: "openai/gpt-oss-120b",
  seo_title: "Software a medida y automatizacion | DBS",
  seo_description:
    "Software a medida, automatizacion e IA aplicada para equipos que necesitan una ejecucion sobria y fiable.",
  seo_keywords: "software a medida, automatizacion, IA aplicada",
  seo_og_image_url: "https://digitalbitsolutions.com/og-dbs.jpg",
  seo_canonical_url: "https://digitalbitsolutions.com",
  contact_email: "hola@digitalbitsolutions.com",
  contact_phone_es: "",
  contact_phone_pe: "",
  location_barcelona: "Barcelona",
  location_peru: "Peru",
  footer_text: "Digital Bit Solutions. Software a medida y automatizacion con IA.",
  lead_notification_enabled: true,
  autoresponder_enabled: true,
  internal_notification_subject: "Nuevo lead recibido desde la landing de DBS",
  autoresponder_subject: "Hemos recibido tu mensaje",
  autoresponder_body: "Gracias por escribir. Te responderemos en un maximo de 24 horas.",
  resend_from_name: "Digital Bit Solutions",
  resend_from_email: "noreply@digitalbitsolutions.com",
  header_nav_services: "Servicios",
  header_nav_cases: "Casos de exito",
  header_nav_process: "Proceso",
  header_nav_contact: "Contacto",
  header_access: "Acceso",
  footer_directory_label: "Directorio",
  footer_contact_label: "Contacto",
  footer_tagline: "Estudio tecnico senior para software a medida y automatizacion con criterio.",
  ticker_label: "Tecnologias y partners con los que trabajamos",
} as const;

describe("siteSettingsSchema", () => {
  it("accepts valid settings", () => {
    expect(siteSettingsSchema.safeParse(validSettings).success).toBe(true);
  });

  it("rejects invalid contact email", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        contact_email: "hola-at-digitalbitsolutions.com",
      }).success,
    ).toBe(false);
  });

  it("rejects hero title that is too long", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        hero_title: "a".repeat(141),
      }).success,
    ).toBe(false);
  });

  it("rejects hero badge that is too long", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        hero_badge: "a".repeat(61),
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid hero image URL", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        hero_image_url: "foto-local-sin-ruta",
      }).success,
    ).toBe(false);
  });

  it("rejects an SEO title that is too long", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        seo_title: "a".repeat(71),
      }).success,
    ).toBe(false);
  });

  it("rejects an invalid canonical URL", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        seo_canonical_url: "digitalbitsolutions",
      }).success,
    ).toBe(false);
  });

  it("rejects default locale when it is not enabled", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        default_locale: "qu",
        enabled_locales: ["es", "en", "ca"],
      }).success,
    ).toBe(false);
  });

  it("rejects invalid sender email for autoresponders", () => {
    expect(
      siteSettingsSchema.safeParse({
        ...validSettings,
        resend_from_email: "noreply-at-digitalbitsolutions.com",
      }).success,
    ).toBe(false);
  });
});
