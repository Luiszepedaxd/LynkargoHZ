-- =====================================================
-- VERIFICAR ESTADO COMPLETO DE LA BASE DE DATOS
-- =====================================================

-- 1. Verificar que las tablas existen
SELECT 'TABLAS EXISTENTES:' as status;
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE '_prisma%'
ORDER BY table_name;

-- 2. Verificar estado RLS
SELECT 'ESTADO RLS:' as status;
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN rowsecurity = true THEN 'RLS ENABLED ❌'
        ELSE 'RLS DISABLED ✅'
    END as rls_status
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename NOT LIKE '_prisma%'
ORDER BY tablename;

-- 3. Contar políticas activas
SELECT 'POLITICAS ACTIVAS:' as status;
SELECT COUNT(*) as total_policies
FROM pg_policies 
WHERE schemaname = 'public';

-- 4. Verificar estructura de tabla users
SELECT 'ESTRUCTURA TABLA USERS:' as status;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users'
ORDER BY ordinal_position;

-- 5. Probar inserción directa (esto debería funcionar)
SELECT 'PROBANDO INSERCION DIRECTA:' as status;

-- Intentar insertar un registro de prueba
INSERT INTO users (id, email, nombre, activo) 
VALUES (gen_random_uuid(), 'test-direct@test.com', 'Test Direct', true)
ON CONFLICT (email) DO NOTHING;

-- Verificar que se insertó
SELECT COUNT(*) as registros_en_users FROM users;

-- Limpiar registro de prueba
DELETE FROM users WHERE email = 'test-direct@test.com';

SELECT 'INSERCION DIRECTA EXITOSA ✅' as result;

-- 6. Verificar permisos de rol
SELECT 'PERMISOS DEL ROL ACTUAL:' as status;
SELECT current_user, current_setting('role') as current_role;

-- 7. Mostrar información de conexión
SELECT 'INFO DE CONEXION:' as status;
SELECT 
    current_database() as database_name,
    current_user as connected_user,
    inet_server_addr() as server_ip,
    inet_server_port() as server_port;

DO $$
BEGIN
    RAISE NOTICE '=== VERIFICACION COMPLETADA ===';
    RAISE NOTICE 'Si la insercion directa funciona pero la app no, el problema esta en el codigo';
    RAISE NOTICE 'Si la insercion directa falla, el problema esta en la base de datos';
END $$;
