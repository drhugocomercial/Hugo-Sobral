/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Procedure, Booking } from './types';

export const INITIAL_PROCEDURES: Procedure[] = [
  // EXPERIÊNCIAS FACIAIS
  {
    id: 'fac-limpeza-fotonica',
    name: 'Limpeza de Pele Fotônica',
    description: 'Protocolo avançado de assepsia cutânea associado à terapia de luz de LED de baixa intensidade. Promove a regeneração celular acelerada, controle microbiano e potencialização imediata da hidratação.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 199.00,
    indication: 'Todos os tipos de pele, revitalização profunda, detox urbano e controle de oleosidade.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-pele-seda',
    name: 'Protocolo Pele de Seda',
    description: 'Tratamento nutritivo e esfoliação micrométrica que remove filamentos ásperos e células queratinizadas. Proporciona uma sensibilidade aveludada, luminosidade radiante e toque incomparavelmente macio.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 150.00,
    indication: 'Peles desvitalizadas, opacas, com toque áspero ou ressecamento sazonal.',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-dermaplaning',
    name: 'Dermaplaning',
    description: 'Esfoliação mecânica superficial de alta precisão através do uso de lâmina cirúrgica esterilizada. Remove toda a camada de células mortas e a penugem facial (vello), promovendo melhora instantânea na absorção de ativos cosméticos.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 130.00,
    indication: 'Irregularidades de textura, poros aparentes e preparo da pele para ocasiões especiais ou maquiagem impecável.',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-miracle-face',
    name: 'Miracle Face - Drenagem Facial',
    description: 'Massagem manual exclusiva que redefine os contornos faciais, reduz o inchaço e promove a oxigenação dos tecidos. Proporciona efeito de lifting sutil e imediato, ideal para a rotina do executivo atuante.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 150.00,
    indication: 'Retenção hídrica na face, estresse muscular, olheiras de cansaço e flacidez inicial.',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-hydragloss',
    name: 'HydraGloss Lips',
    description: 'Tratamento regenerador labial de super hidratação e preenchimento de linhas finas por meio de micro-infusão de vitaminas estimulantes e ácido hialurônico de baixo peso molecular. Devolve o brilho natural e contorno jovial.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 199.00,
    indication: 'Lábios extremamente ressecados, com descamação e linhas finas de expressão.',
    imageUrl: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-micropigmentacao',
    name: 'Micropigmentação Labial',
    description: 'Técnica de implantação de pigmentos nobres que suavizam assimetrias e conferem cor saudável e uniforme com efeito de maquiagem semipermanente natural. Perfeito para manter a imagem profissional sempre polida.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 299.00,
    indication: 'Lábios pálidos, escurecidos ou com perda de definição natural de contorno.',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-argilaterapia',
    name: 'Blend Facial com Argilaterapia',
    description: 'Envolvimento facial terapêutico utilizando argilas seletas ricas em minerais detox e silício orgânico. Acalma, nutre e purifica a pele de poluentes, resíduos e toxinas do dia a dia.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 99.00,
    indication: 'Pele com sensibilidade excessiva, estressada, reativa ou com irritação.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'fac-skinbooster',
    name: 'SkinBooster',
    description: 'Tratamento de hidratação injetável profunda por meio de ácido hialurônico reticulado suave. Capta moléculas de água nas camadas mais profundas da derme, promovendo restauração estrutural e firmeza incomparável.',
    category: 'EXPERIÊNCIAS FACIAIS',
    price: 299.00,
    indication: 'Peles maduras, rugas finas, desidratação crônica impossível de tratar com cremes comuns.',
    imageUrl: 'https://images.unsplash.com/photo-1600334189155-8130d2b1709d?w=800&auto=format&fit=crop&q=80',
    active: true
  },

  // CUIDADOS CORPORAIS
  {
    id: 'corp-drenagem',
    name: 'Drenagem Linfática',
    description: 'Técnica manual suave e rítmica que estimula o sistema linfático a eliminar o excesso de líquidos e resíduos metabólicos. Reduz a fadiga corporal, melhora a circulação geral e estimula o relaxamento profundo.',
    category: 'CUIDADOS CORPORAIS',
    price: 210.00,
    indication: 'Retenção de líquidos, má circulação, sensação de pernas pesadas e pós-operatórios.',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac9283ca47?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-relaxante',
    name: 'Massagem Relaxante',
    description: 'Uma terapia corporal clássica focada no relaxamento integral. Movimentos longos, fluidos e pressões calibradas aliviam as tensões acumuladas ao longo da semana corporativa, promovendo um sono revigorante.',
    category: 'CUIDADOS CORPORAIS',
    price: 140.00,
    indication: 'Tensão física generalizada, estresse executivo elevado, insônia e esgotamento mental.',
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-massagem-ventosa',
    name: 'Massagem + Ventosaterapia',
    description: 'A união perfeita entre a suavidade da massagem relaxante muscular e a sucção localizada das ventosas térmicas. Acelera intensamente a drenagem de toxinas miofasciais e estimula a microcirculação na fáscia muscular profunda.',
    category: 'CUIDADOS CORPORAIS',
    price: 190.00,
    indication: 'Dores crônicas nas costas, contraturas agudas provocadas por má postura e estresse postural.',
    imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-ventosaterapia',
    name: 'Ventosaterapia',
    description: 'Terapia milenar baseada na aplicação de copos de sucção a vácuo sob pontos meridionais e zonas de dor crônica. Libera a estagnação sanguínea, reduz a rigidez de tendões e acelera a recuperação esportiva e do estresse diário.',
    category: 'CUIDADOS CORPORAIS',
    price: 130.00,
    indication: 'Pontos de gatilho de estresse, contratura muscular severa e reabilitação de cansaço extremo.',
    imageUrl: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-spa-pes',
    name: 'SPA dos Pés',
    description: 'Um ritual de puro afeto para as extremidades que sustentam o seu dia. Imersão em água morna com sais minerais raros e ervas aromáticas, seguida de esfoliação estimulante de quartzo e massagem podal profunda.',
    category: 'CUIDADOS CORPORAIS',
    price: 99.00,
    indication: 'Fadiga plantar, pés doloridos por calçados estruturados e executivos que viajam muito.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-modeladora',
    name: 'Massagem Modeladora',
    description: 'Técnica vigorosa com movimentos rápidos, profundos e firmes baseados em fisiologia circulatória. Modela curvas, estimula a quebra de células adiposas superficiais e reposiciona e tonifica os tecidos da pele.',
    category: 'CUIDADOS CORPORAIS',
    price: 199.00,
    indication: 'Gordura localizada, perda sutil de contornos e necessidade de melhora do tônus corporal.',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac9283ca47?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-liberacao-miofascial',
    name: 'Liberação Miofascial',
    description: 'Técnica de reabilitação avançada realizada manualmente e com instrumentação apropriada sobre a fáscia muscular rígida. Devolve a amplitude de movimentos, desfaz aderências profundas e previne lesões graves de esforço repetitivo.',
    category: 'CUIDADOS CORPORAIS',
    price: 250.00,
    indication: 'Praticantes de atividade física regular, contraturas cervicais graves ou restrição de mobilidade dorsal.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-bandagem',
    name: 'Bandagem Elástica Funcional',
    description: 'Aplicação estratégica de faixas neuro-proprioceptivas puras que garantem estabilidade articular ativa sem limitar as funções corporais. Alivia a dor regional através de drenagem microscópica constante do tecido.',
    category: 'CUIDADOS CORPORAIS',
    price: 99.00,
    indication: 'Dores musculares e articulares no cotidiano, fadiga postural e instabilidade leve.',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac9283ca47?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'corp-esfoliacao',
    name: 'Esfoliação Corporal + Hidratação Profunda',
    description: 'Um ritual sensorial completo de renovação cutânea corporal. Remove delicadamente impurezas e células mortas através de extratos finos, seguido de uma luxuosa massagem corporal hidratante com blends de óleos essenciais seletos.',
    category: 'CUIDADOS CORPORAIS',
    price: 150.00,
    indication: 'Rejuvenescimento da pele corporal global, relaxamento sensorial de luxo e restauração hidrolipídica.',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80',
    active: true
  },

  // PROCEDIMENTOS DE TRATAMENTO
  {
    id: 'trat-peeling-algas-facial',
    name: 'Peeling de Algas Facial',
    description: 'Protocolo de peeling 100% natural, orgânico e sem ácidos nocivos, feito de espículas e minerais de algas marinhas puras coletadas em águas despoluídas. Promove descamação controlada, removendo acnes, linhas finas e cicatrizes de expressão.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 180.00,
    indication: 'Manchas de sol, cicatrizes de acne, rejuvenescimento geral da face e rugas médias.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'trat-peeling-algas-costas',
    name: 'Peeling de Algas Costas',
    description: 'Tratamento intensivo focado na região dorsal. Limpa, esfolia profundamente drenando inflamações superficiais e clareia foliculites persistentes através da dermo-indução mineral das algas.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 220.00,
    indication: 'Foliculites nas costas, cicatrizes escuras dorsais e oleosidade sebácea excessiva na área.',
    imageUrl: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'trat-peeling-algas-gluteos',
    name: 'Peeling de Algas Glúteos',
    description: 'Protocolo especial para atenuação de imperfeições, manchas de atrito de calças e queratinização folicular na região glútea. Uniformiza e suaviza a textura da pele de forma notável.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 160.00,
    indication: 'Manchas escurecidas, foliculites decorrentes de longos períodos sentado em escritório e flacidez de textura.',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac9283ca47?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'trat-peeling-algas-clareamento',
    name: 'Peeling de Algas Clareamento',
    description: 'Aplicação localizada focada no clareamento homogêneo de áreas fotorreativas ou com hiperpigmentação pós-inflamatória crônica (como axilas ou virilhas). Age estimulando a renovação celular sem queimar a pele.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 130.00,
    indication: 'Hiperpigmentações localizadas por atrito constante ou estresse inflamatório anterior.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'trat-microagulhamento-facial',
    name: 'Microagulhamento Facial - Drug Delivery',
    description: 'Perfuração microscópica fracionada com agulhas finíssimas estéreis que abre canais físicos para drug-delivery imediato de fatores de crescimento e soros de alta performance, estimulando a neocolagênese natural indutiva.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 250.00,
    indication: 'Flacidez tissular moderada, rugas expressivas profundas, marcas de expressão e sequelas cicatriciais.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'trat-inducao-colageno',
    name: 'Indução Percutânea de Colágeno',
    description: 'Tratamento fisiológico regenerativo que ativa canais de migração celular para remodelar cicatrizes e marcas dérmicas antigas através da liberação interna de citocinas cicatrizantes saudáveis conduzindo a colágeno firme.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 170.00,
    indication: 'Rejuvenescimento, prevenção de flacidez decorrente da idade ou envelhecimento solar precoce.',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=80',
    active: true
  },
  {
    id: 'trat-microagulhamento-estrias',
    name: 'Microagulhamento Estrias',
    description: 'Procedimento localizado indutor de colágeno que atua reorganizando as fibras rompidas (estrias brancas ou vermelhas), restabelecendo a elasticidade interna e reduzindo sensivelmente a largura e profundidade das depressões lineares.',
    category: 'PROCEDIMENTOS DE TRATAMENTO',
    price: 150.00,
    indication: 'Estrias corporais avermelhadas (agudas) ou esbranquiçadas (crônicas na pele).',
    imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac9283ca47?w=800&auto=format&fit=crop&q=80',
    active: true
  }
];

export const AVAILABLE_HOURS = [
  '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'b-1',
    clientName: 'Roberto Alencar',
    clientPhone: '95981036729',
    procedureId: 'fac-limpeza-fotonica',
    procedureName: 'Limpeza de Pele Fotônica',
    date: '13/06/2026',
    time: '09:00',
    professional: 'Dr. Hugo Sobral',
    status: 'Confirmado',
    createdAt: '12/06/2026 14:02:00',
    history: [
      { id: 'h1_1', sentAt: '12/06/2026 14:02:15', type: 'Criação', status: 'Sucesso' },
      { id: 'h1_2', sentAt: '12/06/2026 16:30:22', type: 'Confirmação', status: 'Sucesso' }
    ]
  },
  {
    id: 'b-2',
    clientName: 'Clarice Lispector',
    clientPhone: '92991223344',
    procedureId: 'fac-pele-seda',
    procedureName: 'Protocolo Pele de Seda',
    date: '13/06/2026',
    time: '14:00',
    professional: 'Dr. Hugo Sobral',
    status: 'Pendente',
    createdAt: '13/06/2026 08:30:00',
    history: [
      { id: 'h2_1', sentAt: '13/06/2026 08:31:05', type: 'Criação', status: 'Sucesso' }
    ]
  },
  {
    id: 'b-3',
    clientName: 'Carlos Drummond',
    clientPhone: '11988887777',
    procedureId: 'corp-relaxante',
    procedureName: 'Massagem Relaxante',
    date: '14/06/2026',
    time: '11:00',
    professional: 'Dra. Ana Costa',
    status: 'Confirmado',
    createdAt: '11/06/2026 10:15:00',
    history: [
      { id: 'h3_1', sentAt: '11/06/2026 10:17:12', type: 'Criação', status: 'Sucesso' },
      { id: 'h3_2', sentAt: '12/06/2026 11:20:00', type: 'Confirmação', status: 'Sucesso' }
    ]
  },
  {
    id: 'b-4',
    clientName: 'Mariana Silva',
    clientPhone: '21977776666',
    procedureId: 'trat-peeling-algas-facial',
    procedureName: 'Peeling de Algas Facial',
    date: '12/06/2026',
    time: '16:00',
    professional: 'Dr. Hugo Sobral',
    status: 'Concluído',
    completedAt: '12/06/2026 17:15:00',
    createdAt: '10/06/2026 09:00:00',
    history: [
      { id: 'h4_1', sentAt: '10/06/2026 09:02:10', type: 'Criação', status: 'Sucesso' },
      { id: 'h4_2', sentAt: '10/06/2026 11:00:05', type: 'Confirmação', status: 'Sucesso' },
      { id: 'h4_3', sentAt: '12/06/2026 17:15:00', type: 'Conclusão', status: 'Sucesso' }
    ]
  },
  {
    id: 'b-5',
    clientName: 'Joaquim Nabuco',
    clientPhone: '81955554444',
    procedureId: 'corp-ventosaterapia',
    procedureName: 'Ventosaterapia',
    date: '15/06/2026',
    time: '15:00',
    professional: 'Dra. Ana Costa',
    status: 'Cancelado',
    cancelledReason: 'Paciente justificou incompatibilidade de agenda comercial.',
    createdAt: '11/06/2026 15:30:00',
    history: [
      { id: 'h5_1', sentAt: '11/06/2026 15:32:00', type: 'Criação', status: 'Sucesso' },
      { id: 'h5_2', sentAt: '12/06/2026 10:10:00', type: 'Cancelamento', status: 'Sucesso' }
    ]
  }
];
