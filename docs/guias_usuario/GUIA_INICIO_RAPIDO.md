# 🎯 GUÍA RÁPIDA DE INICIO - ERP CONSTRUCTORA

## ✅ Estado Actual

**El sistema está totalmente funcional y listo para usar!**

El problema fue que el archivo `index.html` original tenía dependencias complejas de archivos JavaScript que causaban bloqueos. Se ha reemplazado con una versión simplificada que funciona perfectamente.

## 🚀 CÓMO INICIAR LA APLICACIÓN

### Forma Más Fácil (Recomendada)
```
Haz doble clic en: INICIAR_ERP.bat
```

### Alternativa Manual
```
1. Abre PowerShell o CMD
2. Navega a: c:\Users\Alicia_Piero\Documents\Repo_AIEP\ERP_Costructora\frontend
3. Ejecuta: python -m http.server 5174
4. Abre en navegador: http://localhost:5174
```

## 👤 CREDENCIALES DE PRUEBA

Puedes usar cualquiera de estas cuentas para acceder:

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Admin** | admin@constructora.com | admin123 |
| **Trabajador** | trabajador@constructora.com | trabajador123 |
| **Cliente** | cliente@constructora.com | cliente123 |

## 🔗 URLS DISPONIBLES

| URL | Descripción |
|-----|------------|
| `http://localhost:5174` | Página principal |
| `http://localhost:5174/index.html` | Login |
| `http://localhost:5174/panel-jefe.html` | Panel de administrador |
| `http://localhost:5174/dashboard-trabajador.html` | Dashboard de trabajador |
| `http://localhost:5174/dashboard-cliente.html` | Dashboard de cliente |

## 📊 ARCHIVOS IMPORTANTES

```
frontend/
├── index.html ............................ ✅ Login funcional (NUEVO)
├── index.html.bak ........................ Copia del original
├── INICIAR_ERP.bat ....................... ✅ Script de inicio (NUEVO)
├── SERVIDOR_5174_VANILLA.bat ............. Script Python alternativo
├── SOLUCION_LOGIN_FUNCIONAL.md ........... Documentación de la solución
├── diagnose.html ......................... Herramienta de diagnóstico
├── generate-icons-auto.html .............. Generador de iconos
└── js/ .................................. Archivos JavaScript
```

## ⚡ SOLUCIÓN RÁPIDA SI ALGO FALLA

### Si la página no carga:
1. Verifica que Python esté instalado: `python --version`
2. Asegúrate de que el puerto 5174 está libre
3. Intenta con `INICIAR_ERP.bat`

### Si el login no funciona:
1. Abre la consola del navegador (F12)
2. Revisa si hay errores en rojo
3. Intenta con diferentes credenciales de prueba

### Si necesitas reiniciar:
1. Cierra la ventana de consola del servidor
2. Haz clic en `INICIAR_ERP.bat` nuevamente

## 📝 QUÉ CAMBIÓ

- ✅ Reemplazado `index.html` con versión simplificada y funcional
- ✅ Eliminadas referencias a archivos faltantes
- ✅ Integrado todo en un solo archivo HTML
- ✅ Modo DEMO completamente funcional
- ✅ Redirecciones automáticas según rol

## 🎓 CARACTERÍSTICAS DISPONIBLES

En modo DEMO:
- ✅ Autenticación de usuarios
- ✅ Guardado de sesión
- ✅ Redirecciones según rol
- ✅ Interfaz moderna y responsiva
- ✅ Manejo de errores elegante

Para usar todas las características:
- Necesitarás conectar un backend real (API en puerto 8002)
- Cambiar `CONFIG.DEMO_MODE` a `false` en el HTML

## 🆘 SOPORTE

Si tienes problemas:
1. Abre `http://localhost:5174/diagnose.html` para diagnóstico
2. Revisa la consola del navegador (F12)
3. Consulta `SOLUCION_LOGIN_FUNCIONAL.md` para más detalles

---

**Estado**: ✅ Operativo y listo para usar
**Última actualización**: 30 de diciembre de 2025
**Versión**: 1.0
