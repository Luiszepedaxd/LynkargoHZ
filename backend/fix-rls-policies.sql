-- Archivo para corregir las políticas RLS de la tabla cuentas
-- Ejecuta este script en el SQL Editor de tu dashboard de Supabase

-- Primero, eliminar las políticas existentes que están causando problemas
DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propios registros" ON public.cuentas;
DROP POLICY IF EXISTS "Permitir inserción durante registro" ON public.cuentas;

-- Crear la nueva política que permite inserción durante el registro
-- Esta política permite insertar cuando:
-- 1. El ID coincide con el usuario autenticado, O
-- 2. El correo coincide con el email del JWT (durante el proceso de signup)
CREATE POLICY "Permitir inserción durante registro" ON public.cuentas
    FOR INSERT WITH CHECK (
        auth.uid() = id OR 
        (auth.jwt() ->> 'email')::text = correo
    );

-- Verificar que las políticas estén correctamente configuradas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'cuentas';
