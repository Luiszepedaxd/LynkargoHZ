# Instrucciones para Corregir el Problema de Registro

## Problema Identificado
El error "new row violates row-level security policy for table 'cuentas'" indica que las políticas RLS (Row Level Security) de Supabase están bloqueando la inserción de nuevos usuarios durante el registro.

## Solución

### Paso 1: Aplicar las Políticas RLS Corregidas
1. Ve a tu dashboard de Supabase
2. Navega a **SQL Editor**
3. Ejecuta el archivo `fix-rls-policies.sql` que está en esta carpeta

### Paso 2: Verificar la Configuración
Después de ejecutar el script, deberías ver 3 políticas activas:
- "Permitir inserción durante registro" (INSERT)
- "Los usuarios pueden ver sus propios registros" (SELECT)
- "Los usuarios pueden actualizar sus propios registros" (UPDATE)

### Paso 3: Probar el Registro
1. Ve a tu aplicación
2. Intenta crear una nueva cuenta
3. El error de RLS debería estar resuelto

## Explicación Técnica

### Problema Original
Las políticas RLS originales solo permitían inserción cuando `auth.uid() = id`, pero durante el proceso de `signUp`, el usuario aún no está completamente autenticado.

### Solución Implementada
La nueva política permite inserción cuando:
- El ID coincide con el usuario autenticado, O
- El correo del registro coincide con el email del JWT (durante signup)

## Archivos Modificados

### Backend
- `supabase-schema.sql` - Esquema actualizado con políticas corregidas
- `fix-rls-policies.sql` - Script para aplicar las correcciones

### Frontend
- `RegistroPage.tsx` - Mejorado con:
  - Toggle entre registro e inicio de sesión
  - Loading state mejorado
  - Sistema de cooldown para evitar spam
  - Manejo de errores mejorado

## Notas Importantes
- Las políticas RLS son críticas para la seguridad
- Siempre prueba en un entorno de desarrollo primero
- Si tienes problemas, puedes deshabilitar temporalmente RLS con: `ALTER TABLE public.cuentas DISABLE ROW LEVEL SECURITY;`
- Recuerda volver a habilitarlo después de las pruebas
