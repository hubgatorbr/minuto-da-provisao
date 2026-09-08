# Fluxo de autenticação do Minuto da Provisão

## Arquitetura

O repositório contém uma única aplicação full-stack. A landing pública está em `/`, enquanto a experiência autenticada começa em `/app`. A landing não possui banco, cookies, tokens ou sistema de usuários próprio; seus CTAs apontam para a rota `/login` da aplicação por meio de `getAppUrl()`.

A rota `/login` exibe duas opções explícitas: **Criar minha conta** e **Entrar com Google**. Ambas reutilizam `startLogin()` e o Manus OAuth já configurado; no primeiro acesso o servidor cria o usuário via `upsertUser()`, e nos acessos seguintes o mesmo `openId` entra na conta existente. O callback existente em `/api/oauth/callback` continua sendo a única implementação OAuth: valida o nonce, troca o código, consulta o usuário e cria o cookie de sessão do servidor. O callback redireciona para `/app` após o login. O `redirectUri` é construído no cliente com `window.location.origin`, e nenhum callback OAuth adicional foi criado.

## Rotas

| Rota | Acesso | Finalidade |
|---|---|---|
| `/` | Público | Landing e CTAs de entrada |
| `/login` | Público | Entrar ou criar conta via Manus OAuth |
| `/app` | Protegido | Dashboard diário autenticado |
| `/devocional/:dayNumber` | Protegido | Leitura e conclusão do devocional |
| `/jornada` | Protegido | Progresso e conquistas |
| `/diario` | Protegido | Diário pessoal |
| `/favoritos` | Protegido | Devocionais favoritos |
| `/conquistas` | Protegido | Conquistas do usuário |
| `/perfil` | Protegido | Perfil e preferências |
| `/admin` | Protegido e condicionado ao papel | Administração editorial |

Usuários não autenticados são encaminhados para `/login`. Usuários já autenticados que abrem `/login` são encaminhados para `/app`. O logout continua usando a mutation existente e limpa a sessão no servidor.

## Identidade e segurança

A identidade é o `openId` estável retornado pelo Manus OAuth. A coluna `users.openId` é única e `upsertUser()` usa `onDuplicateKeyUpdate`, evitando duplicação no primeiro login ou em acessos seguintes. Tokens OAuth e tokens de sessão não são persistidos em `localStorage`, `sessionStorage` ou no frontend; o cookie de sessão permanece sob controle do servidor.

## Variáveis de ambiente

A aplicação atual é monolítica, portanto o fallback padrão usa caminhos relativos. Para uma landing hospedada separadamente, configure `VITE_APP_URL` com a origem da aplicação full-stack; os CTAs passarão a usar essa origem. Opcionalmente, `VITE_LANDING_URL` pode ser configurada para que a tela de login retorne à landing externa. As variáveis Manus OAuth já existentes (`VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OAUTH_SERVER_URL` e `JWT_SECRET`) devem permanecer configuradas no projeto full-stack.

Não são necessárias credenciais Google adicionais enquanto o Google estiver disponível no portal Manus OAuth. Se for solicitado um Google OAuth direto, serão necessários `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` e URIs de callback autorizadas; isso seria um segundo fluxo e não foi criado.

## Validação

A implementação deve ser validada com `pnpm check`, `pnpm test` e `pnpm build`. O teste de roteamento cobre redirecionamento de usuários não autenticados, retorno de usuários autenticados e a unicidade de `openId`; o teste existente de logout cobre a limpeza da sessão no servidor.
