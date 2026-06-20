# Calculadora Fiscal Brasil

![Next.js](https://img.shields.io/badge/Next.js-15-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC)
![PM2](https://img.shields.io/badge/PM2-Deploy-2B037A)

A **Calculadora Fiscal Brasil** é uma aplicação web para simulação e conferência de cálculos fiscais brasileiros, com memória de cálculo detalhada, home em SEO e rotas dedicadas para os principais tributos.

> Ferramenta com finalidade informativa, educacional e de apoio à conferência fiscal.

## Preview

> Espaço reservado para screenshot da home e da calculadora.

## Funcionalidades

- Cálculo de ICMS próprio
- Cálculo de ICMS-ST
- Cálculo combinado de ICMS + ICMS-ST
- Cálculo de IPI
- Cálculo de PIS/COFINS
- Cálculo de DIFAL
- Cálculo de FCP
- Cálculo de IBS/CBS
- Memória de cálculo detalhada
- Fórmulas com valores substituídos
- Dados utilizados no cálculo em formato organizado
- Botão para copiar memória de cálculo
- Botão para compartilhar cálculo fiscal
- Exemplos prontos para preenchimento automático
- Seção "Entenda o cálculo" dinâmica por modalidade
- Home com foco em SEO
- Rotas específicas para cada cálculo
- Topbar sticky discreta
- Logo e favicon personalizados
- Layout responsivo para desktop e mobile
- Script de deploy com PM2

## Cálculos

| Cálculo | Disponibilidade | Observação |
| --- | --- | --- |
| ICMS próprio | Rota dedicada | Base da operação, alíquota e memória de cálculo |
| ICMS-ST | Rota dedicada | Simulação de substituição tributária |
| ICMS + ICMS-ST | Modo interno | Disponível no seletor da calculadora |
| IPI | Rota dedicada | Cálculo simples com base e alíquota |
| PIS/COFINS | Rota dedicada | Simulação com créditos e valor a recolher |
| DIFAL | Rota dedicada | Alíquotas de origem, destino e FCP |
| FCP | Rota dedicada | Fundo de Combate à Pobreza |
| IBS/CBS | Rota dedicada | Simulação dos novos tributos da Reforma Tributária |

As fórmulas detalhadas e os valores substituídos aparecem diretamente na memória de cálculo da aplicação.

## Rotas SEO

A home canônica é `/pt/calculadora-fiscal`. A rota raiz `/` redireciona para ela.

| Rota | Papel |
| --- | --- |
| `/pt/calculadora-fiscal` | Home principal e canônica |
| `/pt/calculadora-icms` | Calculadora de ICMS |
| `/pt/calculadora-icms-st` | Calculadora de ICMS-ST |
| `/pt/calculadora-ipi` | Calculadora de IPI |
| `/pt/calculadora-pis-cofins` | Calculadora de PIS/COFINS |
| `/pt/calculadora-difal` | Calculadora de DIFAL |
| `/pt/calculadora-fcp` | Calculadora de FCP |
| `/pt/calculadora-ibs-cbs` | Calculadora de IBS/CBS |

## Tecnologias

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- PM2 para produção
- Node.js 18.18+ recomendado

## Rodar

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Por padrão, o projeto usa a porta definida em `.env.local` via `PORT`.
No estado atual, o valor de referência local é `3000`.

Acesso local:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

O comando `start` também lê o `PORT` do ambiente.

## Deploy

O projeto possui deploy via script e PM2.

```bash
chmod +x deploy.sh
./deploy.sh
```

O script executa:

- validação do repositório Git
- `git pull`
- instalação de dependências
- build de produção
- restart via PM2
- salvamento do processo PM2
- status final e logs recentes

Configuração PM2 principal:

- nome do processo: `calculadora-fiscal-brasil`
- porta de produção: `3011`
- arquivo: `ecosystem.config.js`

## Estrutura

```txt
.
├── deploy.sh
├── ecosystem.config.js
├── package.json
├── package-lock.json
├── public/
│   └── brand/
├── scripts/
│   └── next-with-env.mjs
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   ├── manifest.ts
    │   ├── page.tsx
    │   ├── robots.ts
    │   ├── sitemap.ts
    │   └── pt/[slug]/page.tsx
    ├── components/
    │   ├── icms/
    │   └── site/
    └── lib/
        ├── fiscal/
        ├── icms/
        ├── seo/
        ├── site/
        └── utils/
```

## Organização

- `src/lib/fiscal/` concentra a camada fiscal atual com múltiplos modos de cálculo.
- `src/lib/icms/` preserva o núcleo validado de ICMS.
- `src/components/icms/` contém a interface da calculadora, resultados, exemplos e explicações.
- `src/components/site/` concentra home, topbar e FAQ.
- `src/lib/seo/calculatorRoutes.ts` centraliza as rotas, titles, descriptions e metadados SEO.
- `src/lib/site/` armazena conteúdo de marca, texto da home e URLs absolutas.
- `public/brand/` concentra a logo horizontal, o favicon e os ícones derivados.
- `src/lib/utils/` reúne formatadores e utilitários simples.
- `scripts/next-with-env.mjs` carrega `.env.local` antes de iniciar o Next.js.

## Aviso

A **Calculadora Fiscal Brasil** tem finalidade informativa, educacional e de apoio à conferência.

Antes de tomar decisões fiscais ou emitir documentos, confira sempre:

- NF-e
- NCM
- CEST
- CST
- CSOSN
- CFOP
- regime tributário
- alíquotas aplicáveis
- benefícios fiscais
- convênios
- protocolos
- legislação vigente da UF

A ferramenta não substitui contador, consultor tributário ou validação oficial.

## Roadmap

- Consulta automática de alíquotas por UF
- Base de NCM
- Base de CEST
- Validador de XML NF-e
- Importação de dados de NF-e
- Exportação da memória em PDF
- Histórico de cálculos
- Compartilhamento por link
- Artigos de SEO fiscal
- PWA
- Modo escuro
- Testes unitários das fórmulas

## Testes

- Abrir `/pt/calculadora-fiscal` e validar hero, cards, FAQ e topbar sticky.
- Testar os links internos de Cálculos, Calculadora e FAQ.
- Validar o cálculo de ICMS próprio com diferentes bases e alíquotas.
- Validar ICMS-ST com MVA, IPI e base ST.
- Validar PIS/COFINS com créditos e limite mínimo em zero.
- Validar DIFAL e FCP em cenários de operação interestadual.
- Validar IBS/CBS com redução de base e créditos.
- Conferir os botões de copiar e compartilhar cálculo fiscal.
- Rodar `npm run typecheck`.
- Rodar `npm run build`.
- Conferir responsividade no mobile sem barra horizontal.

## Tags

Tags sugeridas para evolução do projeto:

- `v1.1.0-home-seo`
- `v1.2.0-branding-icons`
- `v1.3.0-deploy-pm2`
- `v1.4.0-fiscal-memory`

## Licença

Todos os direitos reservados.

## Autor

Desenvolvido por Caio Rodrigo.
