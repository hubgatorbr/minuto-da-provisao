# Persistência de sessão

No domínio publicado, a autenticação usa o cookie `app_session_id`, configurado como `httpOnly`, `SameSite=Lax`, `Secure` em produção e duração de um ano.

No preview WebDev (`*.manus.computer` ou URL com `from_webdev=1`), o runtime pode disponibilizar um token auxiliar chamado `manus-cookie` em `sessionStorage`. Como esse fallback pode desaparecer ao recarregar ou abrir uma nova aba, o cliente agora mantém uma cópia apenas no `localStorage` do preview e a envia como `Authorization: Bearer`. O logout remove os dois valores. O domínio de produção não grava tokens bearer no `localStorage`.
