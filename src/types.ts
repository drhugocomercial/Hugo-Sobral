/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Procedure {
  id: string;
  name: string;
  description: string;
  category: 'EXPERIÊNCIAS FACIAIS' | 'CUIDADOS CORPORAIS' | 'PROCEDIMENTOS DE TRATAMENTO';
  price: number;
  indication: string;
  imageUrl: string;
  active: boolean;
}

export interface BookingMessageLog {
  id: string;
  sentAt: string;
  type: 'Criação' | 'Confirmação' | 'Reagendamento' | 'Cancelamento' | 'Conclusão' | 'Lembrete';
  status: 'Sucesso' | 'Falha';
  content?: string;
  deliveryStatus?: 'Enviado' | 'Entregue' | 'Falhou' | 'Pendente';
  errorMessage?: string;
}

export interface Booking {
  id: string;
  clientName: string;
  clientPhone: string;
  procedureId: string;
  procedureName: string;
  date: string; // YYYY-MM-DD or DD/MM/YYYY
  time: string;
  professional: string;
  status: 'Pendente' | 'Confirmado' | 'Cancelado' | 'Concluído';
  cancelledReason?: string;
  completedAt?: string;
  observations?: string;
  createdAt: string;
  history: BookingMessageLog[];
}

export interface AdminCredentials {
  email: string;
  isAuthenticated: boolean;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  imageUrl?: string;
  active: boolean;
  order: number;
}
