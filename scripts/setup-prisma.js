#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Configurando Prisma para Lynkargo...\n');

try {
  // Verificar si Prisma está instalado
  console.log('📦 Verificando instalación de Prisma...');
  execSync('npx prisma --version', { stdio: 'inherit' });
  
  // Generar cliente de Prisma
  console.log('\n🔧 Generando cliente de Prisma...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  console.log('\n✅ Cliente de Prisma generado exitosamente!');
  
  // Verificar si existe .env.local
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.log('\n⚠️  Archivo .env.local no encontrado.');
    console.log('📝 Crea el archivo .env.local con la siguiente configuración:');
    console.log('\n# Supabase');
    console.log('NEXT_PUBLIC_SUPABASE_URL=https://eddhbaovqdecryoanmik.supabase.co');
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVkZGhiYW92cWRlY3J5b2FubWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDY5NTYsImV4cCI6MjA3MDg4Mjk1Nn0.4YATckHCgRmXeJY-m9HmH2swybq5rhggFM2J9KSI2g0');
    console.log('\n# Database (Prisma)');
    console.log('DATABASE_URL="postgresql://postgres.eddhbaovqdecryoanmik:tu_password_aqui@aws-0-us-west-1.pooler.supabase.com:6543/postgres"');
    console.log('\n💡 Obtén la DATABASE_URL desde tu dashboard de Supabase > Settings > Database');
  } else {
    console.log('\n✅ Archivo .env.local encontrado');
  }
  
  console.log('\n🎯 Próximos pasos:');
  console.log('1. Configura la DATABASE_URL en .env.local');
  console.log('2. Ejecuta: npx prisma db push (para crear las tablas)');
  console.log('3. Reinicia el servidor de desarrollo');
  
} catch (error) {
  console.error('\n❌ Error configurando Prisma:', error.message);
  console.log('\n💡 Asegúrate de que Prisma esté instalado: npm install prisma @prisma/client');
}
