# AI Project Hub - Deployment Guide

## Paso 1: Crear el repositorio en GitHub

1. Ve a [GitHub](https://github.com) y crea un nuevo repositorio llamado `ai-project-hub`
2. **NO** inicialices con README, .gitignore o licencia (el proyecto ya tiene estos archivos)

## Paso 2: Conectar tu proyecto local con GitHub

Ejecuta estos comandos en la terminal (dentro de la carpeta "The AI Projects Hub App"):

```bash
# Inicializar Git (si no está inicializado)
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit - AI Project Hub Dashboard"

# Conectar con tu repositorio remoto (reemplaza TU_USUARIO con tu nombre de usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/ai-project-hub.git

# Subir el código a GitHub
git branch -M main
git push -u origin main
```

## Paso 3: Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. GitHub detectará automáticamente que es un proyecto Vite y te sugerirá un workflow

**O usa el script de deploy:**

```bash
# Dale permisos de ejecución al script (en Git Bash o WSL)
chmod +x deploy.sh

# Ejecuta el deploy
./deploy.sh
```

## Paso 4: Acceder desde tu iPad

Una vez desplegado, tu dashboard estará disponible en:

```
https://TU_USUARIO.github.io/ai-project-hub/
```

## Actualizar el Dashboard

Cada vez que quieras actualizar los datos:

1. Edita `src/data/status.json`
2. Ejecuta:
   ```bash
   git add .
   git commit -m "Update project status"
   git push
   ./deploy.sh
   ```

---

**Nota:** Si usas Windows y no tienes Git Bash, puedes crear un archivo `deploy.ps1` (PowerShell) en su lugar.
