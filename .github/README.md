# 📋 Estructura de GitHub - ERP Constructora

Esta carpeta contiene toda la configuración de GitHub para el proyecto ERP Constructora, incluyendo workflows de CI/CD, templates, y configuraciones de seguridad.

## 📁 Estructura

```
.github/
├── workflows/              # GitHub Actions workflows
│   ├── ci-frontend.yml     # CI para frontend (HTML/JS y React)
│   ├── ci-backend.yml      # CI para backend (Python/FastAPI)
│   ├── codeql-analysis.yml # Análisis de seguridad con CodeQL
│   ├── dependency-review.yml # Revisión de dependencias
│   └── release.yml         # Automatización de releases
│
├── ISSUE_TEMPLATE/         # Templates para issues
│   ├── bug_report.md       # Template para reportar bugs
│   ├── feature_request.md  # Template para solicitar funcionalidades
│   └── config.yml          # Configuración de templates
│
├── PULL_REQUEST_TEMPLATE.md # Template para pull requests
├── dependabot.yml          # Configuración de Dependabot
├── FUNDING.yml             # Configuración de financiación (opcional)
└── README.md               # Este archivo
```

## 🔄 Workflows de CI/CD

### CI Frontend (`ci-frontend.yml`)
- **Trigger:** Push/PR en ramas `main` y `develop`
- **Jobs:**
  - `lint-and-test`: Verifica sintaxis HTML/JS, build CSS, valida manifest PWA
  - `react-app-check`: Verifica TypeScript y build de la app React (opcional)

### CI Backend (`ci-backend.yml`)
- **Trigger:** Push/PR en ramas `main` y `develop`
- **Jobs:**
  - `lint-and-test`: Lint con flake8, formateo con black, verificación de sintaxis
  - `security-scan`: Escaneo de seguridad con Bandit y Safety

### CodeQL Analysis (`codeql-analysis.yml`)
- **Trigger:** Push/PR y programado semanalmente
- **Análisis:** JavaScript y Python
- **Propósito:** Detectar vulnerabilidades de seguridad

### Dependency Review (`dependency-review.yml`)
- **Trigger:** Pull requests
- **Propósito:** Revisar dependencias agregadas/modificadas

### Release (`release.yml`)
- **Trigger:** Push de tags `v*`
- **Propósito:** Crear releases automáticamente

## 📝 Templates

### Bug Report
Template estructurado para reportar bugs con:
- Descripción del problema
- Pasos para reproducir
- Comportamiento esperado vs. actual
- Información del entorno
- Logs relevantes

### Feature Request
Template para solicitar nuevas funcionalidades con:
- Descripción de la funcionalidad
- Casos de uso
- Mockups/diseños
- Relación con otras funcionalidades

### Pull Request
Template completo para PRs con:
- Tipo de cambio
- Descripción detallada
- Checklist de verificación
- Referencias a issues

## 🤖 Dependabot

Configurado para:
- **NPM** (raíz y `/app`): Actualizaciones semanales
- **Pip** (`/backend`): Actualizaciones semanales
- **GitHub Actions**: Actualizaciones mensuales

## 🔒 Seguridad

- **CodeQL**: Análisis automático de código
- **Dependency Review**: Revisión de dependencias en PRs
- **Security Scanning**: Bandit y Safety para Python
- **SECURITY.md**: Política de reporte de vulnerabilidades

## 📚 Documentación Relacionada

- [CONTRIBUTING.md](../CONTRIBUTING.md) - Guía de contribución
- [SECURITY.md](../SECURITY.md) - Política de seguridad
- [CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) - Código de conducta

## 🚀 Uso

### Para Desarrolladores

1. **Crear un Issue:**
   - Usa los templates disponibles al crear un nuevo issue
   - Selecciona "Bug report" o "Feature request"

2. **Crear un Pull Request:**
   - El template se llenará automáticamente
   - Completa todos los campos relevantes

3. **CI/CD:**
   - Los workflows se ejecutan automáticamente en push/PR
   - Revisa los resultados en la pestaña "Actions"

### Para Mantenedores

1. **Revisar PRs:**
   - Verificar que los workflows de CI pasen
   - Revisar el dependency review
   - Aprobar cambios de dependencias si es necesario

2. **Releases:**
   - Crear un tag: `git tag v2.1.0`
   - Push el tag: `git push origin v2.1.0`
   - El workflow creará el release automáticamente

3. **Dependabot:**
   - Revisar PRs de dependabot regularmente
   - Aprobar y mergear actualizaciones de seguridad prioritarias

## 🔧 Personalización

### Actualizar Workflows

Los workflows están configurados para ser flexibles:
- Muchos checks son opcionales (`continue-on-error: true`)
- Puedes ajustar las versiones de Node/Python según necesidades
- Agregar más jobs según sea necesario

### Agregar Nuevos Templates

1. Crea un archivo `.md` en `ISSUE_TEMPLATE/`
2. Agrega el frontmatter YAML con metadata
3. Actualiza `config.yml` si es necesario

## 📊 Estado de los Workflows

Puedes ver el estado de los workflows en:
- **Actions tab**: https://github.com/tu-usuario/ERP_Costructora/actions
- **Badges**: Agrega badges al README principal si lo deseas

## 🆘 Troubleshooting

### Workflows fallan
- Revisa los logs en la pestaña Actions
- Verifica que las dependencias estén correctas
- Algunos checks son opcionales y no bloquean el merge

### Dependabot no crea PRs
- Verifica la configuración en `dependabot.yml`
- Asegúrate de que el repositorio tenga habilitado Dependabot en Settings

### CodeQL no encuentra código
- Verifica que los archivos estén en las rutas correctas
- Asegúrate de que el código esté en el repositorio (no gitignored)

---

**Última actualización:** 2024


