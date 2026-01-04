# 🔒 Política de Seguridad

## 🛡️ Versiones Soportadas

Actualmente mantenemos seguridad para las siguientes versiones:

| Versión | Soportada          |
| ------- | ------------------ |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |

## 🚨 Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad, **NO** abras un issue público. En su lugar, sigue estos pasos:

### Proceso de Reporte

1. **Envía un email** a los mantenedores del proyecto con:
   - Descripción detallada de la vulnerabilidad
   - Pasos para reproducir
   - Impacto potencial
   - Sugerencias de mitigación (si las tienes)

2. **Espera respuesta** - Te responderemos en un plazo de 48 horas

3. **Coordinación** - Trabajaremos contigo para:
   - Confirmar la vulnerabilidad
   - Desarrollar un fix
   - Coordinar la divulgación

### Qué NO hacer

- ❌ No publiques la vulnerabilidad públicamente
- ❌ No crees un issue público
- ❌ No compartas detalles en discusiones públicas

### Qué SÍ hacer

- ✅ Reporta de forma privada
- ✅ Proporciona información detallada
- ✅ Sé paciente mientras investigamos

## 🔍 Áreas de Seguridad Críticas

Estamos especialmente interesados en vulnerabilidades relacionadas con:

- **Autenticación y Autorización**
  - Bypass de autenticación
  - Escalación de privilegios
  - Tokens JWT comprometidos

- **Gestión de Datos**
  - Inyección SQL
  - Exposición de datos sensibles
  - Acceso no autorizado a archivos

- **Comunicación**
  - Vulnerabilidades en WebSockets
  - Exposición de información en chat
  - Interceptación de mensajes

- **APIs**
  - Rate limiting insuficiente
  - Validación de entrada insuficiente
  - CORS mal configurado

## ✅ Buenas Prácticas de Seguridad

### Para Desarrolladores

- Nunca commitees credenciales o secretos
- Usa variables de entorno para configuración sensible
- Valida y sanitiza todas las entradas del usuario
- Usa parámetros preparados para consultas SQL
- Implementa rate limiting en endpoints sensibles
- Mantén las dependencias actualizadas

### Para Usuarios

- Usa contraseñas fuertes y únicas
- No compartas tus credenciales
- Reporta comportamientos sospechosos
- Mantén tu navegador actualizado

## 🔄 Proceso de Divulgación

1. **Reporte privado** recibido
2. **Confirmación** de la vulnerabilidad
3. **Desarrollo** del fix
4. **Testing** del fix
5. **Release** de la versión corregida
6. **Divulgación pública** (después del fix)

## 📧 Contacto

Para reportar vulnerabilidades de seguridad, contacta a:

- **Email:** [tu-email@ejemplo.com]
- **Asunto:** `[SECURITY] Descripción breve`

## 🙏 Reconocimientos

Agradecemos a todos los que reportan vulnerabilidades de forma responsable. Los investigadores de seguridad serán reconocidos (si lo desean) en:

- Release notes
- Documentación de seguridad
- README del proyecto

## 📚 Recursos Adicionales

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [Guía de Seguridad de FastAPI](https://fastapi.tiangolo.com/tutorial/security/)

---

**Última actualización:** 2024


