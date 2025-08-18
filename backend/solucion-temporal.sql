-- SOLUCIÓN TEMPORAL: Deshabilitar RLS para permitir registro
-- ⚠️ ADVERTENCIA: Solo usar temporalmente para desarrollo
-- Ejecuta este script en el SQL Editor de Supabase

-- Opción 1: Deshabilitar RLS temporalmente (MÁS SEGURO)
ALTER TABLE public.cuentas DISABLE ROW LEVEL SECURITY;

-- Opción 2: Si la opción 1 no funciona, eliminar todas las políticas
-- DROP POLICY IF EXISTS "Los usuarios pueden ver sus propios registros" ON public.cuentas;
-- DROP POLICY IF EXISTS "Los usuarios pueden actualizar sus propios registros" ON public.cuentas;
-- DROP POLICY IF EXISTS "Los usuarios pueden insertar sus propios registros" ON public.cuentas;
-- DROP POLICY IF EXISTS "Permitir inserción durante registro" ON public.cuentas;

-- Opción 3: Crear política muy permisiva (SOLO PARA DESARROLLO)
-- CREATE POLICY "Permitir todo temporalmente" ON public.cuentas
--     FOR ALL USING (true)
--     WITH CHECK (true);

-- Verificar el estado actual
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'cuentas';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'cuentas';
