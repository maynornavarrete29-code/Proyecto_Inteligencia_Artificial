param(
    [string]$Root = "BeyondDev"
)

$dirs = @(
    "apps/backend/app/api/v1/endpoints",
    "apps/backend/app/core",
    "apps/backend/app/models",
    "apps/backend/app/schemas",
    "apps/backend/app/services",
    "apps/frontend"
)

Write-Host "Creating root folder: $Root"
if (-not (Test-Path $Root)) { New-Item -ItemType Directory -Path $Root | Out-Null }

foreach ($d in $dirs) {
    $path = Join-Path $Root $d
    if (-not (Test-Path $path)) {
        New-Item -ItemType Directory -Path $path -Force | Out-Null
        Write-Host "Created: $path"
    }
}

# Helper to create files and parent dirs
function Ensure-File($relativePath, $content) {
    $full = Join-Path $Root $relativePath
    $dir = Split-Path $full -Parent
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    Set-Content -Path $full -Value $content -Force -Encoding UTF8
    Write-Host "Wrote: $relativePath"
}

# Create Python package markers (__init__.py)
$pkgPaths = @(
    "apps/backend/app/__init__.py",
    "apps/backend/app/api/__init__.py",
    "apps/backend/app/api/v1/__init__.py",
    "apps/backend/app/api/v1/endpoints/__init__.py",
    "apps/backend/app/core/__init__.py",
    "apps/backend/app/models/__init__.py",
    "apps/backend/app/schemas/__init__.py",
    "apps/backend/app/services/__init__.py"
)
foreach ($p in $pkgPaths) { Ensure-File $p "# package marker" }

# Main backend app entry
$mainPy = @'
from fastapi import FastAPI

app = FastAPI(title="BeyondDev Backend")

@app.get("/")
async def root():
    return {"message": "BeyondDev Backend running"}
'@
Ensure-File "apps/backend/main.py" $mainPy

# Requirements content
$requirements = @'
fastapi
uvicorn[standard]
sqlalchemy
pyodbc
pydantic
pydantic-settings
python-dotenv
'@
Ensure-File "apps/backend/requirements.txt" $requirements

# .env example
$envExample = @'
# Example environment variables for BeyondDev backend
DATABASE_URL="mssql+pyodbc://<user>:<password>@<server>/<database>?driver=ODBC+Driver+17+for+SQL+Server"
SECRET_KEY="change-me"
ENV="development"
'@
Ensure-File "apps/backend/.env.example" $envExample

# Frontend placeholder
$frontendReadme = @'
Frontend application (Next.js 14 App Router, Tailwind, Shadcn UI, Framer Motion)
Create the Next.js app inside this folder when ready.
'@
Ensure-File "apps/frontend/README.md" $frontendReadme

# Root README
$rootReadme = @'
# BeyondDev Monorepo

Monorepo scaffold for BeyondDev:

- apps/backend: FastAPI backend (Python, SQL Server)
- apps/frontend: Next.js 14 App Router frontend (Tailwind + shadcn UI + Framer Motion)

Run the included PowerShell script to recreate this scaffold.
'@
Ensure-File "README.md" $rootReadme

Write-Host "Scaffold complete."
Write-Host "Tip: Run 'python -m venv .venv' inside apps/backend and install requirements with pip."