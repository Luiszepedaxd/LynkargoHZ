import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email')
export const passwordSchema = z.string().min(6, 'Password must be at least 6 characters')
export const nameSchema = z.string().min(2, 'Name must be at least 2 characters')
export const optionalStringSchema = z.string().optional()
export const positiveNumberSchema = z.number().positive('Must be a positive number')
export const urlSchema = z.string().url('Invalid URL').optional().or(z.literal(''))

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema
})

export const registerSchema = z.object({
  nombre: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  telefono: optionalStringSchema,
  initialRole: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN'], {
    required_error: 'Debe seleccionar un rol inicial'
  })
})

export const newsletterSchema = z.object({
  email: emailSchema,
  nombre: optionalStringSchema,
  empresa: optionalStringSchema
})

export const createUserSchema = z.object({
  email: emailSchema,
  nombre: nameSchema,
  empresa: optionalStringSchema,
  tipo: z.enum(['CLIENTE', 'PROVEEDOR', 'ADMIN']),
  profile: z.object({
    telefono: optionalStringSchema,
    direccion: optionalStringSchema,
    ciudad: optionalStringSchema,
    estado: optionalStringSchema,
    codigoPostal: optionalStringSchema,
    rfc: optionalStringSchema,
    website: urlSchema,
    descripcion: optionalStringSchema,
    logo: optionalStringSchema
  }).optional()
})

export const updateUserSchema = createUserSchema.partial()

// ===== SCHEMAS PARA ORGANIZACIONES =====

export const createOrganizationSchema = z.object({
  nombre: nameSchema,
  tipo: z.enum(['CLIENTE', 'PROVEEDOR', 'MIXTO'], {
    required_error: 'Debe seleccionar el tipo de organización'
  }),
  profile: z.object({
    rfc: optionalStringSchema,
    direccion: optionalStringSchema,
    ciudad: optionalStringSchema,
    estado: optionalStringSchema,
    codigoPostal: optionalStringSchema,
    telefono: optionalStringSchema,
    website: urlSchema,
    descripcion: optionalStringSchema,
    logo: optionalStringSchema
  }).optional()
})

export const inviteMemberSchema = z.object({
  organizationId: z.string().min(1, 'ID de organización requerido'),
  email: emailSchema,
  nombre: nameSchema,
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER'], {
    required_error: 'Debe seleccionar un rol'
  })
})

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid('ID de miembro inválido'),
  role: z.enum(['OWNER', 'ADMIN', 'MANAGER', 'OPERATOR', 'VIEWER'], {
    required_error: 'Debe seleccionar un rol válido'
  })
})

export const createProviderSchema = z.object({
  organizationId: z.string().min(1, 'ID de organización requerido'),
  nombre: nameSchema,
  descripcion: optionalStringSchema,
  servicios: z.array(z.object({
    nombre: nameSchema,
    descripcion: optionalStringSchema,
    precio: positiveNumberSchema.optional(),
    unidad: optionalStringSchema
  })).optional(),
  ubicaciones: z.array(z.object({
    ciudad: nameSchema,
    estado: nameSchema,
    pais: z.string().default('Mexico')
  })).optional(),
  documentos: z.array(z.object({
    tipo: z.enum(['RFC', 'ACTA_CONSTITUTIVA', 'COMPROBANTE_DOMICILIO', 'SEGURO', 'LICENCIA', 'OTRO']),
    nombre: nameSchema,
    url: z.string().url('URL de documento inválida')
  })).optional()
})

export const createOrderSchema = z.object({
  userId: z.string().min(1, 'ID de usuario requerido'),
  organizationId: optionalStringSchema,
  providerId: optionalStringSchema,
  servicio: nameSchema,
  descripcion: optionalStringSchema,
  origen: nameSchema,
  destino: nameSchema,
  peso: positiveNumberSchema.optional(),
  volumen: positiveNumberSchema.optional(),
  precio: positiveNumberSchema.optional(),
  fechaEnvio: z.string().datetime().optional(),
  fechaEntrega: z.string().datetime().optional()
})

// ===== TIPOS TYPESCRIPT =====

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type NewsletterFormData = z.infer<typeof newsletterSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type UpdateUserData = z.infer<typeof updateUserSchema>
export type CreateOrganizationData = z.infer<typeof createOrganizationSchema>
export type InviteMemberData = z.infer<typeof inviteMemberSchema>
export type UpdateMemberRoleData = z.infer<typeof updateMemberRoleSchema>
export type CreateProviderData = z.infer<typeof createProviderSchema>
export type CreateOrderData = z.infer<typeof createOrderSchema>