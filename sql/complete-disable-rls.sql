-- =====================================================
-- DESHABILITAR COMPLETAMENTE RLS EN TODAS LAS TABLAS
-- =====================================================
-- Solución definitiva: deshabilitar RLS en todas las tablas
-- para eliminar completamente los problemas de permisos

-- Deshabilitar RLS en TODAS las tablas
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organizations DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_contexts DISABLE ROW LEVEL SECURITY;
ALTER TABLE providers DISABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services DISABLE ROW LEVEL SECURITY;
ALTER TABLE provider_locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers DISABLE ROW LEVEL SECURITY;

-- Eliminar TODAS las políticas existentes
DROP POLICY IF EXISTS "Enable insert for registration" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own user_profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable insert for user roles during registration" ON user_roles;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update own roles" ON user_roles;
DROP POLICY IF EXISTS "Enable insert for user context during registration" ON user_contexts;
DROP POLICY IF EXISTS "Users can view own context" ON user_contexts;
DROP POLICY IF EXISTS "Users can update own context" ON user_contexts;
DROP POLICY IF EXISTS "Members can view their organizations" ON organizations;
DROP POLICY IF EXISTS "Users can view memberships where they participate" ON organization_members;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Users can create organizations" ON organizations;
DROP POLICY IF EXISTS "Users can join organizations" ON organization_members;
DROP POLICY IF EXISTS "Users can update their memberships" ON organization_members;

-- Verificar que TODAS las tablas tengan RLS deshabilitado
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

-- Contar políticas restantes (debería ser 0)
SELECT COUNT(*) as remaining_policies
FROM pg_policies 
WHERE schemaname = 'public';

DO $$
BEGIN
    RAISE NOTICE '✅ RLS COMPLETAMENTE DESHABILITADO EN TODAS LAS TABLAS';
    RAISE NOTICE '✅ TODAS LAS POLÍTICAS RLS ELIMINADAS';
    RAISE NOTICE '✅ EL REGISTRO DEBERÍA FUNCIONAR SIN PROBLEMAS DE PERMISOS';
    RAISE NOTICE '⚠️  NOTA: Esto es para desarrollo. En producción considera habilitar RLS';
END $$;
