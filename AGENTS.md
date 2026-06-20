# AGENTS.md

Guia obrigatório para agentes de IA, OpenCode e futuras LLMs que atuarem neste repositório.

## Leitura obrigatória antes de alterar arquivos

Antes de qualquer alteração:

1. Ler `AGENTS.md`.
2. Ler `DESIGN.md` antes de alterar UI, layout, componentes, estilo, hierarquia visual ou experiência mobile.
3. Ler `PROJECT_RULES.md` antes de alterar regras gerais do produto.
4. Ler `FISCAL_RULES.md` antes de alterar cálculos fiscais, memória de cálculo, textos de aviso, exemplos ou campos de formulário relacionados a tributos.
5. Ler `SEO_RULES.md` antes de alterar páginas, metadados, conteúdo, headings, sitemap, robots, links internos, domínio canônico ou `ads.txt`.
6. Ler `ARCHITECTURE.md` antes de alterar estrutura do projeto, pastas, rotas, componentes, utilitários, scripts ou organização do código.
7. Ler `DEPLOY.md` antes de alterar scripts de build, start, PM2 ou fluxo de deploy.

## Regras para agentes

- Não fazer commit automaticamente.
- Não remover conteúdo sem justificar claramente o motivo técnico ou de produto.
- Não simplificar cálculos fiscais sem validação explícita nos arquivos reais do projeto.
- Não alterar textos legais, fiscais ou avisos de responsabilidade de forma irresponsável.
- Não quebrar o SEO já existente.
- Não adicionar dependências desnecessárias.
- Não gerar imagens, logos, favicon, banners ou outros assets sem solicitação explícita.
- Não mexer em domínio, `sitemap.xml`, `robots.txt` ou `ads.txt` sem revisar `SEO_RULES.md`.
- Não presumir regra fiscal universal para ICMS, ICMS-ST, DIFAL, FCP ou reforma tributária.
- Não alterar código funcional quando a demanda for apenas documental.

## Fluxo recomendado

1. Entender a demanda completa.
2. Localizar os arquivos realmente envolvidos.
3. Fazer a alteração mínima, segura e consistente com o padrão existente.
4. Preservar o padrão visual e a linguagem do produto.
5. Testar `build` e `typecheck` quando a alteração afetar código e quando fizer sentido para a tarefa.
6. Explicar objetivamente o que foi alterado.

## Checklist antes de finalizar

- `build` passa, quando houver alteração de código.
- Layout responsivo foi mantido.
- SEO não foi prejudicado.
- Cálculos fiscais não foram alterados indevidamente.
- Textos continuam claros para público brasileiro.
- Nenhum arquivo sensível, segredo ou configuração privada foi exposto.

## Contexto do projeto

- Produto: Calculadora Fiscal Brasil.
- Domínio oficial: `https://calculadorafiscalbrasil.com.br/`.
- Natureza do produto: calculadora fiscal pública, gratuita, orientada a SEO, monetização via AdSense, simplicidade, performance e confiança.
- Versão pública atualmente considerada: `1.0.0`.
