# Auditoria de duplicidade dos devocionais

**Data da análise:** 5 de setembro de 2026  
**Catálogo analisado:** `shared/devotionals.ts`  
**Itens analisados:** 365 devocionais

## Conclusão executiva

Não foram identificados devocionais inteiramente duplicados. Os 365 registros possuem números de dia únicos, títulos únicos, referências bíblicas únicas, reflexões completas únicas, perguntas diárias únicas e orações únicas após normalização de acentos, capitalização e espaços.

Entretanto, o catálogo contém **blocos editoriais repetidos em escala**. Cinco parágrafos aparecem em 364 dos 365 devocionais. Outros oito parágrafos introdutórios aparecem em grupos de 91 devocionais. Portanto, a conclusão correta é: **não há duplicação integral de itens, mas há forte repetição de template dentro das reflexões**.

## Resultados quantitativos

| Verificação | Resultado |
|---|---:|
| Devocionais analisados | 365 |
| Números de dia únicos | Sim |
| Grupos de títulos exatamente duplicados | 0 |
| Grupos de referências bíblicas exatamente duplicadas | 0 |
| Grupos de reflexões exatamente duplicadas | 0 |
| Grupos de perguntas exatamente duplicadas | 0 |
| Grupos de orações exatamente duplicadas | 0 |
| Parágrafos totais das reflexões | 3.283 |
| Parágrafos distintos após normalização | 748 |
| Grupos de parágrafos repetidos | 13 |
| Devocionais com parágrafo repetido dentro do próprio item | 0 |

## Conteúdo repetido identificado

Cinco parágrafos aparecem em **364 devocionais**. Eles correspondem ao corpo operacional e pastoral comum da série, incluindo orientação para aplicação prática, relacionamentos, presença de Deus, valores, cultura e provisão.

Os outros oito parágrafos repetidos aparecem em **91 devocionais cada**. Eles funcionam como aberturas editoriais organizadas em ciclos de quatro dias. Os grupos incluem variações como “Todo negócio traz situações...”, “O desafio nem sempre é falta de informação...”, “Em uma rotina cheia...” e “Há dias em que o empreendedor...”.

Esses blocos não constituem duplicatas integrais porque são combinados com títulos, referências, temas, perguntas, ações práticas, orações e trechos específicos diferentes. Contudo, a repetição de cinco parágrafos em praticamente todo o catálogo reduz a percepção de variedade para o usuário final.

## Interpretação

A biblioteca é **estruturalmente única**, mas **editorialmente muito padronizada**. A repetição não aparece como cópia acidental de um devocional completo. Ela aparece como um molde de produção reutilizado em larga escala.

A comparação por similaridade lexical entre reflexões completas não é adequada como único critério neste caso. Como grande parte do texto é intencionalmente compartilhada, esse método classifica muitos pares como altamente semelhantes mesmo quando o parágrafo temático é diferente. Por esse motivo, a auditoria separou duplicação exata de repetição de parágrafos.

## Recomendação editorial

Antes de publicar a biblioteca como uma experiência premium de 365 dias, recomendo revisar os cinco parágrafos comuns. Eles podem ser substituídos por versões alternadas, contextualizadas por jornada ou reduzidas a uma orientação curta. Também recomendo variar as aberturas dos ciclos de 91 itens.

A prioridade mais importante é remover ou reescrever os cinco parágrafos presentes em 364 entradas. Essa alteração preservaria a estrutura do produto, mas aumentaria significativamente a sensação de conteúdo original em cada dia.

## Arquivos de auditoria

A análise foi reproduzida por scripts determinísticos que verificam normalização, igualdade exata, repetição de parágrafos e similaridade lexical. Os resultados brutos foram gravados em `duplicate-audit.json` e `duplicate-audit-specific.json` durante a execução.

## Referências

[1]: `shared/devotionals.ts` "Catálogo editorial interno dos 365 devocionais"
[2]: `scripts/audit-duplicate-devotionals.mjs` "Auditoria de duplicidade exata e similaridade lexical"
[3]: `scripts/report-duplicate-structure.mjs` "Auditoria de repetição estrutural por parágrafos"
