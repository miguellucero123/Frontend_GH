# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir al ERP Constructora! Esta guía te ayudará a entender cómo puedes contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo puedo contribuir?](#cómo-puedo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Funcionalidades](#sugerir-funcionalidades)

## 📜 Código de Conducta

Este proyecto se adhiere a un Código de Conducta. Al participar, se espera que mantengas este código. Por favor, reporta comportamientos inaceptables a los mantenedores del proyecto.

## 🎯 ¿Cómo puedo contribuir?

### Reportar Bugs

Antes de reportar un bug:
- Verifica que el bug no haya sido reportado ya en los [Issues](https://github.com/tu-usuario/ERP_Costructora/issues)
- Verifica que el bug aún existe en la última versión

Al reportar un bug, incluye:
- Descripción clara del problema
- Pasos para reproducir
- Comportamiento esperado vs. actual
- Información del entorno (OS, navegador, versión)
- Logs relevantes si están disponibles

### Sugerir Funcionalidades

Las sugerencias de funcionalidades son bienvenidas. Al sugerir:
- Verifica que la funcionalidad no exista ya
- Revisa los issues existentes para evitar duplicados
- Describe claramente el caso de uso y el valor que aporta

### Contribuir con Código

1. **Fork el repositorio**
2. **Crea una rama** desde `develop` (o `main` si no existe `develop`)
   ```bash
   git checkout -b feature/mi-nueva-funcionalidad
   ```
3. **Haz tus cambios** siguiendo los estándares de código
4. **Commit tus cambios** con mensajes descriptivos
   ```bash
   git commit -m "feat: agregar nueva funcionalidad X"
   ```
5. **Push a tu fork**
   ```bash
   git push origin feature/mi-nueva-funcionalidad
   ```
6. **Abre un Pull Request**

## 🔄 Proceso de Desarrollo

### Estructura de Ramas

- `main`: Código de producción estable
- `develop`: Código de desarrollo (rama principal para PRs)
- `feature/*`: Nuevas funcionalidades
- `bugfix/*`: Correcciones de bugs
- `hotfix/*`: Correcciones urgentes para producción

### Convenciones de Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en build, dependencias, etc.

Ejemplo:
```
feat: agregar autenticación con JWT
fix: corregir error en cálculo de presupuesto
docs: actualizar guía de instalación
```

## 📐 Estándares de Código

### Frontend (HTML/JS)

- Usar indentación de 2 espacios
- Nombres de variables en camelCase
- Funciones descriptivas y comentadas cuando sea necesario
- Seguir la arquitectura CSS 7-1 existente

### Frontend (React/TypeScript)

- Usar TypeScript estrictamente
- Componentes funcionales con hooks
- Props tipadas
- Seguir convenciones de React

### Backend (Python)

- Seguir PEP 8
- Usar type hints
- Docstrings en funciones y clases
- Máximo 120 caracteres por línea
- Usar `black` para formateo (configurado en CI)

Ejemplo:
```python
def calcular_presupuesto(proyecto_id: int) -> dict:
    """
    Calcula el presupuesto total de un proyecto.
    
    Args:
        proyecto_id: ID del proyecto
        
    Returns:
        Dict con el presupuesto calculado
    """
    # Código aquí
    pass
```

## 🔍 Proceso de Pull Request

1. **Asegúrate de que tu código:**
   - Sigue los estándares del proyecto
   - Incluye tests si es aplicable
   - Actualiza la documentación si es necesario
   - Pasa todos los tests y linters

2. **Crea un PR descriptivo:**
   - Título claro y descriptivo
   - Descripción detallada de los cambios
   - Referencias a issues relacionados
   - Capturas de pantalla si aplica

3. **Revisión:**
   - Responde a los comentarios de los revisores
   - Haz los cambios solicitados
   - Mantén el PR actualizado con la rama base

## 🧪 Testing

Antes de enviar un PR:
- Ejecuta los tests existentes
- Agrega tests para nuevas funcionalidades
- Verifica que no rompas funcionalidad existente

### Frontend
```bash
npm test  # Si hay tests configurados
npm run lint
```

### Backend
```bash
cd backend
pytest  # Si hay tests configurados
flake8 .
black --check .
```

## 📚 Documentación

- Actualiza la documentación cuando agregues funcionalidades
- Mantén los comentarios en el código actualizados
- Agrega ejemplos de uso cuando sea relevante

## ❓ Preguntas

Si tienes preguntas:
- Abre un [Issue](https://github.com/tu-usuario/ERP_Costructora/issues) con la etiqueta `question`
- O inicia una [Discusión](https://github.com/tu-usuario/ERP_Costructora/discussions)

## 🙏 Reconocimientos

¡Gracias por contribuir al ERP Constructora! Tu ayuda hace que este proyecto sea mejor para todos.


