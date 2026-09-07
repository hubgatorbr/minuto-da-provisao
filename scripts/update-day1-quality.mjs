import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('./v45-january/day-01.json', import.meta.url);
const item = JSON.parse(readFileSync(path, 'utf8'));

item.reflection = `Você já fechou a planilha, revisou o plano pela quinta vez e mesmo assim continuou inquieto? Essa é a tensão de quem sabe que precisa agir, mas gostaria de garantir o resultado antes de dar o primeiro passo.

Provérbios 16:3 traz o convite: “Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.” Isso não significa abandonar o planejamento — significa colocar diante de Deus o trabalho que você já faz, reconhecendo que ele nunca esteve totalmente sob seu controle. Ao confiar, a mente ganha um lugar mais estável para decidir.

Entregar os planos ao Senhor também muda a maneira de trabalhar. Você continua estudando, fazendo contas, cumprindo prazos e tratando pessoas com honestidade. A diferença é que não precisa carregar sozinho aquilo que nunca esteve totalmente nas suas mãos. O propósito vem antes da necessidade de provar que tudo dará certo.

Rafael tinha uma pequena gráfica em Campinas. Recebeu um pedido de três mil apostilas e pensou em comprar papel à vista e contratar ajuda antes da confirmação. Ele orou, organizou os custos e apresentou uma proposta com prazo realista, sem tentar forçar a resposta da escola. A aprovação demorou; depois, veio apenas metade do pedido. Como não havia se endividado para controlar um resultado incerto, Rafael entregou a encomenda com tranquilidade e preservou o caixa.

A decisão de Rafael não foi passividade. Ele fez o que dependia dele: calculou os custos, comunicou um prazo possível e preparou uma entrega responsável. Ao mesmo tempo, deixou espaço para uma resposta diferente da que imaginava. Quando o plano é colocado nas mãos de Deus, você pode corrigir a rota sem sentir que perdeu a própria identidade ou que precisa manipular pessoas para vencer.

Talvez hoje exista uma proposta, contratação ou compra esperando sua decisão. Ore com sinceridade sobre o desejo — e também sobre o medo escondido nele. Deus pode confirmar seu caminho, ajustar seus prazos ou fechar uma porta. Em qualquer caso, Ele continua presente no trabalho fiel de cada dia.

Planejar com propósito é preparar-se sem fazer do resultado um senhor. Faça sua parte com cuidado, entregue o restante ao Senhor e caminhe com a paz possível para hoje.`;

item.practicalActions[0] = 'Ação principal: escreva em uma página o plano que mais ocupa sua mente hoje — incluindo o que você deseja e o que não pode controlar.';

writeFileSync(path, `${JSON.stringify(item, null, 2)}\n`);
