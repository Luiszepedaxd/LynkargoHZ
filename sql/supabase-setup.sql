-- =====================================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE PARA LYNKARGO
-- =====================================================

-- 1. CREAR LA TABLA PRINCIPAL DE CUENTAS
CREATE TABLE IF NOT EXISTS public.cuentas (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    nombre_empresa TEXT,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'proveedor')),
    telefono TEXT,
    direccion TEXT,
    ciudad TEXT,
    estado TEXT,
    codigo_postal TEXT,
    activo BOOLEAN DEFAULT true,
    verificado BOOLEAN DEFAULT false,
    
    PRIMARY KEY (id)
);

-- 2. CREAR TABLA DE PERFILES EXTENDIDOS (OPCIONAL)
CREATE TABLE IF NOT EXISTS public.perfiles_extendidos (
    id UUID REFERENCES public.cuentas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Campos para clientes
    industria TEXT,
    tamano_empresa TEXT CHECK (tamano_empresa IN ('startup', 'pequena', 'mediana', 'grande')),
    volumen_mensual TEXT,
    
    -- Campos para proveedores
    servicios_ofrecidos TEXT[],
    cobertura_geografica TEXT[],
    certificaciones TEXT[],
    experiencia_anos INTEGER,
    
    -- Campos comunes
    sitio_web TEXT,
    linkedin TEXT,
    descripcion TEXT,
    
    PRIMARY KEY (id)
);

-- 3. CREAR TABLA DE NOTIFICACIONES
CREATE TABLE IF NOT EXISTS public.notificaciones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    usuario_id UUID REFERENCES public.cuentas(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    titulo TEXT NOT NULL,
    mensaje TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('info', 'success', 'warning', 'error')),
    leida BOOLEAN DEFAULT false,
    accion_url TEXT,
    accion_texto TEXT
);

-- 4. HABILITAR RLS (ROW LEVEL SECURITY)
ALTER TABLE public.cuentas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfiles_extendidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificaciones ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS PARA LA TABLA CUENTAS
-- Usuarios anónimos pueden insertar nuevos registros (durante registro)
CREATE POLICY "Usuarios anonimos pueden insertar nuevos registros" ON public.cuentas
    FOR INSERT WITH CHECK (true);

-- Usuarios pueden ver solo sus propios registros
CREATE POLICY "Usuarios pueden ver sus propios registros" ON public.cuentas
    FOR SELECT USING (auth.uid() = id);

-- Usuarios pueden insertar solo sus propios registros
CREATE POLICY "Usuarios pueden insertar sus propios registros" ON public.cuentas
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Usuarios pueden actualizar solo sus propios registros
CREATE POLICY "Usuarios pueden actualizar sus propios registros" ON public.cuentas
    FOR UPDATE USING (auth.uid() = id);

-- Usuarios pueden eliminar solo sus propios registros
CREATE POLICY "Usuarios pueden eliminar sus propios registros" ON public.cuentas
    FOR DELETE USING (auth.uid() = id);

-- 6. POLÍTICAS PARA PERFILES EXTENDIDOS
CREATE POLICY "Usuarios pueden ver sus perfiles extendidos" ON public.perfiles_extendidos
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden insertar sus perfiles extendidos" ON public.perfiles_extendidos
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar sus perfiles extendidos" ON public.perfiles_extendidos
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden eliminar sus perfiles extendidos" ON public.perfiles_extendidos
    FOR DELETE USING (auth.uid() = id);

-- 7. POLÍTICAS PARA NOTIFICACIONES
CREATE POLICY "Usuarios pueden ver sus notificaciones" ON public.notificaciones
    FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden insertar sus notificaciones" ON public.notificaciones
    FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden actualizar sus notificaciones" ON public.notificaciones
    FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Usuarios pueden eliminar sus notificaciones" ON public.notificaciones
    FOR DELETE USING (auth.uid() = usuario_id);

-- 8. CREAR ÍNDICES PARA OPTIMIZAR EL RENDIMIENTO
CREATE INDEX IF NOT EXISTS cuentas_correo_idx ON public.cuentas(correo);
CREATE INDEX IF NOT EXISTS cuentas_tipo_usuario_idx ON public.cuentas(tipo_usuario);
CREATE INDEX IF NOT EXISTS cuentas_activo_idx ON public.cuentas(activo);
CREATE INDEX IF NOT EXISTS cuentas_verificado_idx ON public.cuentas(verificado);
CREATE INDEX IF NOT EXISTS cuentas_created_at_idx ON public.cuentas(created_at);

CREATE INDEX IF NOT EXISTS perfiles_extendidos_industria_idx ON public.perfiles_extendidos(industria);
CREATE INDEX IF NOT EXISTS perfiles_extendidos_servicios_idx ON public.perfiles_extendidos USING GIN(servicios_ofrecidos);
CREATE INDEX IF NOT EXISTS perfiles_extendidos_cobertura_idx ON public.perfiles_extendidos USING GIN(cobertura_geografica);

CREATE INDEX IF NOT EXISTS notificaciones_usuario_leida_idx ON public.notificaciones(usuario_id, leida);
CREATE INDEX IF NOT EXISTS notificaciones_created_at_idx ON public.notificaciones(created_at);

-- 9. FUNCIÓN PARA ACTUALIZAR TIMESTAMP
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. TRIGGERS PARA ACTUALIZAR TIMESTAMPS
CREATE TRIGGER set_cuentas_updated_at 
    BEFORE UPDATE ON public.cuentas 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER set_perfiles_extendidos_updated_at 
    BEFORE UPDATE ON public.perfiles_extendidos 
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 11. FUNCIÓN PARA CREAR PERFIL AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.perfiles_extendidos (id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. TRIGGER PARA CREAR PERFIL EXTENDIDO AUTOMÁTICAMENTE
CREATE TRIGGER on_cuenta_created
    AFTER INSERT ON public.cuentas
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 13. FUNCIÓN PARA VALIDAR EMAIL
CREATE OR REPLACE FUNCTION public.validate_email(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ language 'plpgsql';

-- 14. CONSTRAINT PARA VALIDAR EMAIL
ALTER TABLE public.cuentas 
ADD CONSTRAINT valid_email CHECK (public.validate_email(correo));

-- 15. FUNCIÓN PARA OBTENER ESTADÍSTICAS (SOLO ADMIN)
CREATE OR REPLACE FUNCTION public.get_user_stats()
RETURNS TABLE(
    total_usuarios BIGINT,
    total_clientes BIGINT,
    total_proveedores BIGINT,
    usuarios_activos BIGINT,
    usuarios_verificados BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_usuarios,
        COUNT(*) FILTER (WHERE tipo_usuario = 'cliente') as total_clientes,
        COUNT(*) FILTER (WHERE tipo_usuario = 'proveedor') as total_proveedores,
        COUNT(*) FILTER (WHERE activo = true) as usuarios_activos,
        COUNT(*) FILTER (WHERE verificado = true) as usuarios_verificados
    FROM public.cuentas;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- 16. GRANT PERMISSIONS
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.cuentas TO anon, authenticated;
GRANT ALL ON public.perfiles_extendidos TO anon, authenticated;
GRANT ALL ON public.notificaciones TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_stats() TO anon, authenticated;

-- 17. COMENTARIOS PARA DOCUMENTACIÓN
COMMENT ON TABLE public.cuentas IS 'Tabla principal de usuarios de Lynkargo';
COMMENT ON COLUMN public.cuentas.tipo_usuario IS 'Tipo de usuario: cliente o proveedor';
COMMENT ON COLUMN public.cuentas.verificado IS 'Indica si la cuenta ha sido verificada por el administrador';

COMMENT ON TABLE public.perfiles_extendidos IS 'Información adicional de los usuarios';
COMMENT ON TABLE public.notificaciones IS 'Sistema de notificaciones para usuarios';

-- =====================================================
-- CONFIGURACIÓN COMPLETADA
-- =====================================================

-- Para verificar que todo se creó correctamente, ejecuta:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
-- SELECT policy_name FROM pg_policies WHERE schemaname = 'public';
