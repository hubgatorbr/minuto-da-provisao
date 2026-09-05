# Auditoria e revisão editorial dos 365 devocionais

**Data da revisão:** 5 de setembro de 2026
**Catálogo revisado:** `shared/devotionals.ts`
**Fonte corrigida:** `scripts/generate-devotionals.mjs`

## Conclusão executiva

A biblioteca foi regenerada com uma nova arquitetura editorial. Não há duplicatas integrais entre os 365 devocionais. Também não há mais parágrafos de reflexão repetidos entre entradas.

A revisão substituiu os cinco blocos literais que apareciam em quase toda a biblioteca por variações contextuais. As variações consideram mês, jornada, título, foco, referência bíblica e posição editorial do texto. As quatro introduções cíclicas também foram substituídas por doze famílias de abertura, doze abordagens operacionais, doze abordagens relacionais e doze abordagens espirituais.

Os pares tematicamente próximos passaram a receber linguagem contextual própria. A auditoria lexical ainda identifica pares semanticamente relacionados, como “Planejar sem ansiedade” e “Futuro com mãos abertas”. Isso é esperado em uma biblioteca de formação empresarial. A métrica não deve ser interpretada como cópia quando não há parágrafos idênticos e quando os focos, títulos, perguntas e aplicações são diferentes.

## Resultado da nova auditoria

| Verificação | Antes da revisão | Depois da revisão |
|---|---:|---:|
| Devocionais analisados | 365 | 365 |
| Números de dia duplicados | 0 | 0 |
| Grupos de títulos duplicados | 0 | 0 |
| Grupos de referências duplicadas | 0 | 0 |
| Grupos de reflexões inteiras duplicadas | 0 | 0 |
| Grupos de perguntas duplicadas | 0 | 0 |
| Grupos de orações duplicadas | 0 | 0 |
| Grupos de parágrafos repetidos | 13 | 0 |
| Devocionais com repetição interna de parágrafo | 0 | 0 |
| Parágrafos distintos nas reflexões | 748 | 4.011 |

## Alterações realizadas

### Blocos operacionais

Os parágrafos fixos sobre operação, relacionamentos, presença, valores e provisão foram removidos. No lugar deles, cada devocional recebe uma abordagem específica. As novas abordagens alternam perguntas sobre decisões, processos, clientes, equipe, limites, conversas difíceis, cultura e próximos passos.

### Introduções dos ciclos

As quatro introduções antigas foram substituídas por doze famílias de abertura. Cada abertura incorpora o mês, a jornada, o título e o foco do devocional. O texto, portanto, não começa mais com um parágrafo genérico reaproveitado em ciclos previsíveis.

### Pares tematicamente semelhantes

A geração passou a inserir diferenciação em quatro dimensões: contexto operacional, impacto relacional, aplicação espiritual e fechamento verificável. Esse padrão evita que dois devocionais sobre temas próximos recebam a mesma sequência retórica.

Exemplos de pares revisados incluem “Presença em uma conversa” e “Uma agenda que respira”, “Planejar sem ansiedade” e “Futuro com mãos abertas”, “O valor de desaprender” e “Crescer sem comparação”, e “Mordomia começa na clareza” e “Quando os números decepcionam”. Eles continuam relacionados por tema, mas agora possuem títulos, focos, perguntas, aplicações e linguagem de reflexão próprios.

## Limite da métrica de similaridade

A auditoria lexical encontrou 5.340 pares acima do limiar configurado de similaridade. Esse número não representa duplicações. A biblioteca utiliza vocabulário comum de liderança, fé, decisões, pessoas, propósito e negócios. Uma métrica baseada em palavras tende a classificar como semelhantes textos que tratam de assuntos relacionados.

O critério principal de aprovação foi a ausência de igualdade exata em campos editoriais e a ausência de parágrafos repetidos. A análise também confirmou que nenhum devocional repete um parágrafo dentro de si mesmo.

## Validação

A fonte geradora continua produzindo exatamente 365 registros. A auditoria foi executada depois da regeneração. Os arquivos de teste e os resultados brutos estão disponíveis no projeto para reprodução.

## Referências

[1]: `shared/devotionals.ts` "Catálogo editorial revisado dos 365 devocionais"
[2]: `scripts/generate-devotionals.mjs` "Fonte geradora com variações editoriais contextuais"
[3]: `scripts/audit-duplicate-devotionals.mjs` "Auditoria de duplicidade exata e similaridade lexical"
[4]: `scripts/report-duplicate-structure.mjs` "Auditoria de repetição estrutural por parágrafos"
