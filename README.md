# Digital Bit Solutions (DBS) - Landing & Premium CMS

> **Plataforma modular de alto rendimiento para agencias de software y negocios inteligentes.**

![DBS Landing](docs/assets/landing-desktop.png)

### 🏷️ Tags
`Next.js 16` `React 19` `Tailwind CSS v4` `Supabase` `GSAP` `Groq AI` `i18n` `Email Automation`

---

Una plataforma modular y premium para Digital Bit Solutions, diseñada con un enfoque en **rendimiento**, **automatización** y **criterio técnico**. Este repositorio combina una landing page pública de alto impacto con un mini CMS interno para la gestión de contenidos, leads e integraciones con IA.

---

## ⚡️ Quick Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router + Turbopack)
- **UI:** [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [GSAP](https://gsap.com/)
- **Backend/Auth:** [Supabase](https://supabase.com/)
- **i18n:** [next-intl](https://next-intl-docs.vercel.app/) (Aranés, Catalán, Inglés, Español, Quechua)
- **AI/LLM:** [Groq](https://groq.com/) (Traducciones asistidas por LLM)
- **Automatización:** [Supabase Edge Functions](https://supabase.com/edge-functions) + [Resend](https://resend.com/)

---

## 📸 Visual Showcase

### Landing Page
| Desktop View | Mobile View |
| :--- | :--- |
| ![Desktop](docs/assets/landing-desktop.png) | ![Mobile](docs/assets/landing-mobile.png) |

### Servicios y Contacto
![Services](docs/assets/landing-services.png)

### Dashboard Interno (CMS)
![Dashboard Overview](docs/assets/dashboard-overview.png)

> [!TIP]
> El dashboard permite una gestión integral de la landing sin tocar código: desde la activación de idiomas hasta el reenvío manual de correos a leads.

---

## ✨ Características Principales

### 🌐 Landing Pública Premium
- **Experiencia de usuario fluida:** Animaciones GSAP sutiles y transiciones de alto rendimiento.
- **Multilingüe nativo:** Soporte robusto para i18n con rutas localizadas.
- **Formularios inteligentes:** Captura de leads validada con Zod y persistencia en Supabase.

### 🛠️ Mini CMS Autenticado
- **Dashboard Overview:** Estadísticas clave del sitio y actividad reciente.
- **Gestor de Contenidos:** CRUD completo para proyectos y servicios con soporte para traducciones.
- **Configuración Global:** Control total sobre SEO, metadata de redes sociales y ajustes de contacto.
- **Traducciones con IA:** Integración con Groq para generar contenido en múltiples idiomas con un solo clic.

### 📧 Automatización de Leads
- **Webhook SQL + Edge Functions:** Flujo robusto que dispara avisos internos y respuestas automáticas.
- **Idempotencia y Trazabilidad:** Registro detallado de envíos de email con capacidad de reintento manual desde el panel.

---

## 🚀 Instalación y Desarrollo

### Requisitos Previos
- Node.js 18+
- Una instancia de Supabase (opcional para visualización básica, obligatoria para el dashboard)

### Pasos
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/digitalbitsolutions/landing.git
   cd landing
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Variables de entorno:**
   Copia `.env.example` a `.env.local` y configura tus claves:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   GROQ_API_KEY=...
   ```

4. **Lanzar en local:**
   ```bash
   npm run dev
   ```

---

## 📂 Arquitectura del Proyecto

```txt
src/
  app/
    (marketing)/   # Landing pública localizable
    dashboard/     # CMS Interno (Server Actions + React Query)
    api/           # Endpoints públicos (leads/contact)
  components/
    ui/            # Primitivas basadas en shadcn/ui
    sections/      # Bloques visuales de la landing
    dashboard/     # Componentes específicos del CMS
  lib/
    supabase/      # Cliente SSR, middleware y base de queries
    validators/    # Schemas de Zod para formularios y registros
  supabase/
    functions/     # Edge Functions para automatizaciones
    migrations/    # Esquema SQL y Row Level Security
```

---

## 🏗️ Despliegue

### Vercel + Supabase
1. Conecta el repositorio a **Vercel**.
2. Configura las variables de entorno en el panel de Vercel.
3. En **Supabase**, despliega la Edge Function:
   ```bash
   supabase functions deploy lead-email-automation --no-verify-jwt
   ```
4. Configura el webhook SQL incluido en `supabase/sql/lead_email_automation.sql`.

Para el paso a produccion completo, revisa [docs/production-deploy.md](docs/production-deploy.md).

---

## 🛡️ Seguridad y Calidad
- **Row Level Security (RLS):** Acceso protegido a nivel de fila en Supabase.
- **Validación Estricta:** Uso intensivo de TypeScript y Zod en toda la cadena de datos.
- **Tests Automatizados:** Base de tests unitarios y de integración con Vitest.

```bash
npm run test    # Ejecutar suite de pruebas
npm run lint    # Validación de estilos y tipos
```

---

## 📧 Contacto

Desarrollado con ❤️ por **Digital Bit Solutions**.
[https://digitalbitsolutions.com](https://digitalbitsolutions.com)
