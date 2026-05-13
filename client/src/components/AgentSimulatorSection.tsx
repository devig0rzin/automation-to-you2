import { FormEvent, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bot,
  Check,
  GitBranch,
  MessageCircle,
  MoreVertical,
  Phone,
  Plus,
  Smartphone,
  Sparkles,
  Trash2,
  UserRound,
  Video,
  Wand2,
  X,
} from 'lucide-react';

type LeadForm = {
  name: string;
  businessName: string;
  phone: string;
  segment: string;
  goal: string;
};

type AgentSettings = {
  templateId: string;
  businessName: string;
  agentName: string;
  schedule: string;
  services: string;
  prices: string;
  rules: string;
  tone: string;
  customInstructions: string;
};

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type FlowOption = {
  id: string;
  label: string;
  nextMessage: string;
};

type FlowBlock = {
  id: string;
  type: 'saudacao' | 'pergunta' | 'opcao' | 'agenda' | 'humano';
  title: string;
  message: string;
  options: FlowOption[];
};

type Template = {
  id: string;
  label: string;
  icon: string;
  avatarSrc?: string;
  backgroundSrc?: string;
  description: string;
  defaults: Omit<AgentSettings, 'businessName'>;
  opening: string;
  flow: FlowBlock[];
};

type EditableTarget =
  | { kind: 'block'; blockId: string }
  | { kind: 'option'; blockId: string; optionIndex: number };

const NODE_WIDTH = 320;
const RESPONSE_WIDTH = 300;
const OPTION_TOP = 148;
const OPTION_ROW = 38;
const COLUMN_GAP = 850;

const blockTypes: Array<{ type: FlowBlock['type']; label: string }> = [
  { type: 'saudacao', label: 'Saudação' },
  { type: 'pergunta', label: 'Pergunta' },
  { type: 'opcao', label: 'Opções' },
  { type: 'agenda', label: 'Agenda' },
  { type: 'humano', label: 'Humano' },
];

const ASSISTANT_MESSAGE_SEPARATOR = '@@NOVA_MENSAGEM@@';
const sheetsWebhookUrl =
  'https://script.google.com/macros/s/AKfycbx_cQCZ1v9bG5OAMa5H_i2QB30ceJ0xEQ0aC57CFpeq7_92j1DZefVhQl-fMVqw7Afw/exec';

const deliveryMenuMessage = `Ótimo! 🍕 Você pode escolher uma categoria:

1. Pizzas
2. Combos
3. Bebidas
4. Sobremesas

Qual delas você gostaria de ver?`;

const deliveryCombosMessage = `Perfeito! Aqui estão nossos combos:

1. **Combo Família**: 2 pizzas médias + 1 refrigerante de 2L - R$ 89
2. **Combo Duplo**: 2 pizzas médias + 1 sobremesa + 1 refrigerante de 1L - R$ 99
3. **Combo Light**: 1 pizza média + 1 salada + 1 suco natural - R$ 79

Qual combo você gostaria de pedir? 😊`;

const deliveryJuicesMessage = `Nós temos os seguintes sabores de suco natural:

1. Laranja
2. Limão
3. Abacaxi
4. Manga

Qual sabor você prefere? 🍹`;

const deliverySodasMessage = `Para os refrigerantes, temos as seguintes opções:

1. Coca-Cola
2. Guaraná
3. Fanta Laranja
4. Sprite

Qual refrigerante você gostaria de escolher? 🥤`;

const aestheticLocalizedFatMessage =
  'Perfeito! Para a redução de gordura localizada, temos algumas opções de protocolos que podem ser avaliados. Antes de agendarmos, você já fez algum procedimento estético antes? Isso nos ajuda a entender melhor seu histórico. Você já teve alguma experiência anterior?';

const templates: Template[] = [
  {
    id: 'dentista',
    label: 'Dentista',
    icon: 'D',
    avatarSrc: '/bot-profiles/clara_dentista_avatar.jpg',
    backgroundSrc: '/whatsapp-backgrounds/dentista_bg.jpg',
    description: 'Triagem, agenda, procedimentos e retorno preventivo.',
    defaults: {
      templateId: 'dentista',
      agentName: 'Clara',
      schedule: 'Segunda a sexta, das 8h às 18h',
      services: 'Limpeza, avaliação, clareamento, restauração e urgências',
      prices: 'Avaliação inicial a partir de R$ 80. Demais valores após triagem.',
      rules: 'Coletar nome, queixa principal, melhor horário e encaminhar urgências para humano.',
      tone: 'acolhedor e profissional',
      customInstructions: 'Sempre explicar o próximo passo antes de sugerir agendamento.',
    },
    opening: 'Oi, sou a Clara. Posso te ajudar a entender o melhor atendimento e encontrar um horário.',
    flow: [
      createFlowBlock('saudacao', 'Boas-vindas', 'Olá! Sou a Clara da clínica. Vou te ajudar com informações e agenda.', [
        createFlowOption('Ver preços', 'A avaliação inicial custa a partir de R$ 80. Para procedimentos como limpeza, clareamento ou restauração, eu preciso entender seu caso antes de passar uma estimativa segura.'),
        createFlowOption('Ver horários', 'Temos atendimento de segunda a sexta, das 8h às 18h. Posso verificar manhã ou tarde para você.'),
        createFlowOption('Urgência', 'Se estiver com dor forte, inchaço ou sangramento, vou priorizar seu atendimento e encaminhar para a equipe agora.'),
      ]),
      createFlowBlock('pergunta', 'Triagem', 'Qual procedimento você procura ou qual incômodo está sentindo?', [
        createFlowOption('Limpeza', 'Perfeito. A limpeza é indicada para prevenção e remoção de tártaro. Posso te ajudar a escolher um horário.'),
        createFlowOption('Clareamento', 'O clareamento depende de avaliação para indicar o melhor protocolo e evitar sensibilidade.'),
        createFlowOption('Restauração', 'Entendi. Vou te pedir alguns detalhes sobre o dente e há quanto tempo começou o incômodo.'),
      ]),
      createFlowBlock('agenda', 'Agendamento', 'Qual dia e período fica melhor para você?', [
        createFlowOption('Manhã', 'Ótimo. Vou procurar horários pela manhã e separar as opções mais próximas.'),
        createFlowOption('Tarde', 'Combinado. Vou verificar os períodos da tarde com melhor disponibilidade.'),
      ]),
    ],
  },
  {
    id: 'barbearia',
    label: 'Barbearia',
    icon: 'B',
    avatarSrc: '/bot-profiles/theo_barbearia_avatar.jpg',
    backgroundSrc: '/whatsapp-backgrounds/barbearia_bg.jpg',
    description: 'Cortes, barba, combos, horários e fidelização.',
    defaults: {
      templateId: 'barbearia',
      agentName: 'Theo',
      schedule: 'Terça a sábado, das 9h às 20h',
      services: 'Corte masculino, barba, sobrancelha, pigmentação e combos',
      prices: 'Corte R$ 45, barba R$ 35, combo corte + barba R$ 70',
      rules: 'Perguntar serviço, barbeiro preferido e horário desejado antes de confirmar.',
      tone: 'direto, simpático e moderno',
      customInstructions: 'Oferecer combo quando o cliente pedir corte ou barba separadamente.',
    },
    opening: 'Fala! Sou o Theo. Quer marcar corte, barba ou um combo?',
    flow: [
      createFlowBlock('saudacao', 'Chegada', 'Como posso te ajudar?', [
        createFlowOption('Agendar um corte', 'Show. Para agendar o corte, me diga se prefere hoje, amanhã ou outro dia da semana.'),
        createFlowOption('Ver preços', 'Corte sai por R$ 45, barba por R$ 35 e o combo corte + barba fica R$ 70.'),
        createFlowOption('Localização', 'A barbearia fica perto do centro. Posso te enviar o endereço completo e um ponto de referência.'),
      ]),
      createFlowBlock('opcao', 'Serviços', 'Temos corte, barba, combo e serviços extras. Qual você gostaria de consultar?', [
        createFlowOption('Combo barba e corte', 'O combo inclui corte completo e barba alinhada por R$ 70. É a melhor opção para sair pronto.'),
        createFlowOption('Corte navalhado', 'O corte navalhado tem acabamento mais marcado e custa R$ 45. Posso sugerir barbeiros disponíveis.'),
        createFlowOption('Sobrancelha', 'A sobrancelha pode ser feita junto com corte ou barba. Posso incluir no seu horário.'),
      ]),
    ],
  },
  {
    id: 'manicure',
    label: 'Manicure',
    icon: 'M',
    avatarSrc: '/bot-profiles/lia_manicure_estetica_avatar.jpg',
    backgroundSrc: '/whatsapp-backgrounds/manicure_bg.jpg',
    description: 'Esmaltação, alongamento, manutenção e encaixes.',
    defaults: {
      templateId: 'manicure',
      agentName: 'Lia',
      schedule: 'Segunda a sábado, das 9h às 19h',
      services: 'Manicure, pedicure, banho de gel, alongamento e manutenção',
      prices: 'Manicure R$ 35, pedicure R$ 40, alongamento a partir de R$ 130',
      rules: 'Confirmar serviço, data, se precisa remover alongamento e forma de pagamento.',
      tone: 'leve, cuidadoso e consultivo',
      customInstructions: 'Sugerir manutenção quando o cliente mencionar alongamento.',
    },
    opening: 'Oi, sou a Lia. Me conta qual serviço você quer fazer hoje?',
    flow: [
      createFlowBlock('saudacao', 'Boas-vindas', 'Oi! Qual serviço você quer fazer hoje?', [
        createFlowOption('Ver preços', 'Manicure custa R$ 35, pedicure R$ 40 e alongamento começa em R$ 130. Posso te explicar cada opção.'),
        createFlowOption('Ver horários', 'Tenho encaixes durante a semana e alguns horários no sábado. Qual período é melhor para você?'),
        createFlowOption('Alongamento', 'Para alongamento, preciso saber se é primeira aplicação ou manutenção. Assim consigo indicar tempo e valor correto.'),
      ]),
      createFlowBlock('pergunta', 'Detalhes', 'Você precisa remover algum alongamento ou esmalte atual?', [
        createFlowOption('Preciso remover', 'Certo. Vou considerar um tempo extra para remoção segura antes do novo procedimento.'),
        createFlowOption('Não preciso', 'Perfeito. O atendimento fica mais direto e posso buscar horários mais curtos.'),
      ]),
    ],
  },
  {
    id: 'estetica',
    label: 'Clínica estética',
    icon: 'E',
    avatarSrc: '/bot-profiles/maya_clinica_estetica_avatar.jpg',
    backgroundSrc: '/whatsapp-backgrounds/estetica_bg.jpg',
    description: 'Avaliação, protocolos, objeções e agendamento.',
    defaults: {
      templateId: 'estetica',
      agentName: 'Maya',
      schedule: 'Segunda a sexta, das 10h às 19h',
      services: 'Limpeza de pele, drenagem, botox, bioestimulador e protocolos faciais',
      prices: 'Avaliação gratuita. Procedimentos com valor após análise do caso.',
      rules: 'Não prometer resultado médico. Conduzir para avaliação com especialista.',
      tone: 'premium, seguro e educado',
      customInstructions: 'Quando houver dúvida técnica, orientar avaliação presencial.',
    },
    opening: 'Oi, sou a Maya. Posso te ajudar a escolher o protocolo ideal e agendar sua avaliação.',
    flow: [
      createFlowBlock('saudacao', 'Recepção', 'Olá! Vou te ajudar a entender qual protocolo combina com seu objetivo.', [
        createFlowOption('Ver preços', 'Os valores variam conforme avaliação e protocolo. A avaliação é gratuita e ajuda a indicar o melhor caminho.'),
        createFlowOption('Agendar avaliação', 'Perfeito. A avaliação é o primeiro passo para indicar um protocolo seguro para seu objetivo.'),
        createFlowOption('Dúvida técnica', 'Pode me contar sua dúvida. Se envolver contraindicação ou resultado, eu encaminho para uma especialista.'),
      ]),
      createFlowBlock('pergunta', 'Objetivo', 'Seu foco é pele, gordura localizada, rejuvenescimento ou relaxamento?', [
        createFlowOption('Pele', 'Para pele, podemos avaliar limpeza, hidratação profunda ou protocolos faciais.'),
        createFlowOption('Gordura localizada', aestheticLocalizedFatMessage),
        createFlowOption('Rejuvenescimento', 'Nesse caso, a especialista avalia textura, flacidez e linhas antes de sugerir o protocolo.'),
      ]),
      createFlowBlock('pergunta', 'Histórico', aestheticLocalizedFatMessage, [
        createFlowOption('Sim', 'Perfeito. Vou considerar seu histórico antes de sugerir uma avaliação com a especialista.'),
        createFlowOption('Não', 'Tudo bem. Nesse caso, a avaliação inicial ajuda a indicar o protocolo mais adequado com segurança.'),
        createFlowOption('Falar com atendente', 'Certo. Vou encaminhar você para uma pessoa da equipe tirar suas dúvidas e orientar o próximo passo.'),
      ]),
    ],
  },
  {
    id: 'delivery',
    label: 'Delivery',
    icon: 'P',
    avatarSrc: '/bot-profiles/nina_delivery_avatar.jpg',
    backgroundSrc: '/whatsapp-backgrounds/delivery_bg.jpg',
    description: 'Cardápio, pedido, endereço, pagamento e status.',
    defaults: {
      templateId: 'delivery',
      agentName: 'Nina',
      schedule: 'Todos os dias, das 18h às 23h',
      services: 'Pedidos por delivery, retirada no balcão, combos e bebidas',
      prices: 'Pizza média a partir de R$ 45, combos a partir de R$ 69',
      rules: 'Coletar pedido, endereço, forma de pagamento e confirmar taxa de entrega.',
      tone: 'rápido, simpático e objetivo',
      customInstructions: 'Sempre confirmar o resumo do pedido antes de finalizar.',
    },
    opening: 'Oi, sou a Nina. Posso te ajudar a fazer um pedido agora.',
    flow: [
      createFlowBlock('saudacao', 'Início do pedido', 'Olá! Você quer ver cardápio, pedir novamente ou falar com atendente?', [
        createFlowOption('Ver cardápio', deliveryMenuMessage),
        createFlowOption('Combos', deliveryCombosMessage),
        createFlowOption('Bebidas', 'Temos sucos naturais e refrigerantes. Você prefere ver sucos ou refrigerantes?'),
        createFlowOption('Status do pedido', 'Me envie o nome do pedido ou telefone para eu verificar o status com a cozinha.'),
      ]),
      createFlowBlock('opcao', 'Bebidas', 'Você prefere suco natural ou refrigerante?', [
        createFlowOption('Sucos naturais', deliveryJuicesMessage),
        createFlowOption('Refrigerantes', deliverySodasMessage),
      ]),
      createFlowBlock('pergunta', 'Endereço', 'Me envie o endereço completo para calcular a entrega.', [
        createFlowOption('Enviar endereço', 'Ótimo. Com o endereço eu calculo taxa, prazo e confirmo se a região está dentro da área de entrega.'),
        createFlowOption('Retirar no balcão', 'Perfeito. Vou preparar o pedido para retirada e avisar o tempo estimado.'),
      ]),
    ],
  },
  {
    id: 'personalizado',
    label: 'Personalizado',
    icon: '+',
    avatarSrc: '/bot-profiles/alex_personalizado_avatar.jpg',
    backgroundSrc: '/whatsapp-backgrounds/personalizado_bg.jpg',
    description: 'Comece do zero com perguntas para montar IA e fluxo.',
    defaults: {
      templateId: 'personalizado',
      agentName: 'Clara',
      schedule: '',
      services: '',
      prices: '',
      rules: 'Perguntar objetivo do cliente, entender necessidade, oferecer próximo passo e encaminhar para humano quando necessário.',
      tone: 'natural, claro e consultivo',
      customInstructions: 'Use as informações preenchidas para criar uma conversa sob medida.',
    },
    opening: 'Olá, aqui é Clara da MBA. Posso te ajudar a entender o melhor atendimento e encontrar uma solução rápida pelo WhatsApp.',
    flow: [
      createFlowBlock('saudacao', 'Apresentação', 'Olá! Sou o assistente virtual. Como posso te ajudar hoje?', [
        createFlowOption('Ver preços'),
        createFlowOption('Ver horários'),
        createFlowOption('Localização'),
      ]),
      createFlowBlock('pergunta', 'Objetivo', 'Qual é o seu principal objetivo agora?', [
        createFlowOption('Comprar', 'Entendi. Vou te ajudar a escolher a melhor opção e tirar dúvidas antes do pedido.'),
        createFlowOption('Agendar', 'Perfeito. Vou buscar um horário adequado e coletar os dados necessários.'),
        createFlowOption('Falar com atendente', 'Certo. Vou reunir o contexto e encaminhar para uma pessoa da equipe.'),
      ]),
    ],
  },
];

const emptyLead: LeadForm = {
  name: '',
  businessName: '',
  phone: '',
  segment: '',
  goal: '',
};

const defaultTemplate = templates.find((template) => template.id === 'personalizado') || templates[0];

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function removeBrazilCode(value: string) {
  let digits = onlyDigits(value);

  if (digits.startsWith('55') && digits.length > 11) {
    digits = digits.slice(2);
  }

  return digits.slice(0, 11);
}

function formatBrazilPhone(value: string) {
  const digits = removeBrazilCode(value);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

function isValidBrazilPhone(value: string) {
  const digits = removeBrazilCode(value);
  return digits.length === 10 || digits.length === 11;
}

function createLeadId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `lead-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function getExperienceLabel(experienceType: 'ia' | 'fluxo') {
  return experienceType === 'fluxo' ? 'Fluxo de mensagens' : 'Agente IA';
}

function buildSheetsLeadPayload(
  lead: LeadForm,
  agent: AgentSettings,
  selectedTemplate: Template,
  experienceType: 'ia' | 'fluxo',
) {
  const cleanPhone = removeBrazilCode(lead.phone);

  return {
    leadId: createLeadId(),
    name: lead.name,
    phone: cleanPhone,
    company: lead.businessName,
    segment: lead.segment,
    experienceType: getExperienceLabel(experienceType),
    template: selectedTemplate.label,
    automationGoal: lead.goal,
    agentName: agent.agentName,
    businessHours: agent.schedule,
    services: agent.services,
    prices: agent.prices,
    tone: agent.tone,
    extraInfo: [agent.rules, agent.customInstructions].filter(Boolean).join('\n\n'),
    status: 'Novo Lead',
  };
}

async function sendLeadToSheets(payload: ReturnType<typeof buildSheetsLeadPayload>) {
  await fetch(sheetsWebhookUrl, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(payload),
  });
}

function buildTemplateOpening(template: Template, agent: AgentSettings, lead: LeadForm) {
  const agentName = agent.agentName.trim() || template.defaults.agentName;
  const businessName = agent.businessName.trim() || lead.businessName.trim();
  const companySuffix = businessName ? ` da ${businessName}` : '';

  switch (template.id) {
    case 'dentista':
      return `Oi, aqui é ${agentName}${companySuffix}. Posso te ajudar a entender o melhor atendimento e encontrar um horário.`;
    case 'barbearia':
      return `Fala! Aqui é ${agentName}${companySuffix}. Quer marcar corte, barba ou um combo?`;
    case 'manicure':
      return `Oi, aqui é ${agentName}${companySuffix}. Me conta qual serviço você quer fazer hoje?`;
    case 'estetica':
      return `Oi, aqui é ${agentName}${companySuffix}. Posso te ajudar a escolher o protocolo ideal e agendar sua avaliação.`;
    case 'delivery':
      return `Oi, aqui é ${agentName}${companySuffix}. Posso te ajudar a fazer um pedido agora.`;
    default:
      return `Olá, aqui é ${agentName}${companySuffix}. Posso te ajudar a entender o melhor atendimento e encontrar uma solução rápida pelo WhatsApp.`;
  }
}

function splitAssistantReply(reply: string) {
  return reply
    .split(ASSISTANT_MESSAGE_SEPARATOR)
    .map((content) => content.trim())
    .filter(Boolean);
}

function buildLocalAssistantReply(input: string) {
  const normalizedInput = input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (['preco', 'precos', 'valor', 'valores', 'orcamento'].some((term) => normalizedInput.includes(term))) {
    return 'Claro. Consigo te orientar pelos valores e entender qual serviço faz mais sentido para você. Qual opção você quer consultar primeiro?';
  }

  if (['horario', 'agenda', 'agendar', 'marcar', 'disponibilidade'].some((term) => normalizedInput.includes(term))) {
    return 'Perfeito. Posso te ajudar com agenda e disponibilidade. Qual dia ou período seria melhor para você?';
  }

  if (['servico', 'servicos', 'opcoes', 'cardapio', 'catalogo'].some((term) => normalizedInput.includes(term))) {
    return 'Posso te mostrar as principais opções e te guiar para o próximo passo. O que você procura resolver agora?';
  }

  return 'Consigo continuar a simulação com uma resposta local enquanto a conexão com a OpenRouter é ajustada. Me diga se você quer consultar serviços, valores ou horários.';
}

export default function AgentSimulatorSection() {
  const [lead, setLead] = useState<LeadForm>(emptyLead);
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(defaultTemplate.id);
  const [builderMode, setBuilderMode] = useState<'ia' | 'fluxo'>('ia');
  const [agent, setAgent] = useState<AgentSettings>({
    ...defaultTemplate.defaults,
    businessName: '',
  });
  const [flowBlocks, setFlowBlocks] = useState<FlowBlock[]>(defaultTemplate.flow);
  const [messages, setMessages] = useState<ChatMessage[]>([{ role: 'assistant', content: defaultTemplate.opening }]);
  const [input, setInput] = useState('');
  const [isRegisteringLead, setIsRegisteringLead] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [activeFlowIndex, setActiveFlowIndex] = useState(0);
  const [flowSelections, setFlowSelections] = useState<string[]>([]);
  const [isFlowCanvasOpen, setIsFlowCanvasOpen] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const canEditFlow = selectedTemplateId === 'personalizado';
  const selectedTemplate = useMemo(
    () => templates.find((template) => template.id === selectedTemplateId) || defaultTemplate,
    [selectedTemplateId],
  );
  const openingMessage = useMemo(
    () => buildTemplateOpening(selectedTemplate, agent, lead),
    [selectedTemplate, agent.agentName, agent.businessName, lead.businessName],
  );

  useEffect(() => {
    const chatScroll = chatScrollRef.current;
    if (!chatScroll) return;
    chatScroll.scrollTo({ top: chatScroll.scrollHeight, behavior: 'smooth' });
  }, [messages.length, isSending, activeFlowIndex, flowSelections.length, builderMode]);

  useEffect(() => {
    setMessages((current) => {
      if (current.length !== 1 || current[0]?.role !== 'assistant' || current[0].content === openingMessage) {
        return current;
      }

      return [{ role: 'assistant', content: openingMessage }];
    });
  }, [openingMessage]);

  const updateLead = useCallback((field: keyof LeadForm, value: string) => {
    setLead((current) => ({ ...current, [field]: field === 'phone' ? removeBrazilCode(value) : value }));

    if (field === 'phone') {
      setPhoneError('');
    }
  }, []);

  const updateAgent = useCallback((field: keyof AgentSettings, value: string) => {
    setAgent((current) => ({ ...current, [field]: value }));
  }, []);

  const updateFlowBlock = useCallback((id: string, field: keyof FlowBlock, value: string) => {
    setFlowBlocks((current) => current.map((block) => (block.id === id ? { ...block, [field]: value } : block)));
  }, []);

  const updateFlowOption = useCallback((blockId: string, optionIndex: number, value: string) => {
    setFlowBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              options: block.options.map((option, index) => (index === optionIndex ? { ...option, label: value } : option)),
            }
          : block,
      ),
    );
  }, []);

  const updateFlowOptionMessage = useCallback((blockId: string, optionIndex: number, value: string) => {
    setFlowBlocks((current) =>
      current.map((block) =>
        block.id === blockId
          ? {
              ...block,
              options: block.options.map((option, index) =>
                index === optionIndex ? { ...option, nextMessage: value } : option,
              ),
            }
          : block,
      ),
    );
  }, []);

  const addFlowOption = useCallback((blockId: string) => {
    setFlowBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, options: [...block.options, createFlowOption('Nova opção')] } : block,
      ),
    );
  }, []);

  const removeFlowOption = useCallback((blockId: string, optionIndex: number) => {
    setFlowBlocks((current) =>
      current.map((block) =>
        block.id === blockId ? { ...block, options: block.options.filter((_, index) => index !== optionIndex) } : block,
      ),
    );
  }, []);

  const addFlowBlock = useCallback((type: FlowBlock['type']) => {
    const label = blockTypes.find((block) => block.type === type)?.label || 'Bloco';
    setFlowBlocks((current) => [...current, createFlowBlock(type, label, getDefaultBlockMessage(type))]);
  }, []);

  const removeFlowBlock = useCallback((id: string) => {
    setFlowBlocks((current) => current.filter((block) => block.id !== id));
    setActiveFlowIndex((current) => Math.max(0, current - 1));
  }, []);

  function selectTemplate(template: Template) {
    const nextAgent = {
      ...template.defaults,
      businessName: agent.businessName || lead.businessName,
    };

    setSelectedTemplateId(template.id);
    setAgent(nextAgent);
    setFlowBlocks(template.flow);
    setMessages([{ role: 'assistant', content: buildTemplateOpening(template, nextAgent, lead) }]);
    setActiveFlowIndex(0);
    setFlowSelections([]);
    setIsFlowCanvasOpen(false);
  }

  const selectFlowOption = useCallback(
    (blockIndex: number, option: FlowOption) => {
      if (!leadCaptured) return;

      setFlowSelections((current) => {
        const next = current.slice(0, blockIndex);
        next[blockIndex] = option.label;
        return next;
      });

      setActiveFlowIndex(Math.min(blockIndex + 1, flowBlocks.length - 1));
    },
    [flowBlocks.length, leadCaptured],
  );

  async function handleLeadSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');

    if (!isValidBrazilPhone(lead.phone)) {
      setPhoneError('Digite um WhatsApp válido com DDD.');
      return;
    }

    setIsRegisteringLead(true);

    const sheetsPayload = buildSheetsLeadPayload(lead, agent, selectedTemplate, builderMode);

    try {
      await fetch('/api/agent-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      console.error('[local-lead-submit-error]', error);
      setStatus('Lead salvo localmente. A API será conectada quando o servidor estiver pronto.');
    }

    try {
      await sendLeadToSheets(sheetsPayload);
    } catch (error) {
      console.error('[sheets-lead-submit-error]', error);
      setStatus('Não foi possível enviar o lead para a planilha agora. Tente novamente em instantes.');
    } finally {
      setAgent((current) => ({ ...current, businessName: current.businessName || lead.businessName }));
      setLeadCaptured(true);
      setIsRegisteringLead(false);
    }
  }

  async function sendMessage() {
    const trimmedInput = input.trim();
    if (!trimmedInput || isSending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmedInput }];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);
    setStatus('');

    try {
      const response = await fetch('/api/chat-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead,
          agent: {
            ...agent,
            customInstructions: `${agent.customInstructions}\n\nFluxo configurado:\n${flowBlocks
              .map(
                (block, index) =>
                  `${index + 1}. ${block.title}: ${block.message} Botões: ${block.options
                    .map((option) => `${option.label} -> ${option.nextMessage}`)
                    .join(' | ')}`,
              )
              .join('\n')}`,
          },
          messages: nextMessages,
        }),
      });

      if (!response.ok) {
        let errorMessage = 'Não foi possível conectar com a OpenRouter agora.';

        try {
          const errorData = (await response.json()) as { error?: string; details?: string };
          errorMessage = errorData.details || errorData.error || errorMessage;
        } catch {
          // Keep the friendly message when the server returns a non-JSON error.
        }

        throw new Error(errorMessage);
      }

      const data = (await response.json()) as { reply: string; mode: string };
      const assistantReplies = splitAssistantReply(data.reply).map((content) => ({ role: 'assistant' as const, content }));
      setMessages((current) => [...current, ...assistantReplies]);

      if (data.mode === 'fallback') {
        setStatus('Modo demo ativo. Configure OPENROUTER_API_KEY para respostas com IA.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Não foi possível conectar com a OpenRouter agora.';
      setStatus(errorMessage.includes('OpenRouter') ? errorMessage : `OpenRouter: ${errorMessage}`);
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content: buildLocalAssistantReply(trimmedInput),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section
      id="simulador-agente"
      className="simulator-section section-shell scroll-mt-6 bg-[#030712] text-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(18,184,238,0.16),transparent_30rem),radial-gradient(circle_at_78%_28%,rgba(11,47,120,0.34),transparent_34rem),linear-gradient(135deg,#030712_0%,#061224_45%,#02040a_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(125,211,252,0.08)_1px,transparent_1px),linear-gradient(rgba(125,211,252,0.06)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40 [mask-image:radial-gradient(circle_at_center,black,transparent_78%)]" />
      <div className="absolute inset-x-0 top-24 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

      <div className="section-inner">
        <motion.div
          className="mb-14 max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100 shadow-[0_0_34px_rgba(18,184,238,0.10)] backdrop-blur-xl">
            <Sparkles className="h-4 w-4" />
            Simulador interativo
          </div>
          <h2 className="text-balance text-4xl font-semibold leading-tight text-white md:text-6xl">Teste gratuitamente sua automação no WhatsApp</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
            Faça um cadastro rápido, escolha entre Agente IA ou Fluxo de mensagens e veja como seu atendimento ficaria no WhatsApp.
          </p>
        </motion.div>

        <div className="simulator-wrapper grid grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8">
          <motion.div
            className="simulator-card rounded-2xl border border-white/10 bg-white/[0.94] p-4 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:p-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            {!leadCaptured ? (
              <LeadCaptureForm lead={lead} phoneError={phoneError} isRegisteringLead={isRegisteringLead} onUpdateLead={updateLead} onSubmit={handleLeadSubmit} />
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-950">Escolha como quer testar</h3>
                    <p className="text-sm text-slate-500">
                      Cadastro liberado. Escolha uma experiência, selecione um modelo e personalize os dados.
                    </p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
                    <Check className="h-5 w-5" />
                  </div>
                </div>

                <div className="experience-choice choice-toggle">
                  <button
                    type="button"
                    onClick={() => {
                      setBuilderMode('ia');
                      setIsFlowCanvasOpen(false);
                    }}
                    className={`choice-card ${builderMode === 'ia' ? 'active' : ''}`}
                  >
                    <span className="choice-card-icon">
                      <Wand2 className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">Agente IA</span>
                      <span className="mt-1 block text-sm">Atendimento inteligente com respostas personalizadas.</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBuilderMode('fluxo');
                      setIsFlowCanvasOpen(false);
                    }}
                    className={`choice-card ${builderMode === 'fluxo' ? 'active' : ''}`}
                  >
                    <span className="choice-card-icon">
                      <GitBranch className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block font-semibold">Fluxo de mensagens</span>
                      <span className="mt-1 block text-sm">Sequência guiada de mensagens para atendimento simples.</span>
                    </span>
                  </button>
                </div>

                <div className="template-section">
                  <div className="mb-3">
                    <h4 className="text-sm font-bold uppercase tracking-[0.16em] text-slate-600">
                      Escolha um modelo de estabelecimento
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {builderMode === 'fluxo'
                        ? 'Template de fluxo de mensagens para começar mais rápido.'
                        : 'Template de agente IA para começar mais rápido.'}
                    </p>
                  </div>
                  <div className="template-grid">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() => selectTemplate(template)}
                        className={`template-card ${selectedTemplateId === template.id ? 'active' : ''}`}
                      >
                        <span className="template-icon">{template.icon}</span>
                        <span className="min-w-0">
                          <span className="block truncate font-semibold">{template.label}</span>
                          <span className="mt-1 block text-xs leading-5">{template.description}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {builderMode === 'ia' ? (
                  <div className="config-form">
                    <AgentForm agent={agent} onUpdateAgent={updateAgent} />
                  </div>
                ) : (
                  <div className="config-form">
                    <FlowSetupPanel
                      agent={agent}
                      canEditFlow={canEditFlow}
                      isFlowCanvasOpen={isFlowCanvasOpen}
                      onUpdateAgent={updateAgent}
                      onOpenFlow={() => setIsFlowCanvasOpen((current) => !current)}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>

          <motion.div
            className="preview-card rounded-2xl border border-white/10 bg-white/[0.94] p-4 text-slate-950 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-2xl md:p-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
          >
            <div className="mb-5">
              <h3 className="text-2xl font-bold text-slate-950">Prévia do atendimento</h3>
              <p className="mt-1 text-sm text-slate-500">Veja como o cliente visualizará a conversa.</p>
            </div>
            <div className={`${leadCaptured ? '' : 'pointer-events-none opacity-70'}`}>
              <WhatsAppPreview
                mode={builderMode}
                agentName={agent.agentName}
                businessName={agent.businessName || lead.businessName}
                avatarSrc={selectedTemplate.avatarSrc}
                backgroundSrc={selectedTemplate.backgroundSrc}
                messages={messages}
                flowBlocks={flowBlocks}
                activeFlowIndex={activeFlowIndex}
                flowSelections={flowSelections}
                input={input}
                isSending={isSending}
                leadCaptured={leadCaptured}
                status={status}
                chatScrollRef={chatScrollRef}
                onInputChange={setInput}
                onSendMessage={sendMessage}
                onFlowOptionClick={selectFlowOption}
              />
              {!leadCaptured && (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <MessageCircle className="h-4 w-4 text-cyan-300" />
                  Faça o cadastro gratuito para liberar a prévia.
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {leadCaptured && builderMode === 'fluxo' && isFlowCanvasOpen && (
          <div className="mt-6">
            <FlowBuilder
              flowBlocks={flowBlocks}
              canEdit={canEditFlow}
              agentName={agent.agentName}
              businessName={agent.businessName || lead.businessName}
              avatarSrc={selectedTemplate.avatarSrc}
              backgroundSrc={selectedTemplate.backgroundSrc}
              activeFlowIndex={activeFlowIndex}
              flowSelections={flowSelections}
              chatScrollRef={chatScrollRef}
              onAddBlock={addFlowBlock}
              onRemoveBlock={removeFlowBlock}
              onUpdateBlock={updateFlowBlock}
              onAddOption={addFlowOption}
              onRemoveOption={removeFlowOption}
              onUpdateOption={updateFlowOption}
              onUpdateOptionMessage={updateFlowOptionMessage}
              onFlowOptionClick={selectFlowOption}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function LeadCaptureForm({
  lead,
  phoneError,
  isRegisteringLead,
  onUpdateLead,
  onSubmit,
}: {
  lead: LeadForm;
  phoneError: string;
  isRegisteringLead: boolean;
  onUpdateLead: (field: keyof LeadForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="form-header">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sky-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <UserRound className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-950">Crie sua prévia gratuita</h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Preencha os dados abaixo e veja como seu atendimento ficaria no WhatsApp.
            </p>
          </div>
        </div>
        <div className="benefit-pills">
          {['Sem cartão', 'Teste rápido', 'WhatsApp', 'Personalizado'].map((benefit) => (
            <span key={benefit} className="benefit-pill">
              <Check className="h-3.5 w-3.5" />
              {benefit}
            </span>
          ))}
        </div>
      </div>

      <div className="form-grid">
        <LeadInput label="Nome" value={lead.name} onChange={(value) => onUpdateLead('name', value)} required />
        <LeadInput
          label="WhatsApp"
          value={formatBrazilPhone(lead.phone)}
          onChange={(value) => onUpdateLead('phone', value)}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          error={phoneError}
          required
        />
        <LeadInput label="Nome da empresa" value={lead.businessName} onChange={(value) => onUpdateLead('businessName', value)} required />
        <LeadInput label="Segmento" value={lead.segment} onChange={(value) => onUpdateLead('segment', value)} required />
      </div>
      <label className="input-group">
        <span>O que você quer automatizar?</span>
        <textarea
          value={lead.goal}
          onChange={(event) => onUpdateLead('goal', event.target.value)}
          className="light-input min-h-24 w-full py-3"
          placeholder="Ex: atendimento, agendamento, vendas ou orçamentos."
          required
        />
      </label>

      <button type="submit" disabled={isRegisteringLead} className="primary-button btn-neon-solid flex w-full items-center justify-center gap-2 rounded-lg font-semibold disabled:opacity-60">
        {isRegisteringLead ? 'Liberando...' : 'Gerar meu teste gratuito'}
        <ArrowRight className="h-5 w-5" />
      </button>
      <p className="text-center text-xs font-medium text-slate-500">A prévia será liberada após o cadastro. Não precisa de cartão.</p>
    </form>
  );
}

function AgentForm({
  agent,
  onUpdateAgent,
}: {
  agent: AgentSettings;
  onUpdateAgent: (field: keyof AgentSettings, value: string) => void;
}) {
  return (
    <div className="form-grid">
      <LeadInput label="Nome da empresa" value={agent.businessName} onChange={(value) => onUpdateAgent('businessName', value)} />
      <LeadInput label="Nome do atendente/agente" value={agent.agentName} onChange={(value) => onUpdateAgent('agentName', value)} />
      <LeadInput label="Horário de atendimento" value={agent.schedule} onChange={(value) => onUpdateAgent('schedule', value)} />
      <LeadInput label="Serviços prestados" value={agent.services} onChange={(value) => onUpdateAgent('services', value)} />
      <LeadInput label="Média de valores ou Valor dos serviços" value={agent.prices} onChange={(value) => onUpdateAgent('prices', value)} />
      <LeadInput label="Tom de voz do atendente" value={agent.tone} onChange={(value) => onUpdateAgent('tone', value)} />
      <label className="input-group sm:col-span-2">
        <span>Outras informações necessárias para montar o atendimento</span>
        <textarea
          value={`${agent.rules}\n${agent.customInstructions}`}
          onChange={(event) => {
            onUpdateAgent('rules', event.target.value);
            onUpdateAgent('customInstructions', '');
          }}
          className="light-input min-h-28 w-full resize-y py-3"
          placeholder="Ex: qualificar o lead, oferecer avaliação, coletar horário, enviar para humano..."
        />
      </label>
    </div>
  );
}

function FlowSetupPanel({
  agent,
  canEditFlow,
  isFlowCanvasOpen,
  onUpdateAgent,
  onOpenFlow,
}: {
  agent: AgentSettings;
  canEditFlow: boolean;
  isFlowCanvasOpen: boolean;
  onUpdateAgent: (field: keyof AgentSettings, value: string) => void;
  onOpenFlow: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-sky-100 bg-white text-sky-600">
            <GitBranch className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-base font-bold text-slate-950">Configuração do fluxo</h4>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {canEditFlow
                ? 'Personalize os dados e abra o canvas para editar blocos, mensagens e caminhos livremente.'
                : 'Ajuste os dados do negócio e abra o canvas para visualizar o caminho do atendimento.'}
            </p>
          </div>
        </div>
      </div>

      <AgentForm agent={agent} onUpdateAgent={onUpdateAgent} />

      <button
        type="button"
        onClick={onOpenFlow}
        className="btn-neon-solid flex w-full items-center justify-center gap-2 rounded-lg font-semibold"
      >
        <GitBranch className="h-5 w-5" />
        {isFlowCanvasOpen ? 'Ocultar fluxo' : 'Abrir fluxo'}
      </button>

      <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600">
        {canEditFlow
          ? 'No modelo Personalizado, dê dois cliques em um bloco no canvas para editar conteúdo, botões e respostas.'
          : 'Use o modo personalizado quando quiser montar uma árvore do zero.'}
      </p>
    </div>
  );
}

function FlowBuilder({
  flowBlocks,
  canEdit,
  agentName,
  businessName,
  avatarSrc,
  backgroundSrc,
  activeFlowIndex,
  flowSelections,
  chatScrollRef,
  onAddBlock,
  onRemoveBlock,
  onUpdateBlock,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onUpdateOptionMessage,
  onFlowOptionClick,
}: {
  flowBlocks: FlowBlock[];
  canEdit: boolean;
  agentName: string;
  businessName: string;
  avatarSrc?: string;
  backgroundSrc?: string;
  activeFlowIndex: number;
  flowSelections: string[];
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
  onAddBlock: (type: FlowBlock['type']) => void;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, field: keyof FlowBlock, value: string) => void;
  onAddOption: (blockId: string) => void;
  onRemoveOption: (blockId: string, optionIndex: number) => void;
  onUpdateOption: (blockId: string, optionIndex: number, value: string) => void;
  onUpdateOptionMessage: (blockId: string, optionIndex: number, value: string) => void;
  onFlowOptionClick: (blockIndex: number, option: FlowOption) => void;
}) {
  const [selectedBlockId, setSelectedBlockId] = useState(flowBlocks[0]?.id ?? '');
  const [editingTarget, setEditingTarget] = useState<EditableTarget | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!flowBlocks.some((block) => block.id === selectedBlockId)) {
      setSelectedBlockId(flowBlocks[0]?.id ?? '');
    }
  }, [flowBlocks, selectedBlockId]);

  const layout = useMemo(() => buildFlowLayout(flowBlocks), [flowBlocks]);

  const openEditor = useCallback(
    (target: EditableTarget) => {
      if (canEdit) setEditingTarget(target);
    },
    [canEdit],
  );

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#edf1f5] text-slate-950">
      <div className="sticky top-0 z-20 flex flex-col gap-3 border-b border-slate-200 bg-white/92 px-5 py-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <GitBranch className="h-4 w-4 text-cyan-600" />
            Editor visual do fluxo
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {canEdit ? 'Dê dois cliques no bloco para editar.' : 'Abra o modo personalizado para alterar blocos e respostas.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
            <div className="flex flex-wrap gap-2">
              {blockTypes.map((blockType) => (
                <button
                  key={blockType.type}
                  type="button"
                  onClick={() => onAddBlock(blockType.type)}
                  className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
                >
                  <Plus className="mr-1 inline h-3.5 w-3.5" />
                  {blockType.label}
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            <Smartphone className="h-4 w-4" />
            Prévia WhatsApp
          </button>
        </div>
      </div>

      <div className="h-[min(72dvh,760px)] overflow-auto">
        <div className="relative" style={{ width: layout.width, height: layout.height }}>
          <svg className="pointer-events-none absolute inset-0 h-full w-full" width={layout.width} height={layout.height}>
            <defs>
              <marker id="flow-arrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto" markerUnits="strokeWidth">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#8a929c" />
              </marker>
            </defs>
            {layout.connections.map((connection) => (
              <path
                key={connection.id}
                d={`M ${connection.from.x} ${connection.from.y} C ${connection.from.x + 90} ${connection.from.y}, ${connection.to.x - 90} ${connection.to.y}, ${connection.to.x} ${connection.to.y}`}
                fill="none"
                stroke="#8a929c"
                strokeWidth="2"
                markerEnd="url(#flow-arrow)"
              />
            ))}
          </svg>

          {layout.blocks.map(({ block, x, y, height }, blockIndex) => (
            <FlowNode
              key={block.id}
              block={block}
              blockIndex={blockIndex}
              x={x}
              y={y}
              height={height}
              isSelected={selectedBlockId === block.id}
              canEdit={canEdit}
              onSelect={() => setSelectedBlockId(block.id)}
              onEdit={() => openEditor({ kind: 'block', blockId: block.id })}
            />
          ))}

          {layout.responses.map(({ block, option, optionIndex, x, y }) => (
            <ResponseNode
              key={`${block.id}-${option.id}`}
              option={option}
              x={x}
              y={y}
              canEdit={canEdit}
              onEdit={() => openEditor({ kind: 'option', blockId: block.id, optionIndex })}
            />
          ))}
        </div>
      </div>

      {editingTarget && canEdit && (
        <FlowEditModal
          target={editingTarget}
          flowBlocks={flowBlocks}
          onClose={() => setEditingTarget(null)}
          onRemoveBlock={onRemoveBlock}
          onUpdateBlock={onUpdateBlock}
          onAddOption={onAddOption}
          onRemoveOption={onRemoveOption}
          onUpdateOption={onUpdateOption}
          onUpdateOptionMessage={onUpdateOptionMessage}
        />
      )}

      {showPreview && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="absolute -right-3 -top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg"
              aria-label="Fechar prévia"
            >
              <X className="h-5 w-5" />
            </button>
            <WhatsAppPreview
              mode="fluxo"
              agentName={agentName}
              businessName={businessName}
              avatarSrc={avatarSrc}
              backgroundSrc={backgroundSrc}
              messages={[]}
              flowBlocks={flowBlocks}
              activeFlowIndex={activeFlowIndex}
              flowSelections={flowSelections}
              input=""
              isSending={false}
              leadCaptured
              status=""
              chatScrollRef={chatScrollRef}
              onInputChange={() => undefined}
              onSendMessage={async () => undefined}
              onFlowOptionClick={onFlowOptionClick}
            />
          </div>
        </div>
      )}
    </div>
  );
}

const FlowNode = memo(function FlowNode({
  block,
  blockIndex,
  x,
  y,
  height,
  isSelected,
  canEdit,
  onSelect,
  onEdit,
}: {
  block: FlowBlock;
  blockIndex: number;
  x: number;
  y: number;
  height: number;
  isSelected: boolean;
  canEdit: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  const typeStyle = getFlowTypeStyle(block.type);

  return (
    <article
      className={`absolute rounded-xl bg-white shadow-[0_18px_42px_rgba(15,23,42,0.13)] ring-1 transition ${
        isSelected ? 'ring-cyan-400' : 'ring-slate-200'
      }`}
      style={{ left: x, top: y, width: NODE_WIDTH, minHeight: height }}
      onClick={onSelect}
      onDoubleClick={onEdit}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-900 text-xs font-bold text-white">
          IG
        </span>
        <div className="min-w-0">
          <div className="text-[11px] leading-none text-slate-400">Instagram</div>
          <div className="truncate text-sm font-semibold text-slate-800">Enviar mensagem #{blockIndex + 1}</div>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="mb-3 inline-flex rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
          {typeStyle.label}
        </div>
        <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-700">{block.message}</div>

        <div className="mt-4 space-y-2">
          {block.options.map((option) => (
            <div key={option.id} className="flex justify-end">
              <div className="flex max-w-[230px] items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">
                <span className="truncate">{option.label}</span>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-slate-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-100 px-4 py-2 text-[11px] text-slate-400">
        {canEdit ? 'Duplo clique para editar' : 'Template bloqueado'}
      </div>
    </article>
  );
});

const ResponseNode = memo(function ResponseNode({
  option,
  x,
  y,
  canEdit,
  onEdit,
}: {
  option: FlowOption;
  x: number;
  y: number;
  canEdit: boolean;
  onEdit: () => void;
}) {
  return (
    <article
      className="absolute rounded-xl bg-white shadow-[0_14px_32px_rgba(15,23,42,0.10)] ring-1 ring-slate-200"
      style={{ left: x, top: y, width: RESPONSE_WIDTH }}
      onDoubleClick={onEdit}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-900 text-xs font-bold text-white">
          IG
        </span>
        <div>
          <div className="text-[11px] leading-none text-slate-400">Resposta</div>
          <div className="text-sm font-semibold text-slate-800">{option.label}</div>
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="rounded-lg bg-slate-50 px-3 py-3 text-sm leading-6 text-slate-700">{option.nextMessage}</div>
      </div>
      {canEdit && <div className="px-4 pb-3 text-[11px] text-slate-400">Duplo clique para editar</div>}
    </article>
  );
});

function FlowEditModal({
  target,
  flowBlocks,
  onClose,
  onRemoveBlock,
  onUpdateBlock,
  onAddOption,
  onRemoveOption,
  onUpdateOption,
  onUpdateOptionMessage,
}: {
  target: EditableTarget;
  flowBlocks: FlowBlock[];
  onClose: () => void;
  onRemoveBlock: (id: string) => void;
  onUpdateBlock: (id: string, field: keyof FlowBlock, value: string) => void;
  onAddOption: (blockId: string) => void;
  onRemoveOption: (blockId: string, optionIndex: number) => void;
  onUpdateOption: (blockId: string, optionIndex: number, value: string) => void;
  onUpdateOptionMessage: (blockId: string, optionIndex: number, value: string) => void;
}) {
  const block = flowBlocks.find((item) => item.id === target.blockId);
  if (!block) return null;

  const optionIndex = target.kind === 'option' ? target.optionIndex : null;
  const selectedOption = optionIndex !== null ? block.options[optionIndex] : null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90dvh] w-[min(920px,94vw)] overflow-auto rounded-2xl bg-white p-6 text-slate-950 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-cyan-700">Edição do fluxo personalizado</div>
            <h3 className="mt-1 text-2xl font-bold">{target.kind === 'option' ? selectedOption?.label : block.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {target.kind === 'block' ? (
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Tipo</span>
                <select
                  value={block.type}
                  onChange={(event) => onUpdateBlock(block.id, 'type', event.target.value)}
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-400"
                >
                  {blockTypes.map((blockType) => (
                    <option key={blockType.type} value={blockType.type}>
                      {blockType.label}
                    </option>
                  ))}
                </select>
              </label>
              <TextInput label="Nome do bloco" value={block.title} onChange={(value) => onUpdateBlock(block.id, 'title', value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Mensagem principal</span>
                <textarea
                  value={block.message}
                  onChange={(event) => onUpdateBlock(block.id, 'message', event.target.value)}
                  className="min-h-40 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-cyan-400"
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  onRemoveBlock(block.id);
                  onClose();
                }}
                className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Remover bloco
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">Botões e próximas mensagens</span>
                <button type="button" onClick={() => onAddOption(block.id)} className="rounded-md bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
                  <Plus className="mr-1 inline h-3.5 w-3.5" />
                  Botão
                </button>
              </div>
              {block.options.map((option, index) => (
                <div key={option.id} className="rounded-xl border border-slate-200 p-3">
                  <div className="flex gap-2">
                    <input
                      value={option.label}
                      onChange={(event) => onUpdateOption(block.id, index, event.target.value)}
                      className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-cyan-400"
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveOption(block.id, index)}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-red-200 text-red-600"
                      aria-label="Remover botão"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <textarea
                    value={option.nextMessage}
                    onChange={(event) => onUpdateOptionMessage(block.id, index, event.target.value)}
                    className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-cyan-400"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          selectedOption && (
            <div className="space-y-4">
              <TextInput label="Texto do botão" value={selectedOption.label} onChange={(value) => onUpdateOption(block.id, target.optionIndex, value)} />
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Próxima mensagem</span>
                <textarea
                  value={selectedOption.nextMessage}
                  onChange={(event) => onUpdateOptionMessage(block.id, target.optionIndex, event.target.value)}
                  className="min-h-44 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-cyan-400"
                />
              </label>
            </div>
          )
        )}
      </div>
    </div>
  );
}

function FormattedMessage({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+?\*\*)/g);

  return (
    <span className="whitespace-pre-line">
      {parts.map((part, index) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={`${part}-${index}`} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </span>
  );
}

function WhatsAppPreview({
  mode,
  agentName,
  businessName,
  avatarSrc,
  backgroundSrc,
  messages,
  flowBlocks,
  activeFlowIndex,
  flowSelections,
  input,
  isSending,
  leadCaptured,
  status,
  chatScrollRef,
  onInputChange,
  onSendMessage,
  onFlowOptionClick,
}: {
  mode: 'ia' | 'fluxo';
  agentName: string;
  businessName: string;
  avatarSrc?: string;
  backgroundSrc?: string;
  messages: ChatMessage[];
  flowBlocks: FlowBlock[];
  activeFlowIndex: number;
  flowSelections: string[];
  input: string;
  isSending: boolean;
  leadCaptured: boolean;
  status: string;
  chatScrollRef: React.RefObject<HTMLDivElement | null>;
  onInputChange: (value: string) => void;
  onSendMessage: () => Promise<void>;
  onFlowOptionClick: (blockIndex: number, option: FlowOption) => void;
}) {
  const displayAgentName = agentName.trim() || 'Clara';
  const displayBusinessName = businessName.trim() || 'sua empresa';
  const initials = (displayAgentName || displayBusinessName).slice(0, 2).toUpperCase();
  const isFlowMode = mode === 'fluxo';
  const chatBackgroundStyle = backgroundSrc
    ? {
        backgroundImage: `linear-gradient(rgba(11, 20, 26, 0.16), rgba(11, 20, 26, 0.34)), url(${backgroundSrc})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }
    : undefined;

  return (
    <div className="phone-preview mx-auto max-w-[440px] rounded-[2rem] border border-slate-700/80 bg-slate-950 p-3 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
      <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-slate-700" />
      <div className="flex h-[680px] min-h-0 flex-col overflow-hidden rounded-[1.45rem] border border-black/40 bg-[#0b141a]">
        <div className="flex items-center justify-between gap-3 border-b border-black/30 bg-[#202c33] px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-emerald-300/35 bg-gradient-to-br from-cyan-300 to-emerald-300 text-sm font-black text-slate-950 shadow-[0_0_0_3px_rgba(0,168,132,0.12)]">
              {initials}
              {avatarSrc && (
                <img
                  src={avatarSrc}
                  alt={`Foto de perfil de ${displayAgentName || displayBusinessName}`}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-semibold text-white">{displayAgentName}</div>
              <div className="truncate text-xs text-emerald-300">
                {`${displayBusinessName} • online`}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <button className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Ligar">
              <Phone className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Vídeo">
              <Video className="h-4 w-4" />
            </button>
            <button className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/10" aria-label="Mais opções">
              <MoreVertical className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={chatScrollRef} className="min-h-0 flex-1 overflow-y-auto bg-[#0b141a] p-4" style={chatBackgroundStyle}>
          <div className="space-y-3">
            {isFlowMode
              ? flowBlocks.slice(0, activeFlowIndex + 1).map((block, index) => {
                  const selectedOption = block.options.find((option) => option.label === flowSelections[index]);

                  return (
                    <div key={block.id} className="space-y-3">
                      <div className="flex justify-start">
                        <div className="max-w-[88%] rounded-lg rounded-tl-sm bg-[#202c33] px-4 py-3 text-sm leading-relaxed text-slate-100 shadow">
                          <div className="mb-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                            Bloco {index + 1} • {block.title}
                          </div>
                          <FormattedMessage content={block.message} />
                          {index === activeFlowIndex && block.options.length > 0 && (
                            <div className="mt-3 grid gap-2">
                              {block.options.map((option) => (
                                <button
                                  key={option.id}
                                  type="button"
                                  onClick={() => onFlowOptionClick(index, option)}
                                  className="rounded-lg border border-[#00a884]/45 bg-[#111b21] px-3 py-2 text-left text-sm font-medium text-[#53d8b1] transition hover:bg-[#16262d]"
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          )}
                          <div className="mt-1 text-right text-[10px] text-white/45">20:31</div>
                        </div>
                      </div>
                      {flowSelections[index] && (
                        <div className="flex justify-end">
                          <div className="max-w-[82%] rounded-lg rounded-tr-sm bg-[#005c4b] px-4 py-2 text-sm leading-relaxed text-white shadow">
                            {flowSelections[index]}
                            <div className="mt-1 text-right text-[10px] text-white/45">20:31</div>
                          </div>
                        </div>
                      )}
                      {selectedOption && (
                        <div className="flex justify-start">
                          <div className="max-w-[88%] rounded-lg rounded-tl-sm bg-[#202c33] px-4 py-3 text-sm leading-relaxed text-slate-100 shadow">
                            <FormattedMessage content={selectedOption.nextMessage} />
                            <div className="mt-1 text-right text-[10px] text-white/45">20:31</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              : messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[82%] rounded-lg px-4 py-2 text-sm leading-relaxed shadow ${
                        message.role === 'user' ? 'rounded-tr-sm bg-[#005c4b] text-white' : 'rounded-tl-sm bg-[#202c33] text-slate-100'
                      }`}
                    >
                      <FormattedMessage content={message.content} />
                      <div className="mt-1 text-right text-[10px] text-white/45">20:31</div>
                    </div>
                  </div>
                ))}
            {!isFlowMode && isSending && (
              <div className="flex justify-start">
                <div className="rounded-lg rounded-tl-sm bg-[#202c33] px-4 py-2 text-sm text-slate-300">digitando...</div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-black/30 bg-[#202c33] p-3">
          {status && <p className="mb-3 text-xs text-sky-200">{status}</p>}
          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(event) => onInputChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') void onSendMessage();
              }}
              className="h-12 min-w-0 flex-1 rounded-full border border-transparent bg-[#2a3942] px-4 text-white outline-none transition placeholder:text-slate-400 focus:border-sky-200/60"
              placeholder={isFlowMode ? 'Clique em um botão para avançar' : leadCaptured ? 'Mensagem' : 'Preencha o lead para testar'}
              disabled={!leadCaptured || isSending || isFlowMode}
            />
            <button
              type="button"
              onClick={() => void onSendMessage()}
              disabled={!leadCaptured || isSending || !input.trim() || isFlowMode}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#00a884] text-white transition hover:bg-[#06cf9c] disabled:opacity-50"
              aria-label="Enviar mensagem"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LeadInput({
  label,
  value,
  onChange,
  required,
  type = 'text',
  inputMode,
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  inputMode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="input-group">
      <span>{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="light-input h-12 w-full"
        aria-invalid={Boolean(error)}
        required={required}
      />
      {error && <p className="mt-2 text-xs font-semibold text-rose-600">{error}</p>}
    </label>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-11 w-full rounded-lg border border-slate-200 px-3 outline-none focus:border-cyan-400"
      />
    </label>
  );
}

function buildFlowLayout(flowBlocks: FlowBlock[]) {
  const blocks = flowBlocks.map((block, index) => {
    const x = 80 + index * COLUMN_GAP;
    const y = 130 + (index % 2) * 54;
    const height = Math.max(260, 178 + block.options.length * OPTION_ROW);
    return { block, x, y, height };
  });

  const responses = blocks.flatMap(({ block, x, y }, blockIndex) =>
    block.options.map((option, optionIndex) => ({
      block,
      blockIndex,
      option,
      optionIndex,
      x: x + NODE_WIDTH + 120,
      y: y + 42 + optionIndex * 116,
    })),
  );

  const connections = blocks.flatMap(({ block, x, y }) =>
    block.options.map((option, optionIndex) => {
      const response = responses.find((item) => item.block.id === block.id && item.option.id === option.id);
      return {
        id: `${block.id}-${option.id}`,
        from: {
          x: x + NODE_WIDTH - 38,
          y: y + OPTION_TOP + optionIndex * OPTION_ROW + 16,
        },
        to: {
          x: response ? response.x : x + NODE_WIDTH + 180,
          y: response ? response.y + 62 : y,
        },
      };
    }),
  );

  const lastBlock = blocks[blocks.length - 1];
  const width = Math.max(1320, (lastBlock?.x ?? 0) + NODE_WIDTH + RESPONSE_WIDTH + 280);
  const maxResponseBottom = responses.reduce((max, item) => Math.max(max, item.y + 190), 0);
  const height = Math.max(760, maxResponseBottom + 120);

  return { blocks, responses, connections, width, height };
}

function createFlowBlock(
  type: FlowBlock['type'],
  title: string,
  message: string,
  options: Array<string | FlowOption> = getDefaultOptions(type),
): FlowBlock {
  return {
    id: `${type}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    title,
    message,
    options: options.map((option) => (typeof option === 'string' ? createFlowOption(option) : option)),
  };
}

function getDefaultOptions(type: FlowBlock['type']) {
  const defaults: Record<FlowBlock['type'], string[]> = {
    saudacao: ['Ver preços', 'Ver horários', 'Localização'],
    pergunta: ['Tenho uma dúvida', 'Quero uma indicação', 'Falar com atendente'],
    opcao: ['Serviço principal', 'Combo', 'Outro serviço'],
    agenda: ['Quero marcar um horário', 'Ver disponibilidade', 'Falar com atendente'],
    humano: ['Chamar atendente'],
  };

  return defaults[type];
}

function getDefaultBlockMessage(type: FlowBlock['type']) {
  const defaults: Record<FlowBlock['type'], string> = {
    saudacao: 'Olá! Vou te ajudar a encontrar a melhor opção de atendimento.',
    pergunta: 'Me conta um pouco mais para eu entender o que você precisa.',
    opcao: 'Escolha uma das opções abaixo para eu seguir pelo caminho certo.',
    agenda: 'Vamos encontrar o melhor horário para você.',
    humano: 'Vou enviar seu atendimento para uma pessoa da equipe continuar.',
  };

  return defaults[type];
}

function createFlowOption(label: string, nextMessage = getContextualNextMessage(label)): FlowOption {
  return {
    id: `opcao-${Math.random().toString(36).slice(2, 9)}`,
    label,
    nextMessage,
  };
}

function getContextualNextMessage(label: string) {
  const normalizedLabel = label
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

  if (normalizedLabel.includes('preco') || normalizedLabel.includes('valor')) {
    return 'Claro. Vou te mostrar os valores principais e, se fizer sentido, posso calcular uma estimativa para o que você precisa.';
  }
  if (normalizedLabel.includes('horario') || normalizedLabel.includes('agenda') || normalizedLabel.includes('disponibilidade')) {
    return 'Perfeito. Vou verificar os melhores horários disponíveis e te pedir o dia ou período que fica mais confortável.';
  }
  if (normalizedLabel.includes('localizacao') || normalizedLabel.includes('endereco')) {
    return 'Sem problema. Vou te enviar a localização, ponto de referência e opções para chegar até o atendimento.';
  }
  if (normalizedLabel.includes('atendente') || normalizedLabel.includes('humano')) {
    return 'Certo. Vou reunir o contexto da conversa e encaminhar para uma pessoa da equipe continuar o atendimento.';
  }
  if (normalizedLabel.includes('combo') || normalizedLabel.includes('servico')) {
    return 'Boa escolha. Vou explicar o que está incluso nessa opção e confirmar se ela combina com a sua necessidade.';
  }

  return 'Entendi. Vou continuar por esse caminho e fazer a próxima pergunta para avançar no atendimento.';
}

function getFlowTypeStyle(type: FlowBlock['type']) {
  const styles: Record<FlowBlock['type'], { label: string }> = {
    saudacao: { label: 'Mensagem inicial' },
    pergunta: { label: 'Coleta de resposta' },
    opcao: { label: 'Decisão por botões' },
    agenda: { label: 'Agendamento' },
    humano: { label: 'Transferência' },
  };

  return styles[type];
}
