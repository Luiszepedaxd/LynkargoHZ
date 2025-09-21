-- Script para crear las tablas del sistema de organizaciones
-- Ejecutar este script después de configurar Prisma

-- Crear tipos ENUM
CREATE TYPE "OrganizationType" AS ENUM ('CLIENTE', 'PROVEEDOR', 'MIXTO');
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'MANAGER', 'EMPLOYEE');
CREATE TYPE "UserType" AS ENUM ('CLIENTE', 'PROVEEDOR', 'ADMIN');
CREATE TYPE "DocumentType" AS ENUM ('RFC', 'ACTA_CONSTITUTIVA', 'COMPROBANTE_DOMICILIO', 'SEGURO', 'LICENCIA', 'OTRO');
CREATE TYPE "OrderStatus" AS ENUM ('PENDIENTE', 'CONFIRMADA', 'EN_PROCESO', 'EN_TRANSITO', 'ENTREGADA', 'CANCELADA');
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'SUCCESS', 'WARNING', 'ERROR', 'INVITATION', 'ROLE_CHANGE', 'ORDER_UPDATE');

-- Tabla de organizaciones
CREATE TABLE "organizations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "nombre" TEXT NOT NULL,
    "tipo" "OrganizationType" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles de organizaciones
CREATE TABLE "organization_profiles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL UNIQUE,
    "rfc" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "estado" TEXT,
    "codigoPostal" TEXT,
    "website" TEXT,
    "descripcion" TEXT,
    "logo" TEXT,
    "telefono" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_profiles_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de usuarios (actualizada)
CREATE TABLE IF NOT EXISTS "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "nombre" TEXT NOT NULL,
    "empresa" TEXT,
    "tipo" "UserType" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de perfiles de usuarios
CREATE TABLE "user_profiles" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL UNIQUE,
    "telefono" TEXT,
    "direccion" TEXT,
    "ciudad" TEXT,
    "estado" TEXT,
    "codigoPostal" TEXT,
    "rfc" TEXT,
    "website" TEXT,
    "descripcion" TEXT,
    "logo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de miembros de organizaciones
CREATE TABLE "organization_members" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "organizationId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "MemberRole" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "organization_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organization_members_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "organization_members_organizationId_userId_key" UNIQUE("organizationId", "userId")
);

-- Tabla de proveedores (actualizada)
CREATE TABLE IF NOT EXISTS "providers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "organizationId" UUID,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "providers_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de servicios de proveedores
CREATE TABLE "provider_services" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "providerId" UUID NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DOUBLE PRECISION,
    "unidad" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "provider_services_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de ubicaciones de proveedores
CREATE TABLE "provider_locations" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "providerId" UUID NOT NULL,
    "ciudad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Mexico',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "provider_locations_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de documentos de proveedores
CREATE TABLE "provider_documents" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "providerId" UUID NOT NULL,
    "tipo" "DocumentType" NOT NULL,
    "nombre" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "verificado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "provider_documents_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de órdenes (actualizada)
CREATE TABLE IF NOT EXISTS "orders" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "organizationId" UUID,
    "providerId" UUID,
    "servicio" TEXT NOT NULL,
    "descripcion" TEXT,
    "origen" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "peso" DOUBLE PRECISION,
    "volumen" DOUBLE PRECISION,
    "precio" DOUBLE PRECISION,
    "estado" "OrderStatus" NOT NULL DEFAULT 'PENDIENTE',
    "fechaEnvio" TIMESTAMP(3),
    "fechaEntrega" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "orders_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "orders_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "providers"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tabla de notificaciones (actualizada)
CREATE TABLE IF NOT EXISTS "notifications" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "titulo" TEXT NOT NULL,
    "mensaje" TEXT NOT NULL,
    "tipo" "NotificationType" NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "accionUrl" TEXT,
    "accionTexto" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tabla de suscriptores de newsletter (ya existe)
CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "nombre" TEXT,
    "empresa" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS "organizations_tipo_idx" ON "organizations"("tipo");
CREATE INDEX IF NOT EXISTS "organizations_activo_idx" ON "organizations"("activo");
CREATE INDEX IF NOT EXISTS "organization_members_organizationId_idx" ON "organization_members"("organizationId");
CREATE INDEX IF NOT EXISTS "organization_members_userId_idx" ON "organization_members"("userId");
CREATE INDEX IF NOT EXISTS "organization_members_role_idx" ON "organization_members"("role");
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX IF NOT EXISTS "users_tipo_idx" ON "users"("tipo");
CREATE INDEX IF NOT EXISTS "providers_organizationId_idx" ON "providers"("organizationId");
CREATE INDEX IF NOT EXISTS "orders_userId_idx" ON "orders"("userId");
CREATE INDEX IF NOT EXISTS "orders_organizationId_idx" ON "orders"("organizationId");
CREATE INDEX IF NOT EXISTS "orders_estado_idx" ON "orders"("estado");
CREATE INDEX IF NOT EXISTS "notifications_userId_idx" ON "notifications"("userId");
CREATE INDEX IF NOT EXISTS "notifications_leida_idx" ON "notifications"("leida");

-- Función para actualizar el timestamp updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar automáticamente updatedAt
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON "organizations" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_profiles_updated_at BEFORE UPDATE ON "organization_profiles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_organization_members_updated_at BEFORE UPDATE ON "organization_members" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON "user_profiles" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON "providers" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON "provider_services" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_locations_updated_at BEFORE UPDATE ON "provider_locations" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_provider_documents_updated_at BEFORE UPDATE ON "provider_documents" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON "orders" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON "notifications" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_newsletter_subscribers_updated_at BEFORE UPDATE ON "newsletter_subscribers" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
