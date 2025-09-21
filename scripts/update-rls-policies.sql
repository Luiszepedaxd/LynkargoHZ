-- Nuevas políticas RLS para el sistema multiusuario
-- Ejecutar DESPUÉS de la migración de datos

-- 1. Habilitar RLS en todas las nuevas tablas
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- 2. Políticas para organizations
CREATE POLICY "Users can view their organizations" ON organizations
    FOR SELECT USING (
        id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their organizations" ON organizations
    FOR UPDATE USING (
        id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('OWNER', 'ADMIN')
        )
    );

-- 3. Políticas para organization_members
CREATE POLICY "Users can view organization members" ON organization_members
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can invite members" ON organization_members
    FOR INSERT WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('OWNER', 'ADMIN')
        )
    );

CREATE POLICY "Admins can update member roles" ON organization_members
    FOR UPDATE USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('OWNER', 'ADMIN')
        )
    );

-- 4. Políticas para organization_profiles
CREATE POLICY "Users can view organization profiles" ON organization_profiles
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update organization profiles" ON organization_profiles
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid() 
            AND role IN ('OWNER', 'ADMIN')
        )
    );

-- 5. Actualizar políticas existentes para providers y orders
-- (Asumiendo que ya tienes políticas para estas tablas)

-- Para providers - agregar restricción por organización
DROP POLICY IF EXISTS "Users can manage providers" ON providers;
CREATE POLICY "Users can manage providers" ON providers
    FOR ALL USING (
        organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

-- Para orders - agregar restricción por organización
DROP POLICY IF EXISTS "Users can manage orders" ON orders;
CREATE POLICY "Users can manage orders" ON orders
    FOR ALL USING (
        (user_id = auth.uid()) OR 
        (organization_id IN (
            SELECT organization_id 
            FROM organization_members 
            WHERE user_id = auth.uid()
        ))
    );

-- 6. Función helper para obtener el rol del usuario en una organización
CREATE OR REPLACE FUNCTION get_user_organization_role(org_id uuid)
RETURNS text AS $$
BEGIN
    RETURN (
        SELECT role::text 
        FROM organization_members 
        WHERE organization_id = org_id 
        AND user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
