# Entrega da landing page — Minuto da Provisão

## Resultado

A landing page foi implementada como a nova rota pública `/`, enquanto a aplicação já existente permanece disponível em `/dashboard` e nas demais rotas internas. A experiência adota a identidade solicitada de azul profundo, creme e dourado, com tipografia editorial, mockups autorais do produto, narrativa completa de conversão e CTAs integrados ao fluxo de autenticação existente.

A página inclui hero, posicionamento, dores do público, método em cinco etapas, jornada anual, pilares editoriais, quatro mockups de experiência, conquistas, significado da marca, base bíblica, definição de público, explicação de funcionamento, FAQ, CTA final e footer. Termos de Uso e Política de Privacidade foram adicionados como páginas institucionais funcionais.

## Arquitetura e preservação do produto

A landing usa um bootstrap público leve. Os provedores tRPC e React Query e as telas internas são carregados somente quando uma rota do aplicativo é acessada. Um endpoint mínimo `/api/auth/status` informa apenas se existe uma sessão válida; visitantes seguem para o Manus OAuth, enquanto usuários autenticados são encaminhados ao dashboard. A navegação interna foi atualizada para usar `/dashboard`, sem alterar os recursos existentes de devocional, jornada, diário, favoritos, perfil ou administração.

O servidor agora comprime HTML, CSS, JavaScript e JSON com gzip quando aceito pelo cliente. O service worker foi atualizado para não armazenar módulos Vite de desenvolvimento, preservando cache apenas para assets publicados com URLs estáveis. Fontes são carregadas de forma não bloqueante, e as telas internas foram divididas em chunks sob demanda.

## Qualidade verificada

| Verificação | Resultado |
|---|---:|
| Testes unitários Vitest | 14 aprovados em 6 arquivos |
| TypeScript | Sem erros |
| Build de produção | Concluído |
| `git diff --check` | Sem erros |
| Compressão HTTP | `Content-Encoding: gzip` confirmado |
| Lighthouse desktop — Performance | 96/100 |
| Lighthouse desktop — Acessibilidade | 100/100 |
| Lighthouse desktop — Boas práticas | 100/100 |
| Lighthouse desktop — SEO | 100/100 |
| Lighthouse mobile — Performance | 64/100 |
| Lighthouse mobile — Acessibilidade | 100/100 |
| Lighthouse mobile — Boas práticas | 100/100 |
| Lighthouse mobile — SEO | 100/100 |

As métricas foram obtidas na build de produção local com Lighthouse 12.8.2 e variaram entre 96–98 em performance desktop e 64–70 em performance mobile ao longo das repetições. Na auditoria final, o perfil desktop registrou FCP e LCP de 0,7 s, TBT de 160 ms e CLS igual a 0. O perfil mobile simulado registrou FCP de 2,8 s, LCP de 3,2 s, TBT de 1.210 ms e CLS de 0,002. Acessibilidade, boas práticas e SEO permaneceram em 100 em todas as execuções finais.

## Validação funcional no preview

O preview foi verificado em desktop, tablet e mobile. Foram testados o scroll para âncoras, o FAQ, dark mode, Termos, Privacidade, carregamento do dashboard, conteúdo devocional e o CTA principal. Em sessão de visitante, o CTA redirecionou corretamente para `https://manus.im/app-auth` com `appId`, `redirectUri`, `state` e `type=signIn`.

**Preview:** [Minuto da Provisão](https://3000-iwm5dg9becb5uyzedytwf-164f966b.us1.manus.computer/)

## Captura final

A captura final em um contexto automatizado novo carregou a landing corretamente já no primeiro acesso. A migração v3 removeu registros e caches antigos antes do bootstrap, instalou o worker atualizado após o carregamento e eliminou a combinação de módulos Vite de gerações diferentes. O header identificou corretamente uma sessão autenticada como **Meu painel**, confirmando também o caminho direto para `/dashboard`.

A captura final em 390 × 844 px confirmou o header compacto, menu hamburger, headline sem corte, CTA principal em largura confortável, prova rápida e início do mockup sem overflow horizontal. A hierarquia visual e os tamanhos de toque permaneceram adequados ao breakpoint mobile.
