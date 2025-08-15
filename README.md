# Lynkargo - Despliegue en Vercel

## Pasos para desplegar en Vercel:

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Iniciar sesión en Vercel
```bash
vercel login
```

### 3. Desplegar el proyecto
```bash
vercel --prod
```

### 4. Conectar dominio personalizado

1. Ve a [vercel.com](https://vercel.com) y inicia sesión
2. Selecciona tu proyecto
3. Ve a "Settings" → "Domains"
4. Agrega tu dominio de GoDaddy
5. Vercel te dará registros DNS para configurar

### 5. Configurar DNS en GoDaddy

En tu panel de GoDaddy, agrega estos registros:
- Tipo: CNAME
- Nombre: @
- Valor: cname.vercel-dns.com

O si prefieres usar registros A:
- Tipo: A
- Nombre: @
- Valor: 76.76.19.76

### 6. Verificar dominio

Espera unos minutos y verifica que tu dominio esté funcionando.

## Comandos útiles:
- `vercel dev` - Ejecutar localmente
- `vercel --prod` - Desplegar a producción
- `vercel logs` - Ver logs del sitio
