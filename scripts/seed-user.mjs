// Script de seed: crea un usuario cobrador de prueba en Supabase
// Ejecutar con: node scripts/seed-user.mjs

import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

// ── Configura aquí tus credenciales ─────────────────────────
const SUPABASE_URL      = 'https://daqzspckuwhxmhzmzffq.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_6zmlffGwy0_WXbFX-8oBNA_J_pSV10Y'

// ── Datos del usuario a crear ────────────────────────────────
const USUARIO = {
  email:    'cobrador@cancha.com',
  password: 'Cobrador123!',
  nombre:   'Juan Cobrador',
  rol:      'cobrador',  // 'cobrador' o 'admin'
}

// ────────────────────────────────────────────────────────────
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  realtime: { transport: ws }
})

async function crearUsuario() {
  console.log(`\n🔐 Procesando usuario seed: ${USUARIO.email} ...`)

  let userId = null

  // 1. Intentar iniciar sesión por si el usuario ya fue creado
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email:    USUARIO.email,
    password: USUARIO.password,
  })

  if (!loginError && loginData?.user?.id) {
    userId = loginData.user.id
    console.log(`ℹ️  El usuario ya existe en Supabase Auth con UUID: ${userId}`)
  } else {
    // 2. Si no existe, intentar registrarlo en Supabase Auth
    console.log(`➡️  Registrando nuevo usuario en Supabase Auth...`)
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email:    USUARIO.email,
      password: USUARIO.password,
      options: {
        data: { nombre: USUARIO.nombre }  // guardado en user_metadata
      }
    })

    if (signUpError) {
      console.error('❌ Error al registrar el usuario:', signUpError.message)
      console.error('   Si ya creaste el usuario desde el panel de Supabase, verifica la contraseña.')
      process.exit(1)
    }

    userId = signUpData.user?.id
    if (!userId) {
      console.error('❌ No se obtuvo el UUID del usuario.')
      process.exit(1)
    }

    console.log(`✅ Usuario creado correctamente con UUID: ${userId}`)
  }

  // 3. Insertar o actualizar perfil en public.perfiles (upsert)
  console.log(`📋 Sincronizando perfil en tabla public.perfiles...`)

  const { error: perfilError } = await supabase
    .from('perfiles')
    .upsert({
      id:     userId,
      nombre: USUARIO.nombre,
      rol:    USUARIO.rol,
    }, { onConflict: 'id' })

  if (perfilError) {
    console.warn('⚠️  Advertencia al sincronizar el perfil:', perfilError.message)
    console.warn('   → Asegúrate de haber ejecutado la tabla "perfiles" en el SQL de Supabase.')
    console.warn(`   → Inserción manual en el SQL Editor de Supabase:\n`)
    console.warn(`   INSERT INTO public.perfiles (id, nombre, rol)`)
    console.warn(`   VALUES ('${userId}', '${USUARIO.nombre}', '${USUARIO.rol}')`)
    console.warn(`   ON CONFLICT (id) DO UPDATE SET nombre = '${USUARIO.nombre}', rol = '${USUARIO.rol}';\n`)
  } else {
    console.log(`✅ Perfil sincronizado correctamente en la tabla perfiles.`)
  }

  // 4. Resumen
  console.log('\n─────────────────────────────────────────')
  console.log('🎉 ¡Listo! Credenciales de acceso:')
  console.log(`   Email:    ${USUARIO.email}`)
  console.log(`   Password: ${USUARIO.password}`)
  console.log(`   Rol:      ${USUARIO.rol}`)
  console.log(`   UUID:     ${userId}`)
  console.log('─────────────────────────────────────────\n')
}

crearUsuario()
