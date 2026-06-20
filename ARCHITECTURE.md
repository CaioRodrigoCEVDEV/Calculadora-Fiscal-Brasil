# ARCHITECTURE.md

Documentação da arquitetura atual do projeto.

## Explicação geral

- Este é um projeto web público.
- O foco atual é disponibilizar páginas performáticas para calculadoras fiscais com forte atenção a SEO.
- Os cálculos fiscais são feitos no frontend.
- SEO é parte central da arquitetura, não um detalhe secundário.
- A aplicação prioriza conteúdo público indexável, boa experiência em mobile e páginas específicas por calculadora.

## Base real identificada no projeto

### `package.json`

- Framework principal: Next.js `^15.0.0`.
- UI: React `^19.0.0` e React DOM `^19.0.0`.
- Tipagem: TypeScript `^5.7.3`.
- Estilo: Tailwind CSS `^3.4.17` com PostCSS.
- Formulários e validação: `react-hook-form`, `zod` e `@hookform/resolvers`.

### Scripts identificados

- `npm run dev`: `node ./scripts/next-with-env.mjs dev`
- `npm run build`: `next build`
- `npm run start`: `node ./scripts/next-with-env.mjs start`
- `npm run typecheck`: `tsc --noEmit`

## Estrutura identificada

### Raiz do projeto

- `package.json`: dependências e scripts.
- `next.config.mjs`: configuração do Next.js.
- `tailwind.config.ts`: configuração do Tailwind.
- `postcss.config.mjs`: pipeline CSS.
- `deploy.sh`: deploy manual de produção.
- `ecosystem.config.js`: configuração PM2.
- `scripts/next-with-env.mjs`: wrapper para `dev` e `start`.

### Rotas e páginas

- `src/app/layout.tsx`: layout raiz, metadata global, Open Graph, Twitter, manifest e ícones.
- `src/app/page.tsx`: redireciona `/` para `/pt/calculadora-fiscal`.
- `src/app/pt/[slug]/page.tsx`: rota dinâmica estática das calculadoras públicas.
- `src/app/sitemap.ts`: geração de sitemap no App Router.
- `src/app/robots.ts`: geração de robots no App Router.
- `src/app/manifest.ts`: manifesto web.

### Componentes

- `src/components/site/`: elementos institucionais e de navegação da home.
- `src/components/icms/`: formulário, resultado, explicação e listagem de cálculos.

### Lógica de negócio

- `src/lib/fiscal/`: cálculo fiscal principal, tipos, schemas, memória de cálculo, exemplos e conteúdo explicativo.
- `src/lib/icms/`: implementação legada/reutilizada de ICMS e ICMS-ST.
- `src/lib/seo/`: catálogo de rotas SEO e apoio à indexação.
- `src/lib/site/`: conteúdo institucional, branding e URL base.
- `src/lib/utils/`: formatação monetária, percentual e parsing decimal.

### Estilos

- `src/app/globals.css`: estilos globais mínimos com base Tailwind.

### Arquivos públicos e assets

- `public/brand/`: assets de marca.
- `public/robots.txt`: robots estático.
- `public/sitemap.xml`: sitemap estático.
- `public/ads.txt`: arquivo de autorização do AdSense.

## Rotas públicas identificadas

- `/pt/calculadora-fiscal`
- `/pt/calculadora-icms`
- `/pt/calculadora-icms-st`
- `/pt/calculadora-ipi`
- `/pt/calculadora-pis-cofins`
- `/pt/calculadora-difal`
- `/pt/calculadora-fcp`
- `/pt/calculadora-ibs-cbs`

## Componentização atual

- A home e as páginas de calculadora reutilizam a mesma infraestrutura de rota por slug.
- O componente `IcmsCalculator` atua hoje como container principal da calculadora, mesmo atendendo vários tipos de cálculo além de ICMS.
- `IcmsCalculatorForm` define campos e validação.
- `IcmsResultCard` mostra resultado, resumo, memória de cálculo e ações de copiar/compartilhar.
- `IcmsExplanation` renderiza a seção “Entenda o cálculo”.

## Regras arquiteturais

- Não mover arquivos sem necessidade.
- Não duplicar lógica fiscal.
- Centralizar cálculos reutilizáveis quando fizer sentido.
- Separar UI de lógica de cálculo sempre que possível.
- Manter componentes pequenos e legíveis.
- Evitar acoplamento entre calculadoras.
- Preservar a separação entre conteúdo de site, SEO, cálculo fiscal e utilitários.

## Observações importantes da arquitetura atual

- SEO é controlado tanto por metadata do App Router quanto por arquivos públicos existentes em `public/`.
- O domínio oficial está embutido no comportamento de sitemap, robots e URLs absolutas.
- O projeto já possui estrutura para múltiplas calculadoras públicas, mas reutiliza bastante UI compartilhada.
- A nomenclatura histórica ainda carrega `icms` em parte dos componentes, embora a calculadora hoje cubra mais tributos.

## Performance

- Evitar bibliotecas pesadas.
- Evitar imagens grandes.
- Otimizar assets.
- Priorizar carregamento rápido.
- Não adicionar scripts externos sem necessidade.
- Preservar a estratégia atual de páginas estáticas e conteúdo público altamente indexável.
