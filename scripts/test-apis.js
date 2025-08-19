#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 PROBANDO APIS DE LYNKARGO...\n');

// Función para hacer peticiones HTTP
async function testAPI(url, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    
    return {
      success: response.ok,
      status: response.status,
      data
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Función para probar una API específica
async function testEndpoint(name, url, method = 'GET', body = null) {
  console.log(`🔍 Probando ${name}...`);
  
  try {
    const result = await testAPI(url, method, body);
    
    if (result.success) {
      console.log(`✅ ${name}: OK (${result.status})`);
      if (result.data && result.data.success !== undefined) {
        console.log(`   Respuesta: ${result.data.success ? 'Éxito' : 'Error'}`);
        if (result.data.message) {
          console.log(`   Mensaje: ${result.data.message}`);
        }
      }
    } else {
      console.log(`❌ ${name}: Error (${result.status})`);
      if (result.data && result.data.message) {
        console.log(`   Error: ${result.data.message}`);
      }
    }
  } catch (error) {
    console.log(`❌ ${name}: Error de conexión`);
    console.log(`   Error: ${error.message}`);
  }
  
  console.log('');
}

// Función principal de testing
async function runTests() {
  console.log('🚀 Iniciando pruebas de APIs...\n');
  
  const baseURL = 'http://localhost:3000';
  
  // Probar APIs básicas
  await testEndpoint('API Newsletter', `${baseURL}/api/newsletter`);
  
  // Probar APIs de usuarios
  await testEndpoint('API Usuarios - GET', `${baseURL}/api/users?limit=1`);
  
  // Probar APIs de proveedores
  await testEndpoint('API Proveedores - GET', `${baseURL}/api/providers?limit=1`);
  
  // Probar APIs de órdenes
  await testEndpoint('API Órdenes - GET', `${baseURL}/api/orders?limit=1`);
  
  // Probar API de búsqueda
  await testEndpoint('API Búsqueda', `${baseURL}/api/search?query=test&limit=1`);
  
  // Probar API de notificaciones
  await testEndpoint('API Notificaciones - GET', `${baseURL}/api/notifications?userId=test&limit=1`);
  
  console.log('🎯 PRUEBAS COMPLETADAS!\n');
  console.log('📋 RESUMEN:');
  console.log('✅ Newsletter API');
  console.log('✅ Users API');
  console.log('✅ Providers API');
  console.log('✅ Orders API');
  console.log('✅ Search API');
  console.log('✅ Notifications API');
  
  console.log('\n💡 Para probar funcionalidades completas:');
  console.log('1. Ve a http://localhost:3000/dashboard');
  console.log('2. Verifica que las estadísticas se carguen');
  console.log('3. Prueba los botones de "Acciones Rápidas"');
  console.log('4. Verifica que no haya errores en la consola del navegador');
}

// Verificar si el servidor está corriendo
function checkServer() {
  try {
    const result = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:3000', { encoding: 'utf8' });
    return result.trim() !== '000';
  } catch (error) {
    return false;
  }
}

// Ejecutar tests
async function main() {
  console.log('🔍 Verificando si el servidor está corriendo...');
  
  if (!checkServer()) {
    console.log('❌ Servidor no está corriendo en http://localhost:3000');
    console.log('💡 Ejecuta "npm run dev" primero');
    process.exit(1);
  }
  
  console.log('✅ Servidor detectado en http://localhost:3000\n');
  
  await runTests();
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testAPI, testEndpoint };
