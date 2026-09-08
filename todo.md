# Checklist editorial e técnico

## Concluído nesta entrega

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
- [x] Registrar as fontes consultadas e a ressalva jurisdicional da tradução pública.

## Backlog registrado, fora do escopo desta entrega

Os itens abaixo ficam documentados como evolução futura, sem bloquear esta entrega: conectar o texto integral dos versículos a uma fonte pública versionada após revisão jurídica específica para cada território de comercialização; e gerar narração integral dos dias 8 a 365, além dos sete áudios já publicados.

## Landing page de conversão — concluída

- [x] Publicar a one page na rota `/` e preservar o aplicativo existente em `/dashboard`.
- [x] Implementar narrativa completa de conversão, mockups autorais, jornada, temas, conquistas, posicionamento, FAQ e CTA final.
- [x] Integrar todos os CTAs ao OAuth existente e redirecionar usuários autenticados ao dashboard.
- [x] Criar Termos de Uso e Política de Privacidade sem links quebrados.
- [x] Implementar dark mode, foco visível, skip link, responsividade e menu hamburger.
- [x] Separar o bootstrap público do tRPC/React Query e carregar páginas internas sob demanda.
- [x] Habilitar compressão HTTP e impedir cache de módulos Vite pelo service worker.
- [x] Adicionar testes unitários para estados de CTA e status de autenticação.
- [x] Validar landing, dashboard, âncoras, FAQ, rotas legais, tema e OAuth no preview real.
- [x] Atingir Lighthouse 96/100 em performance desktop e 100/100 em acessibilidade, boas práticas e SEO; no perfil mobile, 64/100 em performance e 100/100 nas demais categorias.

## Animações e microinterações — concluídas

- [x] Adicionar entradas progressivas acionadas por `IntersectionObserver` nos principais blocos e grupos.
- [x] Aplicar stagger limitado a cards, etapas, mockups, conquistas e itens de FAQ.
- [x] Aprimorar hover, brilho, deslocamento de ícone e feedback de press dos botões.
- [x] Animar a abertura do menu mobile e manter foco visível por teclado.
- [x] Respeitar `prefers-reduced-motion` e desativar rolagem suave quando solicitado pelo sistema.
- [x] Validar 16 testes, tipagem, build e comportamento visual em desktop e mobile.
- [x] Manter Lighthouse em 98/100 no desktop e 68/100 no mobile em performance, com 100/100 em acessibilidade, boas práticas e SEO.

## Integração com a aplicação publicada — concluída

- [x] Remover consulta de sessão e OAuth da landing.
- [x] Converter os CTAs em links semânticos para `https://minutopage-hrqkpvou.manus.space/login`.
- [x] Manter navegação institucional e âncoras da própria landing independentes.
- [x] Confirmar 7 links comerciais no desktop e o CTA mobile com destino único para o login da aplicação publicada.
- [x] Confirmar navegação ponta a ponta até a página de login, 12 testes, tipagem e build.
- [x] Confirmar Lighthouse 99/100 no desktop e 77/100 no mobile em performance, com 100/100 em acessibilidade, boas práticas e SEO.
- [x] Centralizar os CTAs na rota de login da URL estável do Manus Space.

## Página de login da aplicação — concluída

- [x] Criar uma página `/login` responsiva e alinhada à identidade visual do produto.
- [x] Iniciar o OAuth Manus somente após ação explícita no botão de entrada.
- [x] Redirecionar sessões já autenticadas diretamente ao dashboard.
- [x] Concluir o callback OAuth em `/dashboard`.
- [x] Validar a rota, o CTA da landing e o início do OAuth no navegador.
- [x] Confirmar o layout anônimo em desktop e mobile, além do redirecionamento de sessões autenticadas.
- [x] Atingir Lighthouse 87/100 em performance e 100/100 em acessibilidade, boas práticas e SEO na rota `/login`.
