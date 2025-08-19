#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 EJECUTANDO SUITE COMPLETA DE TESTS PARA LYNKARGO...\n');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}${colors.bright}=== ${title} ===${colors.reset}\n`);
}

function logSuccess(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️ ${message}${colors.reset}`);
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️ ${message}${colors.reset}`);
}

// Verificar dependencias
function checkDependencies() {
  logSection('VERIFICANDO DEPENDENCIAS');
  
  const requiredPackages = [
    'jest',
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event'
  ];
  
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const installedPackages = Object.keys(packageJson.dependencies || {});
  
  let allInstalled = true;
  
  for (const pkg of requiredPackages) {
    if (installedPackages.includes(pkg)) {
      logSuccess(`${pkg} está instalado`);
    } else {
      logError(`${pkg} NO está instalado`);
      allInstalled = false;
    }
  }
  
  if (!allInstalled) {
    logWarning('Instalando dependencias de testing...');
    try {
      execSync('npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event', { stdio: 'inherit' });
      logSuccess('Dependencias instaladas');
    } catch (error) {
      logError('Error instalando dependencias');
      return false;
    }
  }
  
  return true;
}

// Verificar configuración
function checkConfiguration() {
  logSection('VERIFICANDO CONFIGURACIÓN');
  
  const requiredFiles = [
    'jest.config.js',
    'jest.setup.js',
    'next.config.js'
  ];
  
  let allConfigured = true;
  
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      logSuccess(`${file} existe`);
    } else {
      logError(`${file} NO existe`);
      allConfigured = false;
    }
  }
  
  return allConfigured;
}

// Ejecutar tests de linting
function runLinting() {
  logSection('EJECUTANDO LINTING');
  
  try {
    logInfo('Ejecutando ESLint...');
    execSync('npx eslint src --ext .ts,.tsx --max-warnings 0', { stdio: 'inherit' });
    logSuccess('ESLint completado sin errores');
    return true;
  } catch (error) {
    logError('ESLint encontró errores');
    return false;
  }
}

// Ejecutar tests de TypeScript
function runTypeCheck() {
  logSection('VERIFICANDO TYPESCRIPT');
  
  try {
    logInfo('Verificando tipos de TypeScript...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    logSuccess('TypeScript check completado sin errores');
    return true;
  } catch (error) {
    logError('TypeScript check encontró errores');
    return false;
  }
}

// Ejecutar tests unitarios
function runUnitTests() {
  logSection('EJECUTANDO TESTS UNITARIOS');
  
  try {
    logInfo('Ejecutando Jest...');
    execSync('npm test -- --coverage --watchAll=false', { stdio: 'inherit' });
    logSuccess('Tests unitarios completados');
    return true;
  } catch (error) {
    logError('Tests unitarios fallaron');
    return false;
  }
}

// Ejecutar tests de build
function runBuildTest() {
  logSection('PROBANDO BUILD');
  
  try {
    logInfo('Ejecutando build de producción...');
    execSync('npm run build', { stdio: 'inherit' });
    logSuccess('Build completado exitosamente');
    return true;
  } catch (error) {
    logError('Build falló');
    return false;
  }
}

// Ejecutar tests de performance
function runPerformanceTests() {
  logSection('TESTS DE PERFORMANCE');
  
  try {
    logInfo('Verificando Lighthouse CI...');
    // Aquí podrías ejecutar Lighthouse CI si está configurado
    logWarning('Lighthouse CI no está configurado (opcional)');
    return true;
  } catch (error) {
    logWarning('Tests de performance no disponibles');
    return true;
  }
}

// Ejecutar tests de accesibilidad
function runAccessibilityTests() {
  logSection('TESTS DE ACCESIBILIDAD');
  
  try {
    logInfo('Verificando accesibilidad...');
    // Aquí podrías ejecutar tests de accesibilidad si están configurados
    logWarning('Tests de accesibilidad no están configurados (opcional)');
    return true;
  } catch (error) {
    logWarning('Tests de accesibilidad no disponibles');
    return true;
  }
}

// Generar reporte
function generateReport(results) {
  logSection('REPORTE FINAL');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  console.log(`${colors.bright}RESUMEN DE TESTS:${colors.reset}`);
  console.log(`📊 Total de suites: ${totalTests}`);
  console.log(`✅ Exitosos: ${colors.green}${passedTests}${colors.reset}`);
  console.log(`❌ Fallidos: ${colors.red}${failedTests}${colors.reset}`);
  console.log(`📈 Tasa de éxito: ${Math.round((passedTests / totalTests) * 100)}%`);
  
  console.log(`\n${colors.bright}DETALLES:${colors.reset}`);
  
  Object.entries(results).forEach(([testName, passed]) => {
    if (passed) {
      logSuccess(`${testName}`);
    } else {
      logError(`${testName}`);
    }
  });
  
  if (failedTests === 0) {
    console.log(`\n${colors.green}${colors.bright}🎉 ¡TODOS LOS TESTS PASARON! 🎉${colors.reset}`);
  } else {
    console.log(`\n${colors.red}${colors.bright}⚠️ ${failedTests} TEST(S) FALLARON ⚠️${colors.reset}`);
  }
  
  return failedTests === 0;
}

// Función principal
async function main() {
  try {
    // Verificar que estamos en el directorio correcto
    if (!fs.existsSync('package.json')) {
      logError('No se encontró package.json. Ejecuta este script desde la raíz del proyecto.');
      process.exit(1);
    }
    
    logInfo('Iniciando suite de tests...');
    
    // Verificar dependencias
    if (!checkDependencies()) {
      logError('No se pudieron instalar las dependencias necesarias');
      process.exit(1);
    }
    
    // Verificar configuración
    if (!checkConfiguration()) {
      logError('La configuración no está completa');
      process.exit(1);
    }
    
    // Ejecutar todos los tests
    const results = {
      'Linting': runLinting(),
      'TypeScript Check': runTypeCheck(),
      'Unit Tests': runUnitTests(),
      'Build Test': runBuildTest(),
      'Performance Tests': runPerformanceTests(),
      'Accessibility Tests': runAccessibilityTests()
    };
    
    // Generar reporte
    const allPassed = generateReport(results);
    
    // Salir con código apropiado
    process.exit(allPassed ? 0 : 1);
    
  } catch (error) {
    logError(`Error inesperado: ${error.message}`);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  checkDependencies,
  checkConfiguration,
  runLinting,
  runTypeCheck,
  runUnitTests,
  runBuildTest,
  runPerformanceTests,
  runAccessibilityTests,
  generateReport
};
