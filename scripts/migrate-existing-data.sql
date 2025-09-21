-- Script para migrar datos existentes del sistema anterior al nuevo sistema multiusuario
-- Ejecutar DESPUÉS de aplicar la migración de Prisma

-- 1. Migrar cuentas existentes a organizaciones
INSERT INTO organizations (id, nombre, tipo, activo, created_at, updated_at)
SELECT 
    gen_random_uuid() as id,
    nombre_empresa as nombre,
    CASE 
        WHEN tipo_usuario = 'cliente' THEN 'CLIENTE'::organizationtype
        WHEN tipo_usuario = 'proveedor' THEN 'PROVEEDOR'::organizationtype
        ELSE 'MIXTO'::organizationtype
    END as tipo,
    true as activo,
    created_at,
    updated_at
FROM cuentas
WHERE nombre_empresa IS NOT NULL;

-- 2. Migrar usuarios de cuentas
INSERT INTO users (id, email, nombre, created_at, updated_at)
SELECT 
    id,
    correo as email,
    nombre,
    created_at,
    updated_at
FROM cuentas;

-- 3. Crear membresías (cada usuario como OWNER de su organización)
INSERT INTO organization_members (id, organization_id, user_id, role, activo, joined_at, created_at, updated_at)
SELECT 
    gen_random_uuid() as id,
    org.id as organization_id,
    c.id as user_id,
    'OWNER'::memberrole as role,
    true as activo,
    c.created_at as joined_at,
    c.created_at,
    c.updated_at
FROM cuentas c
JOIN organizations org ON org.nombre = c.nombre_empresa
WHERE c.nombre_empresa IS NOT NULL;

-- 4. Migrar perfiles extendidos si existen
INSERT INTO user_profiles (id, user_id, telefono, direccion, ciudad, estado, codigo_postal, website, descripcion, created_at, updated_at)
SELECT 
    gen_random_uuid() as id,
    pe.id as user_id,
    pe.telefono,
    pe.direccion,
    pe.ciudad,
    pe.estado,
    pe.codigo_postal,
    pe.sitio_web as website,
    pe.descripcion,
    pe.created_at,
    pe.updated_at
FROM perfiles_extendidos pe
JOIN users u ON u.id = pe.id;

-- 5. Actualizar notificaciones para usar el nuevo esquema
-- (Las notificaciones ya tienen user_id, solo necesitan verificar que exista en la nueva tabla users)

-- 6. Verificar que no haya duplicados
-- (Este script asume que cada empresa en cuentas es única)
