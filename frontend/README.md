# Lynkargo - Módulo de Registro

Este es el módulo de registro para la plataforma Lynkargo, desarrollado con React, TypeScript, Vite y Supabase.

## Características

- ✅ Formulario de registro completo
- ✅ Validación de campos en tiempo real
- ✅ Soporte para clientes y proveedores
- ✅ Integración con Supabase Auth
- ✅ Almacenamiento en base de datos
- ✅ Diseño responsive con Tailwind CSS
- ✅ Tipado completo con TypeScript

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```bash
VITE_SUPABASE_URL=tu_url_de_supabase_aqui
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase_aqui
```

### 2. Configurar Supabase

1. Ve a [supabase.com](https://supabase.com) y crea un proyecto
2. Ejecuta el script SQL de `backend/supabase-schema.sql` en el SQL Editor
3. Copia la URL y la clave anónima a tu archivo `.env`

### 3. Instalar Dependencias

```bash
npm install
```

## Desarrollo

### Ejecutar en modo desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Construir para producción

```bash
npm run build
```

### Vista previa de producción

```bash
npm run preview
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── LandingPage.tsx # Página de inicio (redirige al index.html)
│   └── RegistroPage.tsx # Página de registro principal
├── contexts/           # Contextos de React
│   └── SupabaseContext.tsx # Contexto de Supabase
├── types/              # Tipos TypeScript
│   └── index.ts        # Interfaces y tipos
├── App.tsx             # Componente principal con enrutamiento
├── main.tsx            # Punto de entrada
└── index.css           # Estilos globales
```

## Flujo de Registro

1. **Cliente**: Solo requiere nombre, correo y contraseña
2. **Proveedor**: Requiere nombre, correo, contraseña y nombre de empresa
3. Se crea cuenta en Supabase Auth
4. Se insertan datos en la tabla `cuentas`
5. Se envía correo de confirmación
6. Usuario puede verificar su cuenta

## Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript, Vite
- **Estilos**: Tailwind CSS
- **Backend**: Supabase (Auth + Database)
- **Enrutamiento**: React Router DOM
- **Iconos**: Lucide React
- **Estado**: React Context + Hooks

## Notas Importantes

- El módulo está completamente separado del index.html original
- Se mantiene la navegación entre ambas partes
- La autenticación se maneja completamente con Supabase
- El diseño es responsive y accesible
- No se usan emojis ni caracteres especiales en el tipado
