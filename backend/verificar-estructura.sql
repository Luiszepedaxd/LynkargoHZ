-- Script para verificar y corregir la estructura de la base de datos
-- Ejecuta este script en el SQL Editor de Supabase

-- 1. Verificar que la tabla cuentas existe y su estructura
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'cuentas' 
ORDER BY ordinal_position;

-- 2. Verificar las constraints de foreign key
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'cuentas';

-- 3. Verificar que la tabla auth.users existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'auth' 
    AND table_name = 'users'
) as auth_users_exists;

-- 4. Verificar el estado de RLS
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'cuentas';

-- 5. Si hay problemas con la foreign key, recrear la tabla
-- DESCOMENTAR SOLO SI ES NECESARIO:

-- DROP TABLE IF EXISTS public.cuentas CASCADE;
-- 
-- CREATE TABLE public.cuentas (
--     id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
--     created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
--     nombre TEXT NOT NULL,
--     correo TEXT NOT NULL UNIQUE,
--     nombre_empresa TEXT,
--     tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'proveedor')),
--     activo BOOLEAN DEFAULT true,
--     
--     PRIMARY KEY (id)
-- );
-- 
-- -- Deshabilitar RLS temporalmente
-- ALTER TABLE public.cuentas DISABLE ROW LEVEL SECURITY;
