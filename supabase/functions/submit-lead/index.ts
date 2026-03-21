import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ─── CORS ────────────────────────────────────────────────────────────────────
// En producción, restringe el origin a tu dominio:
//   'Access-Control-Allow-Origin': 'https://soluvexstudio.com'
const CORS = {
  'Access-Control-Allow-Origin': 'https://soluvexstudio.com',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type, x-client-info',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })

const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

// ─── Handler ─────────────────────────────────────────────────────────────────
Deno.serve(async (req: Request) => {

  // Preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  // ── Parsear body ────────────────────────────────────────────────────────────
  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Payload inválido' }, 400)
  }

  const { nombre, empresa, email, telefono, mensaje, _hp } = body

  // ── Honeypot ────────────────────────────────────────────────────────────────
  // Si el campo oculto tiene valor, es un bot. Respondemos success para no
  // revelar que fue detectado.
  if (_hp) {
    return json({ success: true })
  }

  // ── Validación server-side ──────────────────────────────────────────────────
  if (!nombre?.trim())   return json({ error: 'El nombre es obligatorio' }, 400)
  if (!empresa?.trim())  return json({ error: 'La empresa es obligatoria' }, 400)
  if (!email?.trim())    return json({ error: 'El email es obligatorio' }, 400)
  if (!emailOk(email.trim())) return json({ error: 'El email no es válido' }, 400)

  // ── Insertar en Supabase ─────────────────────────────────────────────────────
  // SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son variables de entorno
  // inyectadas automáticamente por Supabase en todas las Edge Functions.
  // La service_role key bypasses RLS — el INSERT siempre tiene permiso.
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const { error } = await supabase.from('leads').insert({
    nombre:   nombre.trim(),
    empresa:  empresa.trim(),
    email:    email.trim(),
    telefono: telefono?.trim() || null,
    mensaje:  mensaje?.trim()  || null,
    // origen y estado usan los DEFAULT de la tabla: 'web-formulario' y 'nuevo'
  })

  if (error) {
    console.error('[submit-lead] DB error:', error)
    return json({ error: 'Error al guardar la solicitud' }, 500)
  }

  // ── Respuesta de éxito ───────────────────────────────────────────────────────
  // Aquí se añadirá Resend en fase 2:
  //   await sendNotificationEmail({ nombre, empresa, email, mensaje })
  return json({ success: true })
})
