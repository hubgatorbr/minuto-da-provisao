# Checklist editorial e técnico

## Concluído

- [x] Regenerar os 365 devocionais a partir do gerador determinístico.
- [x] Criar três ações práticas diferentes para cada devocional, totalizando 1.095 ações únicas.
- [x] Remover parágrafos duplicados e acrescentar um caso empresarial contextual em cada reflexão.
- [x] Preservar títulos, perguntas, orações e referências sem duplicações exatas.
- [x] Migrar a tradução para `ALMEIDA_PUBLIC_DOMAIN`.
- [x] Centralizar metadados de tradução em `shared/bible-translations.ts`.
- [x] Adicionar `catalogRevision` para sincronizar novas edições sem sobrescrever alterações administrativas futuras.
- [x] Aplicar as migrações SQL 0002, 0003 e 0004.
- [x] Atualizar Home, Jornada e leitura do devocional para etiquetas dinâmicas de tradução.
- [x] Executar `pnpm check`, `pnpm test`, `pnpm build` e `git diff --check` com sucesso.
- [x] Acionar o endpoint de produção e confirmar no banco a revisão v4 e a tradução pública.

## Pendências conscientes

- [ ] Conectar futuramente o texto integral dos versículos a uma fonte bíblica pública versionada, caso o produto passe a exibi-lo. Atualmente o catálogo guarda apenas referência e identificador de tradução.
- [ ] Revisar juridicamente a distribuição no território de comercialização escolhido, pois domínio público pode depender da jurisdição e da edição textual utilizada.
- [ ] Gerar uma nova rodada de áudios para os dias 8 a 365, caso o produto queira narração integral de toda a biblioteca.
