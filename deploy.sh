#!/bin/bash

set -euo pipefail

# chmod +x deploy.sh
# Uso: ./deploy.sh

APP_NAME="calculadora-fiscal-brasil"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BRANCH="main"
PORT="3011"

echo "======================================"
echo "Deploy - Calculadora Fiscal Brasil"
echo "======================================"
echo "Data: $(date '+%d/%m/%Y %H:%M:%S')"
echo "Diretório: $APP_DIR"
echo "Branch: $BRANCH"
echo "Porta: $PORT"
echo

cd "$APP_DIR"

if ! command -v git >/dev/null 2>&1; then
  echo "Erro: git não está instalado ou não está no PATH."
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "Erro: npm não está instalado ou não está no PATH."
  exit 1
fi

if ! command -v pm2 >/dev/null 2>&1; then
  echo "Erro: pm2 não está instalado ou não está no PATH."
  exit 1
fi

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Erro: este diretório não parece ser um repositório Git."
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Erro: há alterações locais não commitadas. Faça commit ou stash antes do deploy."
  exit 1
fi

echo "Status atual do Git:"
git status --short
echo

echo "Atualizando código..."
git fetch origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"
echo

echo "Instalando dependências..."
if [ -f "package-lock.json" ]; then
  npm ci
else
  npm install
fi
echo

echo "Gerando build de produção..."
npm run build
echo

echo "Reiniciando aplicação com PM2..."
pm2 startOrRestart ecosystem.config.js --env production
pm2 save
echo

echo "Status PM2:"
pm2 status "$APP_NAME"
echo

echo "Logs recentes:"
pm2 logs "$APP_NAME" --lines 20 --nostream
echo

echo "Deploy finalizado com sucesso!"
echo "Aplicação: $APP_NAME"
echo "Porta esperada: $PORT"
echo "Diretório: $APP_DIR"
