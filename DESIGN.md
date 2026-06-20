# DESIGN.md

Documentação do padrão visual atual da Calculadora Fiscal Brasil.

## Identidade visual

- Projeto: Calculadora Fiscal Brasil.
- O visual atual é limpo, profissional e confiável.
- A interface transmite aparência de ferramenta fiscal séria, e não de landing page promocional genérica.
- O foco visual está em clareza, leitura fácil, contraste e fluxo de uso objetivo.
- A linguagem visual é brasileira, sóbria e orientada à utilidade prática.

## Diretrizes de UI

- Interface simples e direta.
- Cards com bordas suaves, espaçamento amplo e sombra discreta.
- Botões alinhados e com hierarquia clara entre ação primária e secundária.
- Formulários claros, com labels visíveis, mensagens de erro e campos bem separados.
- Evitar excesso de cores.
- Priorizar contraste e legibilidade.
- Manter abordagem mobile-first.
- Preservar leitura confortável em telas pequenas e grandes.

## Componentes visuais identificados

### Topbar / header

- Header fixo no topo.
- Fundo branco translúcido com blur leve.
- Logo completa no desktop e ícone reduzido no mobile.
- CTA principal para iniciar cálculo.
- Links âncora internos na home e navegação reduzida nas páginas de detalhe.

### Hero da home

- H1 principal com nome do produto.
- Subtítulo e texto introdutório curtos.
- Dois CTAs iniciais: começar cálculo e ver cálculos disponíveis.

### Cards de ferramentas

- Grade de cards para calculadoras disponíveis.
- Cards com borda clara, fundo branco, sombra sutil e hover discreto.
- Título, descrição e CTA textual por card.

### Formulários de cálculo

- Formulário em card branco com seções internas.
- Labels, ajuda contextual e erros em linha.
- Campos ajustados conforme o tipo de cálculo selecionado.
- Exemplos rápidos carregáveis para facilitar simulação.

### Área de resultado

- Card lateral ou abaixo no mobile.
- Bloco escuro de destaque para total estimado.
- Métricas resumidas logo abaixo do total.
- Banners informativos e de aviso quando aplicável.

### Área “Entenda o cálculo”

- Card branco dedicado.
- Conteúdo em acordeão com perguntas e respostas curtas.
- Linguagem explicativa, mas sem perder o tom técnico.

### Footer

- Não foi identificado um footer dedicado no recorte analisado da aplicação.
- Se houver criação futura, deve seguir o mesmo tom sóbrio, leve e institucional.

### Botões de copiar e compartilhar

- Existem botões para copiar memória de cálculo e compartilhar cálculo fiscal.
- Devem continuar visíveis, claros e com feedback de sucesso ou falha.

## Estilo visual atual identificado

- Fundo geral em tons claros (`slate-50`).
- Tipografia escura com alto contraste (`slate-900` e variações).
- Cor de destaque principal em azul (`sky`).
- Cards com cantos arredondados grandes (`rounded-2xl` e `rounded-3xl`).
- Sombras leves, sem excesso de profundidade.
- Microinterações discretas, sem animações pesadas.

## Regras de alteração visual

- Não mudar a identidade visual sem necessidade real.
- Não adicionar animações pesadas.
- Não prejudicar performance.
- Não quebrar mobile.
- Não usar elementos com aparência amadora, chamativa demais ou inconsistente com ferramenta fiscal.
- Manter espaçamentos consistentes.
- Validar sempre em desktop e mobile.
- Preservar a hierarquia entre conteúdo, formulário, resultado e explicação.

## Tom visual

- Fiscal.
- Brasileiro.
- Seguro.
- Simples.
- Confiável.
- Profissional.
