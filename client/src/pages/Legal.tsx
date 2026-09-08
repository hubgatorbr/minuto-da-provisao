import { ArrowLeft, BookOpen, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";

const terms = {
  eyebrow: "TERMOS DE USO",
  title: "Uma jornada construída com clareza e responsabilidade.",
  intro: "Estes termos orientam o uso do Minuto da Provisão e ajudam a preservar uma experiência respeitosa, segura e coerente com a proposta do produto.",
  sections: [
    ["1. Proposta do produto", "O Minuto da Provisão oferece conteúdo devocional e ferramentas pessoais de reflexão para apoiar uma rotina de fé, oração e sabedoria aplicada à vida e ao empreendedorismo."],
    ["2. Natureza do conteúdo", "O conteúdo tem finalidade educacional e devocional. Ele não substitui aconselhamento profissional jurídico, financeiro, psicológico, médico ou pastoral individualizado e não representa promessa de resultado financeiro ou empresarial."],
    ["3. Conta e uso responsável", "Você é responsável por manter a segurança de sua conta e por utilizar a plataforma de forma lícita, respeitosa e compatível com sua finalidade. Não é permitido tentar comprometer, copiar indevidamente ou interromper o serviço."],
    ["4. Conteúdo e propriedade intelectual", "A identidade visual, os textos devocionais originais, a organização da jornada e os elementos do produto são protegidos pelas normas aplicáveis. Referências e textos bíblicos são identificados conforme a edição utilizada e suas respectivas condições de uso."],
    ["5. Disponibilidade e atualizações", "O produto pode receber melhorias, correções e atualizações de conteúdo. Recursos podem evoluir para preservar qualidade, segurança e sustentabilidade da experiência."],
    ["6. Vigência", "Estes termos entram em vigor na data de sua publicação. Alterações relevantes serão comunicadas na própria plataforma."],
  ],
};

const privacy = {
  eyebrow: "POLÍTICA DE PRIVACIDADE",
  title: "Sua jornada pessoal merece cuidado e respeito.",
  intro: "Esta política resume como dados essenciais podem ser tratados para oferecer o Minuto da Provisão com segurança e transparência.",
  sections: [
    ["1. Dados tratados", "Podemos tratar dados de cadastro e autenticação, preferências, progresso da jornada, reflexões salvas, favoritos e informações técnicas necessárias para manter o serviço seguro e funcional."],
    ["2. Finalidades", "Os dados são utilizados para autenticar sua conta, salvar sua experiência, exibir seu progresso, melhorar a estabilidade do produto, prevenir abuso e cumprir obrigações aplicáveis."],
    ["3. Reflexões pessoais", "Textos registrados no diário são parte da sua experiência individual. Aplicamos medidas técnicas e organizacionais para restringir o acesso e proteger essas informações."],
    ["4. Compartilhamento", "Não comercializamos dados pessoais. O tratamento pode envolver provedores de infraestrutura, autenticação e armazenamento estritamente necessários à operação, sob compromissos de segurança e confidencialidade."],
    ["5. Retenção e segurança", "Mantemos dados pelo período necessário às finalidades descritas e adotamos medidas proporcionais para protegê-los contra acesso, alteração, perda ou divulgação indevida."],
    ["6. Seus direitos", "Você pode solicitar informações, correção ou exclusão de dados conforme a legislação aplicável e as limitações necessárias ao cumprimento de obrigações legais e de segurança."],
  ],
};

export default function Legal() {
  const [location] = useLocation();
  const document = location === "/privacidade" ? privacy : terms;

  return (
    <main className="min-h-screen bg-[#f7f4ec] text-[#1c2732] dark:bg-[#091725] dark:text-[#e8edf2]">
      <header className="border-b border-[#071c35]/10 bg-[#f7f4ec]/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#091725]/90">
        <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Voltar para o início">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl rounded-bl-sm border border-[#b9944a]/60 text-[#b9944a]"><BookOpen className="h-5 w-5" /></span>
            <span><strong className="block font-serif text-lg text-[#071c35] dark:text-white">MINUTO</strong><small className="block text-[8px] font-bold tracking-[.24em] text-[#b9944a]">DA PROVISÃO</small></span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-xs font-bold text-[#071c35] dark:text-white"><ArrowLeft className="h-4 w-4" /> VOLTAR</Link>
        </div>
      </header>
      <section className="mx-auto max-w-5xl px-5 py-20 sm:py-28">
        <div className="max-w-3xl">
          <p className="flex items-center gap-3 text-[10px] font-bold tracking-[.2em] text-[#b9944a]"><span className="h-px w-7 bg-[#b9944a]" />{document.eyebrow}</p>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-[.95] tracking-tight text-[#071c35] dark:text-white sm:text-7xl">{document.title}</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-[#65717d] dark:text-[#a2b0bd]">{document.intro}</p>
        </div>
        <div className="mt-16 grid gap-px overflow-hidden border border-[#071c35]/10 bg-[#071c35]/10 dark:border-white/10 dark:bg-white/10 sm:grid-cols-2">
          {document.sections.map(([title, text]) => <article key={title} className="bg-[#fffdf8] p-7 dark:bg-[#0d2030] sm:p-9"><ShieldCheck className="h-5 w-5 text-[#b9944a]" /><h2 className="mt-5 font-serif text-2xl font-semibold text-[#071c35] dark:text-white">{title}</h2><p className="mt-3 text-sm leading-7 text-[#65717d] dark:text-[#a2b0bd]">{text}</p></article>)}
        </div>
        <p className="mt-10 text-xs text-[#7d8790]">Última atualização: 7 de setembro de 2026.</p>
      </section>
    </main>
  );
}
