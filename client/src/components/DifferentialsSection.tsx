import { motion } from 'framer-motion';
import { Cpu, Gauge, Lock, TrendingUp, Users, Zap } from 'lucide-react';

const differentials = [
  {
    icon: <Cpu className="h-5 w-5" />,
    title: 'Demo antes da venda',
    description: 'O cliente vê a automação funcionando antes de decidir, reduzindo dúvidas e aumentando a confiança.',
    featured: true,
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Contexto capturado',
    description: 'Os dados do negócio entram na experiência desde o início, tornando a simulação mais próxima da realidade.',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Entrega mais rápida',
    description: 'Templates prontos aceleram a criação sem deixar a experiência com aparência genérica.',
  },
  {
    icon: <TrendingUp className="h-5 w-5" />,
    title: 'Foco em conversão',
    description: 'O fluxo conduz o cliente para o próximo passo, seja orçamento, agendamento ou atendimento humano.',
  },
  {
    icon: <Lock className="h-5 w-5" />,
    title: 'Estrutura segura',
    description: 'A lógica da automação fica protegida no backend, sem exposição desnecessária no navegador.',
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: 'Ajuste fino',
    description: 'Tom de voz, regras, serviços e mensagens podem ser refinados sem reconstruir toda a experiência.',
  },
];

export default function DifferentialsSection() {
  return (
    <section className="differentials-section light-section">
      <div className="section-inner">
        <motion.div
          className="differentials-header mx-auto mb-14 max-w-3xl text-center"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="light-eyebrow mb-5">Diferenciais</div>
          <h2 className="text-balance text-4xl font-semibold text-slate-950 md:text-6xl">
            Confiança antes da tecnologia.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Antes de falar em automação, o cliente precisa entender valor, visualizar resultado e sentir segurança para avançar.
          </p>
        </motion.div>

        <div className="differentials-grid grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {differentials.map((diff, index) => (
            <motion.article
              key={diff.title}
              className={`differential-card light-card p-6 ${diff.featured ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.04 }}
              viewport={{ once: true }}
            >
              <div className="differential-icon mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600">
                {diff.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-950">{diff.title}</h3>
              {diff.featured && <span className="differential-pill">Principal</span>}
              <p className="mt-3 text-sm leading-7 text-slate-600">{diff.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          className="differentials-cta"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true }}
        >
          <p>Quer que seu cliente veja valor antes da reunião?</p>
          <a href="#simulador-agente">Testar experiência gratuita</a>
        </motion.div>
      </div>
    </section>
  );
}
