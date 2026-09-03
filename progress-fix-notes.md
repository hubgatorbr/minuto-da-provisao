# Correção do progresso

A persistência estava funcionando: a tabela `user_progress` continha os registros concluídos do usuário. O problema visual vinha da tela `Jornada` interpretar o estado antes de a consulta terminar, exibindo temporariamente `0 / 365` e uma grade sem concluídos. Também havia uma diferença conceitual entre o `devotionalId` interno e o `dayNumber` exibido no calendário.

A API agora retorna `completedIds` e `completedDays` separadamente. O dashboard e a jornada usam `completedDays` para os contadores, sequência e grade; a tela do devocional continua usando `completedIds` para verificar o registro interno. As telas aguardam o estado carregar antes de mostrar os contadores e a gravação falha explicitamente se o banco estiver indisponível.
