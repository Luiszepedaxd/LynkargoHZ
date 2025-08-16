-- Crear la tabla cuentas en Supabase
-- Ejecuta este script en el SQL Editor de tu dashboard de Supabase

CREATE TABLE IF NOT EXISTS public.cuentas (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL UNIQUE,
    nombre_empresa TEXT,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('cliente', 'proveedor')),
    activo BOOLEAN DEFAULT true,
    
    PRIMARY KEY (id)
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.cuentas ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo puedan ver y editar sus propios registros
CREATE POLICY "Los usuarios pueden ver sus propios registros" ON public.cuentas
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Los usuarios pueden insertar sus propios registros" ON public.cuentas
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Los usuarios pueden actualizar sus propios registros" ON public.cuentas
    FOR UPDATE USING (auth.uid() = id);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS cuentas_correo_idx ON public.cuentas(correo);
CREATE INDEX IF NOT EXISTS cuentas_tipo_usuario_idx ON public.cuentas(tipo_usuario);
CREATE INDEX IF NOT EXISTS cuentas_activo_idx ON public.cuentas(activo);

-- Función para actualizar el timestamp de updated_at (opcional)
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Agregar columna updated_at si la necesitas
-- ALTER TABLE public.cuentas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Crear trigger para updated_at (opcional)
-- CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.cuentas FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();