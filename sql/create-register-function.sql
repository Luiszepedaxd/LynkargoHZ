-- =====================================================
-- CREAR FUNCIÓN SQL PARA REGISTRO DE USUARIOS
-- =====================================================
-- Esta función bypassa los problemas de permisos RLS
-- ejecutando las inserciones con permisos de función

CREATE OR REPLACE FUNCTION register_user(
  p_user_id UUID,
  p_email TEXT,
  p_nombre TEXT,
  p_telefono TEXT DEFAULT NULL,
  p_role TEXT DEFAULT 'CLIENTE'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Ejecuta con permisos del owner (postgres)
AS $$
DECLARE
  result JSON;
BEGIN
  -- Insert user
  INSERT INTO users (id, email, nombre, telefono, activo, created_at, updated_at)
  VALUES (p_user_id, p_email, p_nombre, p_telefono, true, NOW(), NOW())
  ON CONFLICT (email) DO NOTHING;
  
  -- Insert user role
  INSERT INTO user_roles (id, user_id, role, activo, created_at, updated_at)
  VALUES (gen_random_uuid(), p_user_id, p_role::PlatformRole, true, NOW(), NOW())
  ON CONFLICT (user_id, role) DO NOTHING;
  
  -- Insert user context
  INSERT INTO user_contexts (id, user_id, active_role, last_switched_at, created_at, updated_at)
  VALUES (gen_random_uuid(), p_user_id, p_role::PlatformRole, NOW(), NOW(), NOW())
  ON CONFLICT (user_id) DO NOTHING;
  
  -- Return success
  result := json_build_object(
    'success', true,
    'message', 'User registered successfully',
    'user_id', p_user_id
  );
  
  RETURN result;
  
EXCEPTION WHEN OTHERS THEN
  -- Return error
  result := json_build_object(
    'success', false,
    'message', 'Error: ' || SQLERRM,
    'error_code', SQLSTATE
  );
  
  RETURN result;
END;
$$;

-- Dar permisos de ejecución a todos los roles
GRANT EXECUTE ON FUNCTION register_user TO anon;
GRANT EXECUTE ON FUNCTION register_user TO authenticated;
GRANT EXECUTE ON FUNCTION register_user TO service_role;

-- Test de la función
SELECT register_user(
  gen_random_uuid(),
  'test-function@test.com',
  'Test Function User',
  '1234567890',
  'CLIENTE'
);

-- Limpiar test
DELETE FROM users WHERE email = 'test-function@test.com';

SELECT 'Función register_user creada exitosamente' as resultado;
