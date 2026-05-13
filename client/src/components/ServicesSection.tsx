import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bot, Cpu, MessageSquare, Network, Zap } from 'lucide-react';

const services = [
  {
    icon: <Bot className="h-5 w-5" />,
    title: 'Agentes de IA sob medida',
    description: 'Criamos um agente com linguagem, regras e respostas alinhadas ao seu negócio.',
    details: ['Prompt personalizado', 'Regras de atendimento', 'Tom de voz da empresa', 'Treinamento por segmento'],
    insight:
      'Seu atendimento passa a responder com mais consistência, seguindo regras do seu negócio e mantendo uma comunicação profissional com seus clientes.',
  },
  {
    icon: <MessageSquare className="h-5 w-5" />,
    title: 'Fluxos conversacionais',
    description: 'Criamos caminhos guiados para atendimento, qualificação e conversão pelo WhatsApp.',
    details: ['Botões e respostas rápidas', 'Coleta de dados', 'Qualificação de leads', 'Encaminhamento para humano'],
    insight: 'O cliente percorre um caminho claro, com perguntas, respostas e próximos passos bem definidos.',
  },
  {
    icon: <Network className="h-5 w-5" />,
    title: 'Integrações operacionais',
    description: 'Conectamos sua automação com ferramentas que já fazem parte da sua rotina.',
    details: ['Google Sheets', 'CRMs', 'APIs', 'Webhooks'],
    insight:
      'As informações deixam de ficar espalhadas e passam a circular entre WhatsApp, planilhas, CRM e ferramentas internas.',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Automação de tarefas',
    description: 'Reduzimos processos repetitivos com rotinas simples, rastreáveis e fáceis de manter.',
    details: ['Envio de mensagens', 'Atualização de planilhas', 'Notificações automáticas', 'Organização de leads'],
    insight:
      'Tarefas repetitivas são executadas automaticamente, reduzindo erro manual e economizando tempo da operação.',
  },
  {
    icon: <Cpu className="h-5 w-5" />,
    title: 'Simulação antes da venda',
    description: 'O cliente consegue testar o valor da automação antes de falar com o time comercial.',
    details: ['Prévia personalizada', 'Teste no WhatsApp', 'Demonstração rápida', 'Experiência guiada'],
    insight:
      'O cliente entende o valor da solução antes da reunião comercial, aumentando a confiança e a chance de conversão.',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Dados para decisão',
    description: 'Organizamos conversas, leads e resultados para facilitar acompanhamento e melhoria.',
    details: ['Histórico de atendimentos', 'Status dos leads', 'Métricas básicas', 'Base para relatórios'],
    insight: 'As conversas e leads viram informações organizadas para acompanhamento, análise e melhoria contínua.',
  },
];

const processSteps = [
  'Entendemos seu atendimento',
  'Criamos a automação',
  'Integramos com seus canais',
  'Você acompanha os resultados',
];

export default function ServicesSection() {
  const [selectedDeliverable, setSelectedDeliverable] = useState(0);
  const activeService = services[selectedDeliverable];

  return (
    <section className="deliverables-section light-section">
      <div className="section-inner">
        <motion.div
          className="deliverables-header mb-14 max-w-3xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="light-eyebrow mb-5">O que entregamos</div>
          <h2 className="text-balance text-4xl font-semibold text-slate-950 md:text-6xl">
            Automação com cara de produto, não de experimento.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Da primeira mensagem até a integração final, o projeto é desenhado para parecer confiável, simples e comercialmente pronto.
          </p>
        </motion.div>

        <div className="deliverables-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.button
              key={service.title}
              type="button"
              onClick={() => setSelectedDeliverable(index)}
              aria-pressed={selectedDeliverable === index}
              className={`deliverable-card light-card group p-6 text-left ${selectedDeliverable === index ? 'active' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              viewport={{ once: true }}
            >
              <div className="deliverable-icon mb-8 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 transition group-hover:border-sky-300 group-hover:bg-sky-100">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{service.description}</p>
              <ul className="deliverable-details mt-5 grid gap-2">
                {service.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </motion.button>
          ))}
        </div>

        <motion.div
          className="deliverable-insight"
          key={activeService.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="text-sm font-bold uppercase tracking-[0.18em] text-sky-700">Na prática, isso entrega:</div>
          <p className="mt-3 text-lg leading-8 text-slate-700">{activeService.insight}</p>
        </motion.div>

        <div className="process-steps">
          {processSteps.map((step, index) => (
            <div key={step} className="process-step">
              <span>{index + 1}</span>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
