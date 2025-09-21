-- =====================================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS DE REGISTRO
-- =====================================================
-- Este script corrige las políticas RLS para permitir
-- el registro de nuevos usuarios

-- =====================================================
-- 1. ELIMINAR POLÍTICAS RESTRICTIVAS EXISTENTES
-- =====================================================

-- Eliminar políticas que impiden la inserción
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can view own context" ON user_contexts;
DROP POLICY IF EXISTS "Users can insert own context" ON user_contexts;
DROP POLICY IF EXISTS "Users can update own context" ON user_contexts;

-- =====================================================
-- 2. CREAR POLÍTICAS PARA PERMITIR REGISTRO
-- =====================================================

-- Política para users: Permitir inserción durante registro + ver/actualizar propio perfil
CREATE POLICY "Enable insert for registration" ON users
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Política para user_roles: Permitir inserción durante registro + ver propios roles
CREATE POLICY "Enable insert for user roles during registration" ON user_roles
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own roles" ON user_roles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own roles" ON user_roles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Política para user_contexts: Permitir inserción durante registro + gestionar propio contexto
CREATE POLICY "Enable insert for user context during registration" ON user_contexts
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own context" ON user_contexts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own context" ON user_contexts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =====================================================
-- 3. POLÍTICAS ADICIONALES PARA FUNCIONALIDAD COMPLETA
-- =====================================================

-- Permitir que los usuarios puedan crear organizaciones
CREATE POLICY "Users can create organizations" ON organizations
    FOR INSERT WITH CHECK (true);

-- Permitir que los usuarios se agreguen como miembros de organizaciones
CREATE POLICY "Users can join organizations" ON organization_members
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Permitir que los usuarios actualicen sus membresías
CREATE POLICY "Users can update their memberships" ON organization_members
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- =====================================================
-- 4. VERIFICAR CONFIGURACIÓN RLS
-- =====================================================

-- Verificar que RLS esté habilitado en las tablas principales
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_roles', 'user_contexts', 'organizations', 'organization_members')
ORDER BY tablename;

-- Mostrar políticas activas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'user_roles', 'user_contexts')
ORDER BY tablename, policyname;

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE 'POLÍTICAS RLS CORREGIDAS EXITOSAMENTE';
    RAISE NOTICE 'Ahora los usuarios pueden registrarse correctamente';
    RAISE NOTICE 'Las políticas permiten inserción durante registro y gestión posterior';
END $$;
