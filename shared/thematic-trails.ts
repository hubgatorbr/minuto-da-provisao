export type ThematicTrailSeed = {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  challenge: string;
  durationDays: number;
  accessLevel: "free" | "premium";
  coverColor: string;
  published: boolean;
  catalogRevision: string;
  items: Array<{
    dayNumber: number; // dia correspondente na jornada anual de 365
    position: number;   // 1 a durationDays na trilha
    trailIntro?: string;
    actionPrompt?: string;
    reviewQuestion?: string;
  }>;
};

export const thematicTrailSeeds: ThematicTrailSeed[] = [
  {
    slug: "ansiedade-financeira",
    title: "Ansiedade Financeira",
    subtitle: "7 dias para discernir o caixa, acalmar o impulso e caminhar em prudência responsável",
    description: "Uma trilha prática e pastoral para empreendedores que sentem o peso do fluxo de caixa e a inquietação dos prazos. Em 7 etapas estruturadas, você aprenderá a reconhecer a ansiedade sem agir por impulso, separar fatos de suposições, dialogar com clareza sobre dinheiro, estabelecer limites saudáveis e entregar a Deus aquilo que não pode controlar, mantendo passos firmes e responsáveis.",
    challenge: "Ansiedade financeira e gestão de caixa",
    durationDays: 7,
    accessLevel: "free",
    coverColor: "#102a43",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [
      {
        dayNumber: 345, // "Planejar sem ansiedade" (Isaías 11:1)
        position: 1,
        trailIntro: "Dia 1: Reconhecer a inquietação sem reagir por impulso. O primeiro passo diante da pressão financeira não é tomar decisões apressadas, mas respirar na presença de Deus e identificar onde o medo quer ditar o ritmo.",
        actionPrompt: "Escreva em um papel exatamente o que está tirando seu sono financeiro hoje. Não tente resolver agora; apenas dê nome ao medo diante de Deus.",
        reviewQuestion: "Que impulso precipitado você quase seguiu hoje por causa da ansiedade financeira?",
      },
      {
        dayNumber: 122, // "Mordomia começa na clareza" (Lucas 2:1)
        position: 2,
        trailIntro: "Dia 2: Separar fatos de suposições. A ansiedade costuma multiplicar cenários trágicos que ainda não aconteceram. A mordomia fiel começa encarando os números reais com humildade e sem vergonha.",
        actionPrompt: "Abra sua conta ou planilha por 15 minutos e liste apenas os fatos confirmados: saldo real, contas a pagar nos próximos 7 dias e valores a receber com data certa.",
        reviewQuestion: "Entre tudo o que preocupou sua mente hoje, o que é fato comprovado e o que é apenas imaginação do medo?",
      },
      {
        dayNumber: 19, // "Quando o propósito encontra o caixa" (Provérbios 19:1)
        position: 3,
        trailIntro: "Dia 3: Identificar uma decisão financeira concreta. Em vez de tentar resolver todos os problemas de uma vez, concentre sua energia no próximo passo ético e viável que preserva o propósito.",
        actionPrompt: "Escolha uma única decisão financeira pendente e defina o próximo passo objetivo para hoje, sem comprometer a verdade com clientes ou equipe.",
        reviewQuestion: "Qual é a decisão financeira prioritária que você precisa tomar sem fingimento ou atalhos?",
      },
      {
        dayNumber: 144, // "Pedir ajuda financeira" (Lucas 24:1)
        position: 4,
        trailIntro: "Dia 4: Conversar com clareza sobre dinheiro. O isolamento alimenta o desespero. Buscar conselho maduro, renegociar com transparência e abrir o diálogo com a família trazem alívio e sabedoria.",
        actionPrompt: "Agende uma conversa sincera com um conselheiro, sócio, cônjuge ou fornecedor para alinhar expectativas com verdade e respeito mútuo.",
        reviewQuestion: "Com quem você precisa ser mais transparente a respeito do momento financeiro da empresa?",
      },
      {
        dayNumber: 130, // "O caixa como cuidado" (Lucas 10:1)
        position: 5,
        trailIntro: "Dia 5: Estabelecer limites responsáveis. Cuidar do caixa não é avareza, mas responsabilidade com vidas. Aprender a dizer não e proteger reservas essenciais honra as pessoas que dependem do negócio.",
        actionPrompt: "Corte ou suspenda hoje uma despesa desnecessária ou postergue uma compra não urgente até o caixa recuperar o fôlego necessário.",
        reviewQuestion: "Que limite financeiro responsável você precisa sustentar mesmo diante da pressão de parecer próspero?",
      },
      {
        dayNumber: 138, // "Administrar em tempos apertados" (Lucas 18:1)
        position: 6,
        trailIntro: "Dia 6: Entregar a Deus aquilo que você não pode controlar. Quando você já fez o melhor com honestidade e prudência, a paz vem de lembrar que o Senhor é a fonte da provisão, não o seu estresse.",
        actionPrompt: "Em oração silenciosa, entregue a Deus os contratos pendentes, as respostas de clientes e o futuro do negócio, soltando a falsa ilusão de controle absoluto.",
        reviewQuestion: "O que você tem tentado carregar sozinho que precisa ser depositado nos braços de Deus hoje?",
      },
      {
        dayNumber: 124, // "O orçamento que traz paz" (Lucas 4:1)
        position: 7,
        trailIntro: "Dia 7: Definir um próximo passo realista e caminhar em constância. Encerrando esta trilha, você não tem garantias mágicas, mas tem sobriedade, fé ativa e um plano honrado para continuar construindo.",
        actionPrompt: "Escreva seu plano de ação simples para os próximos 14 dias: metas de contenção, acompanhamento semanal do caixa e momento diário de oração.",
        reviewQuestion: "Qual compromisso prático você assume a partir de hoje para preservar a paz no governo financeiro?",
      },
    ],
  },
  {
    slug: "lideranca-com-proposito",
    title: "Liderança com Propósito",
    subtitle: "14 dias para liderar pessoas com integridade, firmeza e compaixão",
    description: "Para empreendedores que desejam formar equipes saudáveis, comunicar visão bíblica com clareza e liderar pelo exemplo servindo ao próximo.",
    challenge: "Liderança de equipes e cultura organizacional",
    durationDays: 14,
    accessLevel: "free",
    coverColor: "#1d3557",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "decisoes-dificeis",
    title: "Decisões Difíceis",
    subtitle: "7 dias para discernir encruzilhadas éticas, cortes e novos rumos no negócio",
    description: "Um guia de reflexão e oração para momentos em que nenhuma opção parece confortável e a sabedoria divina se faz indispensável.",
    challenge: "Tomada de decisão sob pressão e encruzilhadas",
    durationDays: 7,
    accessLevel: "free",
    coverColor: "#2b2d42",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "recomeco-depois-de-uma-crise",
    title: "Recomeço Depois de uma Crise",
    subtitle: "14 dias para recuperar a esperança e reconstruir o negócio com alicerces sólidos",
    description: "Para quem enfrentou quedas de faturamento, ruptura societária ou frustrações severas e precisa recomeçar com ânimo e sabedoria.",
    challenge: "Recuperação após perdas e resiliência espiritual",
    durationDays: 14,
    accessLevel: "free",
    coverColor: "#3d405b",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "equilibrio-trabalho-e-familia",
    title: "Equilíbrio entre Trabalho e Família",
    subtitle: "21 dias para proteger o lar, honrar o descanso e vencer o excesso de trabalho",
    description: "Princípios práticos e bíblicos para que o sucesso do empreendimento não custe a presença, o afeto e a saúde da sua família.",
    challenge: "Gestão do tempo, descanso sabático e presença familiar",
    durationDays: 21,
    accessLevel: "free",
    coverColor: "#264653",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "integridade-nas-negociacoes",
    title: "Integridade nas Negociações",
    subtitle: "7 dias para negociar com verdade, justiça e honra aos contratos",
    description: "Como resistir a atalhos éticos, cumprir o que foi acordado e testemunhar valores do Reino no mercado comercial.",
    challenge: "Ética comercial, contratos e integridade",
    durationDays: 7,
    accessLevel: "free",
    coverColor: "#1b4332",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "transformacao-digital",
    title: "Transformação Digital",
    subtitle: "7 dias para modernizar processos com prudência e propósito humano",
    description: "Como adotar tecnologia e novas ferramentas para servir melhor aos clientes sem perder a essência do relacionamento pessoal.",
    challenge: "Tecnologia, inovação e modernização de processos",
    durationDays: 7,
    accessLevel: "free",
    coverColor: "#0f4c5c",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligência Artificial com Sabedoria",
    subtitle: "7 dias para navegar na era da IA com discernimento ético e zelo",
    description: "Reflexões sobre criatividade, produtividade e responsabilidade moral no uso de ferramentas de inteligência artificial no trabalho.",
    challenge: "Novas fronteiras tecnológicas e impacto no trabalho",
    durationDays: 7,
    accessLevel: "free",
    coverColor: "#3a0ca3",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "gestao-e-planejamento-estrategico",
    title: "Gestão e Planejamento Estratégico",
    subtitle: "14 dias para alinhar metas, indicadores e execução à soberania de Deus",
    description: "Construa planos consistentes, execute com disciplina e submeta cada objetivo ao conselho soberano do Senhor.",
    challenge: "Planejamento estratégico, governança e metas",
    durationDays: 14,
    accessLevel: "free",
    coverColor: "#4a4e69",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
  {
    slug: "recrutamento-e-desenvolvimento-de-pessoas",
    title: "Recrutamento, Seleção e Pessoas",
    subtitle: "7 dias para atrair talentos, cuidar de vocações e promover crescimento digno",
    description: "Princípios para acolher colaboradores com justiça, avaliar caráter com sabedoria e formar profissionais fiéis.",
    challenge: "Contratação, avaliação de caráter e desenvolvimento de talentos",
    durationDays: 7,
    accessLevel: "free",
    coverColor: "#22577a",
    published: true,
    catalogRevision: "editorial-v4.5",
    items: [],
  },
];
