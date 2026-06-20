# SEO_RULES.md

Guia de SEO da Calculadora Fiscal Brasil.

## Objetivo SEO

- Ranqueamento orgânico no Google para buscas relacionadas a calculadoras fiscais brasileiras.
- Fortalecer a autoridade do domínio `calculadorafiscalbrasil.com.br`.

## Domínio oficial

- `https://calculadorafiscalbrasil.com.br/`

## Regras obrigatórias

- Cada página importante deve ter `title` único.
- Cada página deve ter `meta description` clara.
- Usar `H1` único por página.
- Usar `H2` e `H3` organizados.
- Manter URLs amigáveis.
- Publicar conteúdo útil e original.
- Evitar páginas vazias ou muito curtas.
- Evitar keyword stuffing.
- Manter `sitemap.xml` atualizado.
- Manter `robots.txt` correto.
- Manter `ads.txt` correto para AdSense.

## Estrutura SEO atual identificada

- Metadata global definida em `src/app/layout.tsx`.
- Metadata por rota gerada em `src/app/pt/[slug]/page.tsx`.
- Catálogo de páginas e metadados em `src/lib/seo/calculatorRoutes.ts`.
- Sitemap gerado em `src/app/sitemap.ts`.
- Robots gerado em `src/app/robots.ts`.
- Também existem versões estáticas em `public/sitemap.xml` e `public/robots.txt`.
- `public/ads.txt` existe e está em uso.

## Conteúdo ideal para cada calculadora

- Introdução objetiva.
- Formulário de cálculo.
- Resultado.
- Memória de cálculo.
- Explicação “Entenda o cálculo”.
- Perguntas frequentes.
- Aviso legal/fiscal.
- Links internos para outras calculadoras.

## Schema.org

Quando possível, usar dados estruturados como:

- `WebApplication`
- `FAQPage`
- `BreadcrumbList`
- `Organization`

## Dados estruturados já identificados

- `WebApplication`.
- `BreadcrumbList`.
- `FAQPage` na home principal de calculadora fiscal.

## Cuidados obrigatórios

- Não criar conteúdo enganoso.
- Não prometer substituição de contador.
- Não copiar textos de outros sites.
- Não alterar domínio canônico indevidamente.
- Não bloquear páginas importantes no `robots.txt`.
- Não remover headings ou conteúdo explicativo apenas para “enxugar layout”.

## Regras para páginas e rotas

- Toda página indexável deve manter propósito claro.
- Toda rota pública deve ter texto suficiente para contextualizar o cálculo.
- Não criar rota pública sem utilidade real.
- Não criar slug ruim, genérico ou sem intenção de busca clara.
- Preservar coerência entre H1, title, description e conteúdo.

## AdSense

- Manter páginas com conteúdo útil.
- Evitar excesso de anúncios.
- Preservar boa experiência do usuário.
- Garantir páginas institucionais, se existirem ou forem criadas:
- Política de Privacidade.
- Termos de Uso.
- Contato.
- Sobre.

## Regras críticas para manutenção

- Não mexer em `sitemap.xml`, `robots.txt` ou `ads.txt` sem revisar o impacto no domínio oficial.
- Não remover links internos entre calculadoras sem motivo forte.
- Não trocar o domínio canônico por ambiente temporário, staging ou localhost.
- Ao criar nova calculadora, incluir rota, metadados, conteúdo explicativo e entrada coerente no sitemap.
