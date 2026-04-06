# 📖 ÍNDICE DE ARCHIVOS DEPLOY

Este es un **índice completo** de todos los archivos en la carpeta `Deploy/` con sus propósitos y en qué orden leerlos.

---

## 📚 DOCUMENTACIÓN (LEER EN ESTE ORDEN)

### 1. **README.md** ← COMIENZA AQUÍ
   - 🎯 Guía rápida (60 minutos)
   - 📋 Tabla de archivos
   - ✅ Checklist rápido
   - 💾 Credenciales
   - **Acción:** Leer primero

### 2. **GUIA_DEPLOYMENT_CLOUDWAYS.md** ← PRINCIPAL (LEER COMPLETO)
   - 📖 Guía detallada paso a paso (15 secciones)
   - 🔧 Preparación local
   - 🏗️ Build del proyecto
   - 💾 Base de datos (3 métodos)
   - 📤 Upload por FTP (estructura exacta)
   - ⚙️ Configuración en Cloudways
   - ✅ Testing exhaustivo
   - 🐛 Troubleshooting integrado
   - 🔐 Seguridad post-deploy
   - **Acción:** Leer completamente, seguir paso a paso

### 3. **REFERENCIA_RAPIDA.md** ← CONSUTA DURANTE TRABAJO
   - 🔑 URLs, credenciales
   - 🛠️ Comandos útiles (local + SSH)
   - 📋 Tabla rápida de errores
   - 🧪 Tests
   - **Acción:** Tener abierto mientras trabajas

### 4. **CHECKLIST_DEPLOYMENT.md** ← USA MIENTRAS TRABAJAS
   - ✅ Pre-deploy (local)
   - 📤 Upload FTP
   - 💾 Base de datos
   - 🧪 Testing post-deploy
   - 🔐 Seguridad
   - 🆘 Rollback plan
   - **Acción:** Marcar items mientras los completas

### 5. **TROUBLESHOOTING.md** ← SI ALGO FALLA
   - 🐛 8 problemas comunes explicados
   - 🔍 Diagnóstico para cada uno
   - ✅ Soluciones detalladas
   - 🔧 Comandos SSH útiles
   - **Acción:** Consultar cuando algo no funcione

---

## 🔧 ARCHIVOS DE CONFIGURACIÓN (COPIAR A TU PROYECTO)

### **config_production.php**
   - ⚙️ Configuración para Cloudways
   - 📝 Con credenciales BD incluidas
   - 🔑 Con JWT_SECRET placeholder
   - **Acción:**
     ```bash
     cp Deploy/config_production.php api/config.php
     # Luego editar con tu dominio y JWT_SECRET
     ```

### **.htaccess**
   - 🌐 Apache configuration (mod_rewrite)
   - 📡 API proxy + Frontend Router
   - 🔒 Headers de seguridad
   - ⚡ Cache y compresión
   - **Acción:**
     ```bash
     cp Deploy/.htaccess .htaccess
     # Subir a /public_html/starup/.htaccess
     ```

---

## 💾 SCRIPTS SQL

### **init_data_cloudways.sql**
   - 👤 Crea usuario admin (admin@radar.com / admin123)
   - 📊 Usuario evaluador ejemplo
   - 📋 Formulario de ejemplo
   - 📝 Respuestas de ejemplo
   - **Acción:**
     - Opción A: Importar en PHPMyAdmin (recomendado)
     - Opción B: Copiar + paste en SQL console
     - O, insert manual del admin si prefieres

---

## 🤖 SCRIPTS BASH

### **verify_pre_deploy.sh**
   - ✅ Verifica todo antes de subir
   - 🔍 Node.js, npm, carpetas, archivos
   - 🏗️ Intenta npm run build
   - 📊 Dacolores y resumen
   - **Acción:**
     ```bash
     bash Deploy/verify_pre_deploy.sh
     # Ejecutar ANTES de subir
     ```

---

## 🗂️ ARCHIVOS ANTIGUOS (MANTENER POR REFERENCIA)

Estos archivos pueden ser deduplicados / eliminados si lo deseas:

- **CHECKLIST.md** ← (viejo)
- **ESTRUCTURA_FTP.md**
- **GENERAR_JWT_SECRET.md**
- **POST_DEPLOY.md**
- **config.production.php** ← versión antigua
- **.htaccess.prod** ← versión antigua
- **GUIA_DEPLOY_CLOUDWAYS.md** ← versión anterior

---

## 📋 FLUJO RECOMENDADO

### Día 1: Planificación (5 min)
1. Leer **README.md**
2. Leer **GUIA_DEPLOYMENT_CLOUDWAYS.md** (secciones 1-4)

### Día 2: Ejecución Local (20 min)
1. Ejecutar `bash verify_pre_deploy.sh`
2. Editar `api/config.php` con datos de Cloudways
3. `npm run build`
4. Verificar `dist/` fue creado

### Día 3: Deploy (30 min)
1. Usar **CHECKLIST_DEPLOYMENT.md** como guía
2. Subir por FTP
3. Crear BD + datos iniciales
4. Hacer tests de verificación (en guía)

### Día 4: Post-Deploy (10 min)
1. Cambiar JWT_SECRET
2. Cambiar contraseña admin
3. Cambiar DEBUG_MODE a false
4. Verificar todo funciona

---

## 🔑 RESUMEN DE CREDENCIALES

**Base de Datos:**
```
Host:     localhost
Database: tpwtvzukqe
User:     tpwtvzukqe
Password: kdT8XYz3e6
```

**Admin Inicial:**
```
Email:    admin@radar.com
Password: admin123
```

⚠️ **CAMBIAR DESPUÉS DEL PRIMER LOGIN**

---

## 🆘 ¿DÓNDE ENCONTRAR...?

| Necesito... | Archivo |
|---|---|
| Empezar desde cero | **README.md** |
| Guía completa paso a paso | **GUIA_DEPLOYMENT_CLOUDWAYS.md** |
| Tabla de URLs y comandos | **REFERENCIA_RAPIDA.md** |
| Marcar tareas mientras trabajo | **CHECKLIST_DEPLOYMENT.md** |
| Solucionar un problema | **TROUBLESHOOTING.md** |
| Copiar config para Cloudways | **config_production.php** |
| Copiar .htaccess | **.htaccess** |
| Script para base de datos | **init_data_cloudways.sql** |
| Verificar que todo está listo | **verify_pre_deploy.sh** |

---

## 📊 ESTADÍSTICAS

- **Documentación total:** 6 archivos .md (~50 KB)
- **Scripts:** 1 bash script
- **Archivos de configuración:** 2 (config_production.php, .htaccess)
- **Scripts SQL:** 1
- **Tiempo total de lectura:** 30-45 minutos
- **Tiempo de implementación:** 60 minutos

---

## ✅ ANTES DE EJECUTAR

- [ ] Tengo acceso FTP a Cloudways
- [ ] He leído al menos README.md + GUIA_DEPLOYMENT_CLOUDWAYS.md
- [ ] Tengo credenciales BD: tpwtvzukqe / kdT8XYz3e6
- [ ] Tengo Node.js + npm instalados localmente
- [ ] Proyecto local compila sin errores (`npm run build`)

---

## 🎯 META FINAL

Después de seguir esta guía:

✅ Proyecto desplegado en Cloudways
✅ BD funcionando con usuario admin
✅ Frontend cargando correctamente
✅ API respondiendo sin errores
✅ Seguridad post-deploy implementada
✅ Listo para producción

---

**Versión:** 2.0 (Radar de Proyectos)
**Creado:** 2026-04-06
**Status:** ✅ Completo y listo para usar
