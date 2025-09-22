-- Test directo de inserción para verificar permisos
-- Ejecuta este script para probar si la inserción funciona directamente

-- 1. Verificar rol actual
SELECT current_user, current_setting('role') as current_role;

-- 2. Verificar permisos en tabla users
SELECT has_table_privilege('users', 'INSERT') as can_insert_users;

-- 3. Intentar inserción directa
INSERT INTO users (id, email, nombre, activo) 
VALUES (gen_random_uuid(), 'test-sql@test.com', 'Test SQL', true)
ON CONFLICT (email) DO NOTHING;

-- 4. Verificar inserción
SELECT COUNT(*) as total_users FROM users WHERE email = 'test-sql@test.com';

-- 5. Limpiar
DELETE FROM users WHERE email = 'test-sql@test.com';

SELECT 'Test completado exitosamente' as resultado;
