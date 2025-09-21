-- =====================================================
-- SCRIPT COMPLETO PARA RECREAR ESTRUCTURA DE LYNKARGO
-- =====================================================
-- Este script elimina todas las tablas existentes y recrea 
-- la estructura completa basada en el esquema de Prisma

-- =====================================================
-- 1. ELIMINAR TODAS LAS TABLAS EXISTENTES
-- =====================================================

-- Eliminar tablas en orden correcto (dependencias primero)
DROP TABLE IF EXISTS newsletter_subscribers CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS provider_documents CASCADE;
DROP TABLE IF EXISTS provider_locations CASCADE;
DROP TABLE IF EXISTS provider_services CASCADE;
DROP TABLE IF EXISTS providers CASCADE;
DROP TABLE IF EXISTS user_contexts CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS organization_members CASCADE;
DROP TABLE IF EXISTS organization_profiles CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tabla antigua de cuentas si existe
DROP TABLE IF EXISTS cuentas CASCADE;

-- Eliminar enums existentes
DROP TYPE IF EXISTS NotificationType CASCADE;
DROP TYPE IF EXISTS DocumentType CASCADE;
DROP TYPE IF EXISTS OrderStatus CASCADE;
DROP TYPE IF EXISTS PlatformRole CASCADE;
DROP TYPE IF EXISTS MemberRole CASCADE;
DROP TYPE IF EXISTS OrganizationType CASCADE;

-- =====================================================
-- 2. CREAR ENUMS
-- =====================================================

CREATE TYPE OrganizationType AS ENUM ('CLIENTE', 'PROVEEDOR', 'MIXTO');
CREATE TYPE MemberRole AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER');
CREATE TYPE PlatformRole AS ENUM ('CLIENTE', 'PROVEEDOR', 'ADMIN');
CREATE TYPE OrderStatus AS ENUM ('PENDIENTE', 'CONFIRMADA', 'EN_PROCESO', 'EN_TRANSITO', 'ENTREGADA', 'CANCELADA');
CREATE TYPE DocumentType AS ENUM ('RFC', 'ACTA_CONSTITUTIVA', 'COMPROBANTE_DOMICILIO', 'SEGURO', 'LICENCIA', 'OTRO');
CREATE TYPE NotificationType AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'INVITATION', 'ROLE_CHANGE', 'ORDER_UPDATE');

-- =====================================================
-- 3. CREAR TABLAS PRINCIPALES
-- =====================================================

-- Tabla de usuarios (personas físicas)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de usuario
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    direccion TEXT,
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    codigo_postal VARCHAR(10),
    website VARCHAR(255),
    descripcion TEXT,
    avatar VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de organizaciones
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    tipo OrganizationType NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de perfiles de organizaciones
CREATE TABLE organization_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID UNIQUE NOT NULL,
    rfc VARCHAR(13),
    direccion TEXT,
    ciudad VARCHAR(100),
    estado VARCHAR(100),
    codigo_postal VARCHAR(10),
    website VARCHAR(255),
    descripcion TEXT,
    logo VARCHAR(500),
    telefono VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Tabla de miembros de organizaciones
CREATE TABLE organization_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role MemberRole NOT NULL,
    activo BOOLEAN DEFAULT true,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    UNIQUE(organization_id, user_id)
);

-- Tabla de roles de plataforma de usuarios
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    role PlatformRole NOT NULL,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, role)
);

-- Tabla de contexto activo de usuarios
CREATE TABLE user_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL,
    active_role PlatformRole NOT NULL,
    active_organization_id UUID,
    last_switched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (active_organization_id) REFERENCES organizations(id) ON DELETE SET NULL
);

-- Tabla de proveedores
CREATE TABLE providers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- Tabla de servicios de proveedores
CREATE TABLE provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2),
    unidad VARCHAR(50),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Tabla de ubicaciones de proveedores
CREATE TABLE provider_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    pais VARCHAR(100) DEFAULT 'Mexico',
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Tabla de documentos de proveedores
CREATE TABLE provider_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL,
    tipo DocumentType NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    verificado BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE CASCADE
);

-- Tabla de órdenes
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    organization_id UUID,
    provider_id UUID,
    servicio VARCHAR(255) NOT NULL,
    descripcion TEXT,
    origen VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    peso DECIMAL(10,2),
    volumen DECIMAL(10,2),
    precio DECIMAL(10,2),
    estado OrderStatus DEFAULT 'PENDIENTE',
    fecha_envio TIMESTAMP WITH TIME ZONE,
    fecha_entrega TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE SET NULL,
    FOREIGN KEY (provider_id) REFERENCES providers(id) ON DELETE SET NULL
);

-- Tabla de notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    mensaje TEXT NOT NULL,
    tipo NotificationType NOT NULL,
    leida BOOLEAN DEFAULT false,
    accion_url VARCHAR(500),
    accion_texto VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de suscriptores del newsletter
CREATE TABLE newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(255),
    empresa VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 4. CREAR ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_activo ON users(activo);
CREATE INDEX idx_organizations_tipo ON organizations(tipo);
CREATE INDEX idx_organizations_activo ON organizations(activo);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_organization_members_organization_id ON organization_members(organization_id);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role ON user_roles(role);
CREATE INDEX idx_user_contexts_user_id ON user_contexts(user_id);
CREATE INDEX idx_providers_organization_id ON providers(organization_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_estado ON orders(estado);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_leida ON notifications(leida);

-- =====================================================
-- 5. CONFIGURAR RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE provider_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. CREAR POLÍTICAS RLS BÁSICAS
-- =====================================================

-- Políticas para users: Los usuarios pueden ver y actualizar su propia información
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Políticas para user_profiles: Los usuarios pueden gestionar su propio perfil
CREATE POLICY "Users can view own user_profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own user_profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own user_profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Políticas para user_roles: Los usuarios pueden ver sus propios roles
CREATE POLICY "Users can view own roles" ON user_roles
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Políticas para user_contexts: Los usuarios pueden gestionar su propio contexto
CREATE POLICY "Users can view own context" ON user_contexts
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own context" ON user_contexts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own context" ON user_contexts
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Políticas para organizations: Los miembros pueden ver organizaciones donde pertenecen
CREATE POLICY "Members can view their organizations" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id::text = auth.uid()::text AND activo = true
        )
    );

-- Políticas para organization_members: Los usuarios pueden ver membresías donde participan
CREATE POLICY "Users can view memberships where they participate" ON organization_members
    FOR SELECT USING (
        user_id::text = auth.uid()::text OR 
        organization_id IN (
            SELECT organization_id FROM organization_members 
            WHERE user_id::text = auth.uid()::text AND activo = true
        )
    );

-- Políticas para notifications: Los usuarios pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Políticas para orders: Los usuarios pueden ver sus propias órdenes
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own orders" ON orders
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Política para newsletter (público)
CREATE POLICY "Anyone can subscribe to newsletter" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- 7. CREAR TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger a todas las tablas que tienen updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_profiles_updated_at BEFORE UPDATE ON organization_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON organization_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at BEFORE UPDATE ON user_roles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_contexts_updated_at BEFORE UPDATE ON user_contexts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON providers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON provider_services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_locations_updated_at BEFORE UPDATE ON provider_locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_provider_documents_updated_at BEFORE UPDATE ON provider_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. CREAR DATOS DE PRUEBA (OPCIONAL)
-- =====================================================

-- Insertar algunos datos de prueba para verificar que todo funciona
INSERT INTO newsletter_subscribers (email, nombre, empresa) VALUES 
    ('test@example.com', 'Usuario de Prueba', 'Empresa Test'),
    ('admin@lynkargo.com', 'Admin Lynkargo', 'Lynkargo');

-- =====================================================
-- SCRIPT COMPLETADO
-- =====================================================

-- Verificar que todas las tablas se crearon correctamente
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Mostrar mensaje de éxito
DO $$
BEGIN
    RAISE NOTICE 'ESTRUCTURA DE BASE DE DATOS RECREADA EXITOSAMENTE';
    RAISE NOTICE 'Todas las tablas, índices, políticas RLS y triggers han sido configurados';
    RAISE NOTICE 'La base de datos está lista para usar con el esquema de Prisma';
END $$;
