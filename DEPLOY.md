# DEPLOY.md

Documentação do deploy da Calculadora Fiscal Brasil.

## Domínio de produção

- `https://calculadorafiscalbrasil.com.br/`

## Base real identificada

### Scripts encontrados em `package.json`

- `npm run dev`: `node ./scripts/next-with-env.mjs dev`
- `npm run build`: `next build`
- `npm run start`: `node ./scripts/next-with-env.mjs start`
- `npm run typecheck`: `tsc --noEmit`

### Scripts e arquivos de deploy encontrados

- `deploy.sh`
- `ecosystem.config.js`
- `scripts/next-with-env.mjs`

## Requisitos

- Git instalado.
- NPM instalado.
- PM2 instalado.
- Repositório Git válido.
- Acesso ao branch de deploy configurado no script.

## Variáveis e parâmetros identificados

No fluxo atual identificado:

- Nome do app PM2: `calculadora-fiscal-brasil`
- Branch de deploy: `main`
- Porta esperada: `3011`
- Ambiente de produção PM2: `NODE_ENV=production`

## Build

Comandos reais identificados:

1. Instala dependências com `npm ci` quando existe `package-lock.json`.
2. Gera build com `npm run build`.

## Deploy

Fluxo real identificado em `deploy.sh`:

1. Valida presença de `git`, `npm` e `pm2`.
2. Verifica se o diretório atual é um repositório Git.
3. Impede deploy com alterações locais não commitadas.
4. Executa `git fetch origin`.
5. Faz `git checkout main`.
6. Executa `git pull --ff-only origin main`.
7. Instala dependências.
8. Gera build de produção.
9. Reinicia a aplicação com `pm2 startOrRestart ecosystem.config.js --env production`.
10. Executa `pm2 save`.
11. Mostra status e logs recentes do app.

## PM2

Arquivo identificado: `ecosystem.config.js`

- App: `calculadora-fiscal-brasil`
- Script: `npm`
- Args: `start`
- Porta: `3011`

## Pós-deploy

Após deploy, validar:

- Status do PM2.
- Logs recentes da aplicação.
- Site acessível no domínio oficial.

## Checklist pós-deploy

- Site abre em produção.
- HTTPS funcionando.
- Home carregando.
- Calculadoras funcionando.
- Sitemap acessível.
- Robots acessível.
- Ads.txt acessível.
- Favicon correto.
- Layout mobile OK.
- Nenhum erro crítico no console.
- Performance aceitável.

## Regras

- Não alterar script de deploy sem necessidade.
- Não expor secrets.
- Não apagar build anterior sem entender o fluxo atual.
- Não alterar domínio sem autorização.
- Não presumir CI/CD inexistente: o fluxo atual identificado é manual com shell script e PM2.
