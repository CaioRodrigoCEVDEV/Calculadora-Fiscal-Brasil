# FISCAL_RULES.md

Guia específico para regras fiscais, simulações e memória de cálculo.

## Aviso importante

- A Calculadora Fiscal Brasil é uma ferramenta auxiliar.
- Os resultados são simulações.
- O usuário deve conferir dados fiscais da NF-e, NCM, CEST, legislação da UF e orientação contábil.

## Regras para cálculos

- Não alterar fórmulas sem justificativa.
- Não remover memória de cálculo.
- Não esconder valores usados no cálculo.
- Sempre mostrar os valores substituídos na fórmula quando possível.
- Manter precisão decimal adequada.
- Cuidar de arredondamentos monetários.
- Tratar campos vazios e inválidos.
- Não presumir que um texto explicativo representa a fórmula efetiva sem conferir a implementação real.

## Avisos obrigatórios na interface

- “Confira sempre os dados fiscais da NF-e, NCM, CEST e legislação da UF.”
- “Esta ferramenta é uma simulação e não substitui a orientação de um contador.”

## Calculadoras atuais identificadas no projeto

Foram identificados os seguintes tipos de cálculo e respectivas páginas públicas:

- ICMS próprio.
- ICMS-ST.
- ICMS + ICMS-ST.
- IPI.
- PIS/COFINS.
- DIFAL.
- FCP.
- IBS/CBS.

## Fórmula base comum identificada

Em vários cálculos, a base da operação usada atualmente é:

`Base da operação = Valor do produto + Frete + Seguro + Outras despesas - Desconto`

Os arredondamentos monetários são feitos para centavos.

## Documentação por calculadora

### 1. ICMS próprio

- Nome: ICMS próprio.
- Campos de entrada: valor do produto, frete, seguro, outras despesas, desconto, UF de origem, UF de destino, alíquota de origem.
- Fórmula usada:
- `Base ICMS = Produto + Frete + Seguro + Outras despesas - Desconto`
- `ICMS próprio = Base ICMS x Alíquota de origem`
- `Total estimado = Produto + Frete + Seguro + Outras despesas - Desconto`
- Resultado exibido: total estimado, ICMS próprio e memória de cálculo.
- Observações fiscais: cálculo informativo; benefícios, redução de base, CST, CFOP, regime e regras por UF não são inferidos automaticamente.

### 2. ICMS-ST

- Nome: ICMS-ST.
- Campos de entrada: valor do produto, frete, seguro, outras despesas, desconto, valor do IPI manual, alíquota IPI, UF origem, UF destino, alíquota origem, alíquota interna destino, MVA, redução de base.
- Fórmula usada atualmente:
- `Base ICMS próprio = Produto + Frete + Seguro + Outras despesas - Desconto`
- `ICMS próprio = Base ICMS próprio x Alíquota origem`
- `IPI efetivo = valor manual informado; se vazio/zero, usa Valor do produto x Alíquota IPI; se ambos zerados, usa 0`
- `Base ST antes da MVA = Produto + IPI + Frete + Seguro + Outras despesas - Desconto`
- `Base ICMS-ST = Base ST antes da MVA x (1 + MVA/100)`
- `Base ICMS-ST final = Base ICMS-ST x (1 - Redução/100)` quando houver redução; caso contrário, mantém a base ST.
- `ICMS-ST bruto = Base ICMS-ST final x Alíquota interna destino`
- `ICMS-ST a recolher = max(ICMS-ST bruto - ICMS próprio, 0)`
- `Total estimado = Produto + IPI + Frete + Seguro + Outras despesas - Desconto + ICMS-ST`
- Resultado exibido: total estimado, ICMS próprio usado como dedução, IPI usado no cálculo, ICMS-ST a recolher e memória de cálculo.
- Observações fiscais: a ferramenta não aplica regra universal; ICMS-ST varia por UF, produto, NCM, CEST, protocolos, convênios, benefícios e legislação vigente.

### 3. ICMS + ICMS-ST

- Nome: ICMS + ICMS-ST.
- Campos de entrada: mesmos do ICMS-ST.
- Fórmula usada: mesma base do cálculo de ICMS-ST, com exibição do ICMS próprio como métrica principal em conjunto com ICMS-ST.
- Resultado exibido: total estimado, ICMS próprio, IPI usado no cálculo, ICMS-ST a recolher e memória de cálculo.
- Observações fiscais: comportamento atual reaproveita a mesma lógica base de ICMS-ST.

### 4. IPI

- Nome: IPI.
- Campos de entrada: valor do produto, frete, seguro, outras despesas, desconto, alíquota IPI.
- Fórmula usada atualmente:
- `Base da operação = Produto + Frete + Seguro + Outras despesas - Desconto`
- `IPI = Valor do produto x Alíquota IPI` quando o cálculo efetivo é resolvido sem valor manual.
- Na memória exibida, o texto apresenta `IPI = Base da operação x Alíquota IPI`, mas a implementação efetiva usa `valorProduto x alíquota` ao resolver o IPI automático.
- `Total estimado = Base da operação + IPI`
- Resultado exibido: total estimado, IPI e memória de cálculo.
- Observações fiscais: a incidência de IPI depende de produto, NCM, operação e enquadramento legal.

### 5. PIS/COFINS

- Nome: PIS/COFINS.
- Campos de entrada: valor do produto, frete, seguro, outras despesas, desconto, alíquota PIS, alíquota COFINS, crédito PIS, crédito COFINS.
- Fórmula usada atualmente:
- `Base da operação = Produto + Frete + Seguro + Outras despesas - Desconto`
- `PIS = Base da operação x Alíquota PIS`
- `COFINS = Base da operação x Alíquota COFINS`
- `Total estimado = Base da operação + PIS + COFINS`
- Resultado exibido: total estimado, PIS, COFINS, memória de cálculo e eventual exibição de créditos informados.
- Observações fiscais importantes:
- Os campos `creditoPis` e `creditoCofins` existem, aparecem na memória e nos dados informados, mas não são abatidos do total pela fórmula atual implementada.
- O texto explicativo do produto menciona créditos, mas a regra efetiva do código hoje é apenas exibir os créditos informados, sem subtração do resultado.

### 6. DIFAL

- Nome: DIFAL.
- Campos de entrada: valor do produto, frete, seguro, outras despesas, desconto, UF origem, UF destino, alíquota origem, alíquota interna destino, redução de base, alíquota FCP.
- Fórmula usada atualmente:
- `Base da operação = Produto + Frete + Seguro + Outras despesas - Desconto`
- `ICMS origem = Base da operação x Alíquota origem`
- `ICMS destino = Base da operação x Alíquota interna destino`
- `DIFAL = max(ICMS destino - ICMS origem, 0)`
- `FCP = Base da operação x Alíquota FCP`
- `Total estimado = Base da operação + DIFAL + FCP`
- Resultado exibido: total estimado, ICMS origem, ICMS destino, DIFAL, FCP quando houver, e memória de cálculo.
- Observações fiscais importantes:
- O campo `reducaoBase` existe e aparece na memória, mas não altera a fórmula efetiva do DIFAL na implementação atual.
- O cálculo é simplificado e informativo.

### 7. FCP

- Nome: FCP.
- Campos de entrada: base de cálculo informada no campo `valorProduto` e alíquota FCP.
- Fórmula usada atualmente:
- `FCP = Base informada x Alíquota FCP`
- `Total estimado = Base informada + FCP`
- Resultado exibido: total estimado, FCP e memória de cálculo.
- Observações fiscais: depende de UF, produto, operação e legislação aplicável.

### 8. IBS/CBS

- Nome: IBS/CBS.
- Campos de entrada: valor do produto, frete, seguro, outras despesas, desconto, alíquota IBS, alíquota CBS, crédito IBS, crédito CBS.
- Fórmula usada atualmente:
- `Base da operação = Produto + Frete + Seguro + Outras despesas - Desconto`
- `IBS = Base da operação x Alíquota IBS`
- `CBS = Base da operação x Alíquota CBS`
- `Total estimado = Base da operação + IBS + CBS`
- Resultado exibido: total estimado, IBS, CBS, memória de cálculo e eventual exibição de créditos informados.
- Observações fiscais importantes:
- Os campos `creditoIbs` e `creditoCbs` existem e são exibidos, mas não são abatidos do total na fórmula atual implementada.
- O cálculo é informativo e não deve ser tratado como regra oficial fechada da reforma tributária.

## ICMS

- O cálculo atual de ICMS deve ser considerado exatamente como implementado no código atual.
- Não alterar a fórmula sem validar o impacto em `src/lib/fiscal/calculateFiscal.ts` e `src/lib/icms/calculateIcms.ts`.
- A memória de cálculo do ICMS próprio é parte importante do valor do produto e não deve ser removida.

## ICMS-ST

- O cálculo atual de ICMS-ST deve ser considerado exatamente como implementado no código atual.
- Os campos considerados hoje no cálculo incluem:
- Valor do produto.
- IPI.
- Frete.
- Seguro.
- Outras despesas.
- Desconto.
- MVA.
- Alíquota interna.
- ICMS próprio.
- Não presumir regra universal, pois ICMS-ST varia por UF, produto, NCM, CEST e legislação.

## Boas práticas

Toda nova calculadora fiscal deve ter:

- Fórmula clara.
- Memória de cálculo.
- Exemplo fictício.
- Aviso fiscal.
- Explicação para leigos.
- Conteúdo útil para SEO.
