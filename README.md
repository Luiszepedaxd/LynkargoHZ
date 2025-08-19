# 🚀 Lynkargo - Plataforma Logística B2B

**Plataforma moderna desarrollada con Next.js + TypeScript que conecta empresas con necesidades logísticas con proveedores especializados.**

## 🏗️ **Stack Tecnológico**

### **Frontend**
- ✅ **Next.js 15.4.7** con App Router
- ✅ **TypeScript 5** para type safety
- ✅ **Tailwind CSS 4** para estilos modernos
- ✅ **React Hook Form 7.53** para formularios robustos
- ✅ **Zustand 5.0** para estado global

### **Backend**
- ✅ **Supabase** (PostgreSQL + Auth + Real-time + Storage)
- ✅ **Prisma 6.1** como ORM
- ✅ **Next.js API Routes** para lógica de negocio
- ✅ **Zod 3.24** para validación de datos

### **Testing & Quality**
- ✅ **Jest 29.7** para testing unitario
- ✅ **React Testing Library** para testing de componentes
- ✅ **ESLint** para calidad de código
- ✅ **TypeScript** para verificación de tipos

## 📁 **Estructura del Proyecto**

```
lynkargo/
├── src/
│   ├── app/                    # App Router (Next.js 15)
│   │   ├── layout.tsx         # Layout principal con SEO
│   │   ├── page.tsx           # Página principal
│   │   ├── dashboard/         # Dashboard administrativo
│   │   └── api/               # API Routes
│   │       ├── users/         # Gestión de usuarios
│   │       ├── providers/     # Gestión de proveedores
│   │       ├── orders/        # Gestión de órdenes
│   │       ├── search/        # Búsqueda avanzada
│   │       ├── notifications/ # Sistema de notificaciones
│   │       └── newsletter/    # Newsletter
│   ├── components/             # Componentes React
│   │   ├── Hero.tsx           # Hero section principal
│   │   ├── Header.tsx         # Header con autenticación
│   │   ├── Features.tsx       # Características del servicio
│   │   ├── Footer.tsx         # Footer completo
│   │   ├── Dashboard.tsx      # Dashboard administrativo
│   │   ├── SEO.tsx            # Componente SEO
│   │   └── __tests__/         # Tests de componentes
│   ├── hooks/                  # Custom hooks
│   │   └── useAuth.ts         # Hook de autenticación
│   ├── stores/                 # Zustand stores
│   │   └── authStore.ts       # Store de autenticación
│   ├── lib/                    # Utilidades
│   │   ├── supabase.ts        # Cliente de Supabase
│   │   └── prisma.ts          # Cliente de Prisma
│   └── types/                  # Tipos TypeScript
│       └── index.ts           # Tipos principales
├── prisma/                     # Esquema de base de datos
│   └── schema.prisma          # Modelos de Prisma
├── scripts/                    # Scripts de utilidad
│   ├── test-apis.js           # Testing de APIs
│   ├── run-tests.js           # Suite completa de tests
│   └── setup-prisma.js        # Setup de Prisma
├── sql/                        # Scripts SQL de Supabase
│   ├── supabase-schema.sql    # Schema inicial
│   ├── fix-rls-policies.sql   # Correcciones RLS
│   └── ...                    # Otros scripts
└── public/                     # Assets estáticos
```

## 🚀 **Instalación y Configuración**

### **1. Clonar el repositorio**
```bash
git clone <repository-url>
cd lynkargo
```

### **2. Instalar dependencias**
```bash
npm install
```

### **3. Configurar variables de entorno**
Crea un archivo `.env.local` en la raíz:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima

# Database
DATABASE_URL=postgresql://usuario:contraseña@host:puerto/database
```

### **4. Configurar base de datos**
```bash
# Ejecutar migraciones de Prisma
npx prisma generate
npx prisma db push

# O ejecutar scripts SQL en Supabase
# Ve a sql/ para los scripts de configuración
```

### **5. Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🧪 **Testing**

```bash
# Ejecutar todos los tests
npm test

# Tests en modo watch
npm run test:watch

# Coverage report
npm run test:coverage
```

## 🏗️ **Build y Deploy**

```bash
# Build para producción
npm run build

# Ejecutar en producción
npm start
```

## 🎯 **Funcionalidades Implementadas**

### **✅ Sistema de Autenticación**
- Login/Registro con Supabase
- Gestión de sesiones con Zustand
- Protección de rutas
- Formularios validados con Zod

### **✅ Landing Page Profesional**
- Hero section con newsletter
- Features section responsive
- Footer completo
- Diseño moderno y mobile-first

### **✅ Base de Datos Completa**
- 8 modelos principales con Prisma
- Relaciones complejas entre entidades
- Validaciones y constraints
- Políticas RLS de seguridad

### **✅ APIs RESTful**
- CRUD completo para usuarios
- Gestión de proveedores
- Sistema de órdenes
- Búsqueda avanzada
- Notificaciones en tiempo real

### **✅ Dashboard Administrativo**
- Estadísticas en tiempo real
- Monitoreo de APIs
- Interfaz intuitiva
- Métricas de rendimiento

### **✅ SEO y Performance**
- Meta tags dinámicos
- Open Graph y Twitter Cards
- Structured Data (JSON-LD)
- Optimización de imágenes
- Core Web Vitals

## 📊 **Modelos de Base de Datos**

### **Principales Entidades:**
- **User** - Usuarios del sistema
- **UserProfile** - Perfiles extendidos
- **Provider** - Proveedores logísticos
- **Service** - Servicios ofrecidos
- **Order** - Órdenes de servicio
- **Review** - Calificaciones y reviews
- **Notification** - Sistema de notificaciones
- **NewsletterSubscriber** - Suscriptores

## 🔧 **Scripts Disponibles**

```bash
npm run dev          # Desarrollo con Turbopack
npm run build        # Build para producción
npm run start        # Ejecutar en producción
npm run lint         # Linter de código
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
npm run test:coverage # Coverage report
```

## 📈 **Próximos Pasos**

### **Pendientes de Implementación:**
- [ ] WhatsApp Business API
- [ ] Sistema de pagos
- [ ] Panel de administración avanzado
- [ ] Notificaciones push
- [ ] Integración con APIs de terceros

## 🤝 **Contribuir**

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 **Licencia**

Este proyecto es privado y confidencial.

## 📞 **Soporte**

Para soporte técnico, revisa:
1. La documentación en `/sql/INSTRUCCIONES-CORRECCION.md`
2. Los archivos de migración en `/MIGRACION-COMPLETADA.md`
3. Los logs de la aplicación
4. La consola del navegador para errores frontend

---

**Estado del Proyecto: ✅ Migración completada al 100%**
**Última actualización: $(date)**