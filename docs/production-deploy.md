# Produccion: despliegue paso a paso

Guia operativa para llevar `C:\digitalbitsolutions\landing` a produccion con `Vercel + Supabase`.

Esta guia esta escrita para que la pueda seguir una persona o ejecutar una IA con minimo contexto adicional.

## 1. Arquitectura de produccion

- Frontend y App Router: `Next.js 16` desplegado en `Vercel`.
- Base de datos, Auth, Storage y Edge Functions: `Supabase`.
- Dashboard interno:
  - Login principal por `Supabase Auth`.
  - Ruta de acceso por defecto: `/nucleo-7k9x-portal`.
  - Ruta tecnica interna: `/internal-login`.
- Storage publico para imagenes del dashboard:
  - bucket `dashboard-images`
- Automatizacion email:
  - Edge Function `lead-email-automation`
  - trigger SQL al insertar leads
  - job `pg_cron` para recordatorios

## 2. Requisitos previos

Antes de tocar produccion, prepara:

1. Una cuenta de `Vercel` con acceso al repositorio.
2. Un proyecto de `Supabase` nuevo o ya existente.
3. `Node.js 18+`.
4. `Supabase CLI`.
5. `Vercel CLI` opcional, si quieres automatizar despliegues desde terminal.
6. Una cuenta de `Resend` con dominio/emisor verificado.
7. Una clave de `Groq` si vas a usar traducciones desde el dashboard.

Comandos recomendados para el entorno del operador:

```bash
npm install
npm run test
npm run lint
npm run build
```

No sigas a produccion si `build` falla.

## 3. Variables de entorno

### 3.1 Vercel: obligatorias

Estas variables deben estar configuradas en el proyecto de `Vercel`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<supabase-anon-or-publishable-key>
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
```

### 3.2 Vercel: opcionales pero recomendadas segun uso

```env
GROQ_API_KEY=<groq-api-key>
NEXT_PUBLIC_ADMIN_LOGIN_PATH=/nucleo-7k9x-portal
```

Notas:

- `NEXT_PUBLIC_ADMIN_LOGIN_PATH` es opcional. Si no se define, el acceso del dashboard usa `/nucleo-7k9x-portal`.
- `GROQ_API_KEY` solo es necesaria si el dashboard debe traducir contenidos con LLM.

### 3.3 Variables locales de desarrollo que no debes usar como estrategia de produccion

```env
ADMIN_USER=<solo local>
ADMIN_PASSWORD=<solo local>
```

Estas credenciales solo habilitan login local fuera de produccion. En produccion el dashboard debe usar `Supabase Auth`.

### 3.4 Secrets de la Edge Function en Supabase

La funcion `lead-email-automation` necesita estos secrets en Supabase:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key>
RESEND_API_KEY=<resend-api-key>
```

## 4. Preparar Supabase

### 4.1 Crear o identificar el proyecto

Necesitas el `project ref`, la URL publica y las claves:

- `Project URL`
- `anon/publishable key`
- `service role key`

### 4.2 Enlazar el repo con el proyecto remoto

Inferencia:
Este repo no incluye `supabase/config.toml`, asi que el flujo esperado es enlazar el proyecto remoto manualmente con la CLI.

```bash
supabase login
supabase link --project-ref <project-ref>
```

### 4.3 Aplicar migraciones

Este repo depende de las migraciones en `supabase/migrations/`.

Aplicalas al proyecto remoto:

```bash
supabase db push
```

Si la IA o el operador no puede usar `db push`, entonces debe ejecutar manualmente los SQL de `supabase/migrations/` en orden cronologico.

### 4.4 Verificar estructura minima en Supabase

Tras las migraciones, confirma que existen:

- tabla `site_settings`
- tabla `services`
- tabla `projects`
- tabla `leads`
- columnas de automatizacion email en `leads`
- columnas SEO, i18n y hero visual en `site_settings`
- bucket `dashboard-images`
- policies de `storage.objects` para ese bucket

## 5. Configurar Storage para imagenes del dashboard

La migracion `supabase/migrations/202603210001_add_dashboard_image_storage.sql` crea:

- bucket publico `dashboard-images`
- limite de 8 MB
- mime types permitidos:
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `image/avif`

Rutas esperadas dentro del bucket:

- `site-settings/hero/<timestamp>-hero.<ext>`
- `site-settings/seo-og/<timestamp>-og.<ext>`
- `projects/<slug>/cover-<timestamp>.<ext>`

Validacion post migracion:

1. Abre Supabase Storage.
2. Confirma que existe el bucket `dashboard-images`.
3. Confirma que es publico.
4. Confirma que el dashboard puede subir una imagen real tras login.

## 6. Configurar Auth para el dashboard

En produccion, el dashboard depende de `Supabase Auth`.

### 6.1 Crear el usuario admin

Hazlo desde el panel de Supabase Auth o con tu flujo habitual de invitacion.

Requisito funcional:

- el usuario debe poder iniciar sesion con email y password

### 6.2 Confirmar ruta de acceso

El acceso esperado del dashboard es:

```txt
/<admin-login-path>
```

Por defecto:

```txt
/nucleo-7k9x-portal
```

### 6.3 Validar el middleware

El middleware hace tres cosas importantes:

1. Reescribe la ruta bonita del admin a `/internal-login`.
2. Actualiza la sesion Supabase en rutas protegidas.
3. Mantiene la localizacion de la landing fuera del dashboard.

Smoke test obligatorio tras deploy:

1. Abrir `/login`
2. Abrir `/nucleo-7k9x-portal`
3. Abrir `/dashboard`
4. Confirmar que no hay bucles de redirect ni 404

## 7. Desplegar la Edge Function de emails

### 7.1 Cargar secrets

```bash
supabase secrets set \
  SUPABASE_URL=https://<project-ref>.supabase.co \
  SUPABASE_SERVICE_ROLE_KEY=<supabase-service-role-key> \
  RESEND_API_KEY=<resend-api-key>
```

### 7.2 Desplegar la funcion

```bash
supabase functions deploy lead-email-automation --no-verify-jwt
```

### 7.3 Verificar URL final

La funcion quedara accesible en:

```txt
https://<project-ref>.supabase.co/functions/v1/lead-email-automation
```

## 8. Activar trigger y recordatorios de email

El archivo `supabase/sql/lead_email_automation.sql` tiene placeholders que deben reemplazarse antes de ejecutarlo.

### 8.1 Sustituir el project ref

Reemplaza:

```txt
YOUR_PROJECT_REF
```

por el `project ref` real de Supabase.

### 8.2 Ejecutar el SQL

Hazlo desde SQL Editor o desde tu flujo automatizado:

```sql
create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron with schema extensions;
```

Luego ejecuta el resto del archivo para:

- crear `enqueue_lead_email_automation()`
- crear trigger `lead_email_automation_after_insert`
- programar job `lead-email-reminders`

### 8.3 Verificar automatizacion

Checklist:

1. Insertar un lead desde la landing.
2. Confirmar que se crea el registro en `leads`.
3. Confirmar que la function se invoca.
4. Confirmar envio interno y/o autorespuesta.
5. Confirmar que se actualizan:
   - `notification_sent_at`
   - `autoresponder_sent_at`
   - `email_last_error`

## 9. Configurar Vercel

### 9.1 Crear proyecto

Conecta el repositorio a Vercel o usa CLI:

```bash
vercel
```

### 9.2 Cargar variables

Configura al menos:

```env
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

Configura tambien si aplica:

```env
GROQ_API_KEY
NEXT_PUBLIC_ADMIN_LOGIN_PATH
```

### 9.3 Deploy

Para produccion:

```bash
vercel --prod
```

Si usas despliegue desde GitHub, confirma que `main` es la rama conectada.

## 10. Orden recomendado de despliegue

Sigue este orden exacto:

1. Validar localmente:
   ```bash
   npm install
   npm run test
   npm run lint
   npm run build
   ```
2. Crear o elegir proyecto Supabase.
3. Enlazar el proyecto con `supabase link`.
4. Aplicar migraciones con `supabase db push`.
5. Crear secrets de la Edge Function.
6. Desplegar `lead-email-automation`.
7. Ejecutar `supabase/sql/lead_email_automation.sql` con el `project ref` real.
8. Configurar variables en Vercel.
9. Desplegar a produccion en Vercel.
10. Crear usuario admin en Supabase Auth.
11. Ejecutar smoke tests funcionales.

## 11. Smoke test post deploy

### 11.1 Landing publica

1. Abrir `/es` o la locale por defecto.
2. Confirmar que la home renderiza sin errores.
3. Confirmar que servicios y proyectos cargan.
4. Enviar un lead desde el formulario publico.

### 11.2 Dashboard

1. Abrir `/nucleo-7k9x-portal`
2. Iniciar sesion con un usuario real de Supabase Auth.
3. Entrar en:
   - `/dashboard`
   - `/dashboard/settings`
   - `/dashboard/services`
   - `/dashboard/projects`
   - `/dashboard/leads`
4. Confirmar que no hay:
   - `404`
   - redirects raros
   - errores de sesion
   - tablas vacias por permisos mal configurados

### 11.3 Edicion real

1. Cambiar un ajuste global y guardar.
2. Crear o editar un servicio.
3. Crear o editar un proyecto.
4. Subir una imagen al bucket desde el dashboard.
5. Cambiar el estado de un lead.
6. Reenviar email manual desde leads si aplica.

### 11.4 Email automation

1. Confirmar email interno al contacto.
2. Confirmar autorespuesta al lead.
3. Confirmar que `Resend` acepta el remitente configurado.

## 12. Riesgos frecuentes

### `404` o redirects raros en el dashboard

Revisar:

- `NEXT_PUBLIC_ADMIN_LOGIN_PATH`
- middleware activo
- que la build desplegada sea la actual
- que exista acceso a `/login` y `/nucleo-7k9x-portal`

### El dashboard abre pero no guarda datos

Revisar:

- `SUPABASE_SERVICE_ROLE_KEY` en Vercel
- permisos del usuario en Supabase
- que las migraciones esten aplicadas
- errores de RLS en tablas o storage

### No se pueden subir imagenes

Revisar:

- bucket `dashboard-images`
- policies de `storage.objects`
- `SUPABASE_SERVICE_ROLE_KEY`
- tamaño y mime type del archivo

### No funciona la traduccion

Revisar:

- `GROQ_API_KEY`
- modelo configurado en `site_settings`
- que haya idiomas secundarios activos

### No salen emails

Revisar:

- secrets de la Edge Function
- despliegue de `lead-email-automation`
- `RESEND_API_KEY`
- dominio/remitente verificado en Resend
- SQL del trigger con `YOUR_PROJECT_REF` reemplazado

## 13. Checklist final

Marca todo antes de cerrar el paso a produccion:

- [ ] `npm run test` correcto
- [ ] `npm run lint` correcto
- [ ] `npm run build` correcto
- [ ] proyecto Supabase enlazado
- [ ] migraciones aplicadas
- [ ] bucket `dashboard-images` visible y operativo
- [ ] Edge Function desplegada
- [ ] trigger SQL y cron activos
- [ ] variables de Vercel cargadas
- [ ] usuario admin creado en Supabase Auth
- [ ] login del dashboard funcionando
- [ ] CRUD de servicios funcionando
- [ ] CRUD de proyectos funcionando
- [ ] ajustes globales guardando
- [ ] subida de imagenes operativa
- [ ] formulario de leads guardando
- [ ] automatizacion email confirmada

## 14. Pendientes o decisiones requeridas

Estas decisiones no quedan completamente automatizadas por el repo y deben resolverse en el entorno real:

1. Dominio final de produccion en Vercel.
2. Dominio/remitente definitivo en Resend.
3. Politica de creacion de usuarios admin en Supabase Auth.
4. Valor final de `NEXT_PUBLIC_ADMIN_LOGIN_PATH`, si se quiere cambiar la ruta por defecto.
5. Mecanismo operativo para ejecutar el SQL del trigger en cada entorno.

