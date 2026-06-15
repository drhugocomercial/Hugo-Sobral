/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, LogOut, Plus, Edit2, CheckCircle2, XCircle, RefreshCw, Trash2, Save, X, Eye, EyeOff,
  Search, Filter, Calendar, Clock, MessageSquare, Phone, User, Check, AlertCircle, History, Send,
  SlidersHorizontal, LayoutDashboard, Database, ClipboardList, CheckCircle
} from 'lucide-react';
import { Procedure, Booking, BookingMessageLog, Professional } from '../types';
import { AVAILABLE_HOURS } from '../data';

interface AdminPanelProps {
  procedures: Procedure[];
  onUpdateProcedures: (newProcedures: Procedure[]) => void;
  bookings: Booking[];
  onUpdateBookings: (newBookings: Booking[]) => void;
  professionals: Professional[];
  onUpdateProfessionals: (newProfessionals: Professional[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Standard SHA-256 sync function to hash sensitive values
export function sha256Sync(ascii: string): string {
  function rightRotate(value: number, amount: number) {
    return (value >>> amount) | (value << (32 - amount));
  }
  
  const h = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
  ];
  
  const k = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];

  const words: number[] = [];
  const asciiLength = ascii.length;
  for (let i = 0; i < asciiLength; i++) {
    words[i >> 2] |= (ascii.charCodeAt(i) & 0xff) << (24 - (i % 4) * 8);
  }
  
  let wordsCount = (asciiLength + 8) >> 2;
  wordsCount = ((wordsCount + 15) & ~15) + 16;
  
  words[wordsCount - 1] = asciiLength * 8;
  const wordIndex = asciiLength >> 2;
  words[wordIndex] |= 0x80 << (24 - (asciiLength % 4) * 8);

  const w = new Array(64);
  for (let i = 0; i < wordsCount; i += 16) {
    let a = h[0];
    let b = h[1];
    let c = h[2];
    let d = h[3];
    let e = h[4];
    let f = h[5];
    let g = h[6];
    let hBlock = h[7];

    for (let j = 0; j < 64; j++) {
      if (j < 16) {
        w[j] = words[i + j] | 0;
      } else {
        const s0 = rightRotate(w[j - 15], 7) ^ rightRotate(w[j - 15], 18) ^ (w[j - 15] >>> 3);
        const s1 = rightRotate(w[j - 2], 17) ^ rightRotate(w[j - 2], 19) ^ (w[j - 2] >>> 10);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) | 0;
      }

      const ch = (e & f) ^ (~e & g);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const Sigma0 = rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22);
      const Sigma1 = rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25);
      
      const temp1 = (hBlock + Sigma1 + ch + k[j] + w[j]) | 0;
      const temp2 = (Sigma0 + maj) | 0;

      hBlock = g;
      g = f;
      f = e;
      e = (d + temp1) | 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) | 0;
    }

    h[0] = (h[0] + a) | 0;
    h[1] = (h[1] + b) | 0;
    h[2] = (h[2] + c) | 0;
    h[3] = (h[3] + d) | 0;
    h[4] = (h[4] + e) | 0;
    h[5] = (h[5] + f) | 0;
    h[6] = (h[6] + g) | 0;
    h[7] = (h[7] + hBlock) | 0;
  }

  let hashString = '';
  for (let i = 0; i < 8; i++) {
    const hex = (h[i] >>> 0).toString(16);
    hashString += (hex.length === 8 ? hex : '0'.repeat(8 - hex.length) + hex);
  }
  return hashString;
}

export default function AdminPanel({ 
  procedures, 
  onUpdateProcedures, 
  bookings, 
  onUpdateBookings, 
  professionals,
  onUpdateProfessionals,
  isOpen, 
  onClose 
}: AdminPanelProps) {
  // --- ACCESS CONTROL INITIALIZATION IN DATABASE ---
  useEffect(() => {
    if (!localStorage.getItem('hugo_admin_username_db')) {
      localStorage.setItem('hugo_admin_username_db', 'drhugo.beauty');
    }
    if (!localStorage.getItem('hugo_admin_password_hash_db')) {
      localStorage.setItem('hugo_admin_password_hash_db', sha256Sync('drhugo123')); // default: 'drhugo123'
    }
    if (!localStorage.getItem('hugo_admin_email_db')) {
      localStorage.setItem('hugo_admin_email_db', 'drhugocomercial@gmail.com');
    }
    if (!localStorage.getItem('hugo_admin_credentials_history_db')) {
      localStorage.setItem('hugo_admin_credentials_history_db', JSON.stringify([
        "Sistema instalado: Credenciais administrativas padrão geradas em 13/06/2026."
      ]));
    }
  }, []);

  const formatHistoryDate = () => {
    const d = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} às ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  // Authentication states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('is_hugo_admin') === 'true';
  });
  const [loginError, setLoginError] = useState('');

  // Password Recovery states
  const [showRecoveryFlow, setShowRecoveryFlow] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryStep, setRecoveryStep] = useState<'request' | 'verification' | 'reset_pass'>('request');
  const [generatedToken, setGeneratedToken] = useState('');
  const [enteredToken, setEnteredToken] = useState('');
  const [recoveryNewPass, setRecoveryNewPass] = useState('');
  const [recoveryConfirmPass, setRecoveryConfirmPass] = useState('');

  // Tab views
  const [activeTab, setActiveTab] = useState<'agendamentos' | 'catalogo' | 'acesso'>('agendamentos');

  // Refresh & Sync states for administrative bookings
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  // Automatically update last sync time when bookings prop changes (real-time sync)
  useEffect(() => {
    setLastUpdated(new Date());
  }, [bookings]);

  // Manual refresh from Server Database API (syncing all entities back)
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    setRefreshSuccess(false);
    try {
      // 1. Fetch bookings
      const resBookings = await fetch('/api/bookings');
      if (resBookings.ok) {
        const data = await resBookings.json();
        if (Array.isArray(data)) {
          onUpdateBookings(data);
          localStorage.setItem('hugo_sobral_bookings', JSON.stringify(data));
        }
      }

      // 2. Fetch professionals
      const resProfs = await fetch('/api/professionals');
      if (resProfs.ok) {
        const data = await resProfs.json();
        if (Array.isArray(data)) {
          onUpdateProfessionals(data);
          localStorage.setItem('hugo_sobral_professionals', JSON.stringify(data));
        }
      }

      // 3. Fetch procedures
      const resProcs = await fetch('/api/procedures');
      if (resProcs.ok) {
        const data = await resProcs.json();
        if (Array.isArray(data) && data.length > 0) {
          onUpdateProcedures(data);
          localStorage.setItem('hugo_sobral_custom_procedures', JSON.stringify(data));
        }
      }

      setLastUpdated(new Date());
      setRefreshSuccess(true);
      setTimeout(() => setRefreshSuccess(false), 3000);
    } catch (err) {
      console.error('Erro ao recarregar dados do servidor:', err);
      // Fallback
      try {
        const saved = localStorage.getItem('hugo_sobral_bookings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            onUpdateBookings(parsed);
          }
        }
      } catch (e) {
        console.error('Erro de fallback do localStorage:', e);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // "Configurações de Acesso" input states
  const [accessNewUser, setAccessNewUser] = useState('');
  const [accessCurrentPass, setAccessCurrentPass] = useState('');
  const [accessNewPass, setAccessNewPass] = useState('');
  const [accessConfirmPass, setAccessConfirmPass] = useState('');
  const [accessFeedback, setAccessFeedback] = useState<{ type: 'success' | 'crit', msg: string } | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [accessHistory, setAccessHistory] = useState<string[]>(() => {
    try {
      const h = localStorage.getItem('hugo_admin_credentials_history_db');
      return h ? JSON.parse(h) : ["Sistema instalado: Credenciais administrativas padrão geradas em 13/06/2026."];
    } catch {
      return ["Sistema instalado: Credenciais administrativas padrão geradas em 13/06/2026."];
    }
  });

  // Sync state on component load/update
  useEffect(() => {
    try {
      const h = localStorage.getItem('hugo_admin_credentials_history_db');
      if (h) setAccessHistory(JSON.parse(h));
    } catch (e) {
      // safe fallback
    }
  }, [activeTab]);

  // Editing procedures states
  const [editingProc, setEditingProc] = useState<Procedure | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form states (used for both creating and editing procedures)
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'EXPERIÊNCIAS FACIAIS' | 'CUIDADOS CORPORAIS' | 'PROCEDIMENTOS DE TRATAMENTO'>('EXPERIÊNCIAS FACIAIS');
  const [formPrice, setFormPrice] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [formIndication, setFormIndication] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  // Booking action states (Reschedule and Cancel Modals)
  const [reschedulingBooking, setReschedulingBooking] = useState<Booking | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('09:00');

  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  // Booking Filtering states
  const [filterSearch, setFilterSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [filterDate, setFilterDate] = useState(''); // YYYY-MM-DD

  // Manual Message Dispatcher Modal
  const [messagingBooking, setMessagingBooking] = useState<Booking | null>(null);
  const [selectedMsgType, setSelectedMsgType] = useState<'Criação' | 'Confirmação' | 'Reagendamento' | 'Cancelamento' | 'Conclusão' | 'Lembrete'>('Lembrete');

  // Manual Booking States
  const [isCreatingBooking, setIsCreatingBooking] = useState(false);
  const [manualClientName, setManualClientName] = useState('');
  const [manualClientPhone, setManualClientPhone] = useState('');
  const [manualProcedureId, setManualProcedureId] = useState('');
  const [manualDate, setManualDate] = useState('2026-06-13');
  const [manualTime, setManualTime] = useState('09:00');
  const [manualProfessional, setManualProfessional] = useState('');
  const [manualStatus, setManualStatus] = useState<'Pendente' | 'Confirmado' | 'Cancelado' | 'Concluído'>('Confirmado');
  const [manualObservations, setManualObservations] = useState('');

  // Editing Booking States
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [editClientName, setEditClientName] = useState('');
  const [editClientPhone, setEditClientPhone] = useState('');
  const [editProcedureId, setEditProcedureId] = useState('');
  const [editDate, setEditDate] = useState('2026-06-13');
  const [editTime, setEditTime] = useState('09:00');
  const [editProfessional, setEditProfessional] = useState('');
  const [editStatus, setEditStatus] = useState<'Pendente' | 'Confirmado' | 'Cancelado' | 'Concluído'>('Confirmado');
  const [editObservations, setEditObservations] = useState('');

  // --- PROFESSIONAL MANAGEMENT STATES ---
  const [editingProf, setEditingProf] = useState<Professional | null>(null);
  const [isCreatingProf, setIsCreatingProf] = useState(false);
  const [profFormName, setProfFormName] = useState('');
  const [profFormRole, setProfFormRole] = useState('');
  const [profFormImageUrl, setProfFormImageUrl] = useState('');
  const [profFormActive, setProfFormActive] = useState(true);
  const [profFormOrder, setProfFormOrder] = useState<number>(1);

  // Sync dynamic defaults of manual/edit professionals
  useEffect(() => {
    if (professionals && professionals.length > 0) {
      if (!manualProfessional) {
        setManualProfessional(professionals[0].name);
      }
      if (!editProfessional) {
        setEditProfessional(professionals[0].name);
      }
    }
  }, [professionals, manualProfessional, editProfessional]);

  // Professional form resets
  const resetProfForm = () => {
    setProfFormName('');
    setProfFormRole('');
    setProfFormImageUrl('');
    setProfFormActive(true);
    setProfFormOrder(professionals.length + 1);
  };

  // Professional handlers
  const handleCreateProfessional = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profFormName.trim() || !profFormRole.trim()) {
      alert('Por favor, preencha o nome e o cargo do profissional.');
      return;
    }
    const newProf: Professional = {
      id: `prof-${Date.now()}`,
      name: profFormName.trim(),
      role: profFormRole.trim(),
      imageUrl: profFormImageUrl.trim() || undefined,
      active: profFormActive,
      order: profFormOrder || 1,
    };
    onUpdateProfessionals([...professionals, newProf]);
    setIsCreatingProf(false);
    resetProfForm();
    alert(`Profissional ${profFormName} cadastrado com sucesso!`);
  };

  const handleOpenEditProf = (prof: Professional) => {
    setEditingProf(prof);
    setProfFormName(prof.name);
    setProfFormRole(prof.role);
    setProfFormImageUrl(prof.imageUrl || '');
    setProfFormActive(prof.active);
    setProfFormOrder(prof.order);
    setIsCreatingProf(false);
  };

  const handleSaveEditProf = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProf) return;
    if (!profFormName.trim() || !profFormRole.trim()) {
      alert('Por favor, preencha o nome e o cargo do profissional.');
      return;
    }
    const updated = professionals.map(p => {
      if (p.id === editingProf.id) {
        return {
          ...p,
          name: profFormName.trim(),
          role: profFormRole.trim(),
          imageUrl: profFormImageUrl.trim() || undefined,
          active: profFormActive,
          order: profFormOrder || 1,
        };
      }
      return p;
    });
    onUpdateProfessionals(updated);
    setEditingProf(null);
    resetProfForm();
    alert('Dados do profissional atualizados com sucesso!');
  };

  const handleDeleteProf = (id: string, name: string) => {
    if (window.confirm(`Tem certeza de que deseja remover permanentemente o profissional "${name}"? Os agendamentos existentes continuarão com o nome registrado.`)) {
      const updated = professionals.filter(p => p.id !== id);
      onUpdateProfessionals(updated);
      alert(`Profissional ${name} removido com sucesso.`);
    }
  };

  const handleToggleProfActive = (id: string) => {
    const updated = professionals.map(p => {
      if (p.id === id) {
        return { ...p, active: !p.active };
      }
      return p;
    });
    onUpdateProfessionals(updated);
  };

  // Notification history viewer state
  const [viewingNotificationBooking, setViewingNotificationBooking] = useState<Booking | null>(null);

  // Handle authentication login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const inputUser = email.trim().toLowerCase();
    const inputPassHash = sha256Sync(password);

    const storedUser = (localStorage.getItem('hugo_admin_username_db') || 'drhugo.beauty').trim().toLowerCase();
    const storedEmail = (localStorage.getItem('hugo_admin_email_db') || 'drhugocomercial@gmail.com').trim().toLowerCase();
    const storedHash = localStorage.getItem('hugo_admin_password_hash_db') || sha256Sync('drhugo123');

    if (inputUser === storedUser || inputUser === storedEmail) {
      if (inputPassHash === storedHash) {
        setIsAuthenticated(true);
        localStorage.setItem('is_hugo_admin', 'true');
        setLoginError('');
      } else {
        setLoginError('Senha incorreta. Verifique suas credenciais.');
      }
    } else {
      setLoginError('Usuário administrativo não cadastrado.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('is_hugo_admin');
  };

  // --- PASSWORD RECOVERY HANDLERS ---
  const handleForgotPasswordClick = () => {
    setShowRecoveryFlow(true);
    setRecoveryStep('request');
    setRecoveryEmail('');
    setRecoveryError('');
    setRecoveryMessage('');
    setGeneratedToken('');
    setEnteredToken('');
    setRecoveryNewPass('');
    setRecoveryConfirmPass('');
  };

  const validatePassStrength = (pass: string): { valid: boolean; error: string } => {
    if (pass.length < 6) {
      return { valid: false, error: 'A senha deve possuir no mínimo 6 caracteres.' };
    }
    if (!/[a-zA-Z]/.test(pass) || !/[0-9]/.test(pass)) {
      return { valid: false, error: 'A senha deve conter pelo menos uma letra e um número.' };
    }
    return { valid: true, error: '' };
  };

  const handleRequestRecoveryEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoveryMessage('');

    const targetEmail = recoveryEmail.trim().toLowerCase();
    const storedEmail = (localStorage.getItem('hugo_admin_email_db') || 'drhugocomercial@gmail.com').trim().toLowerCase();

    if (targetEmail !== storedEmail) {
      setRecoveryError('O e-mail informado não corresponde ao e-mail administrativo cadastrado.');
      return;
    }

    // Generate a 6-digit numeric security token
    const token = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedToken(token);
    setRecoveryStep('verification');
    setRecoveryMessage(`Código de segurança enviado com sucesso para ${targetEmail}.`);
  };

  const handleVerifyToken = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (enteredToken.trim() !== generatedToken) {
      setRecoveryError('Código de segurança incorreto. Verifique a simulação abaixo e tente novamente.');
      return;
    }

    setRecoveryStep('reset_pass');
    setRecoveryMessage('');
  };

  const handleResetPasswordFromRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (recoveryNewPass !== recoveryConfirmPass) {
      setRecoveryError('As senhas digitadas não coincidem.');
      return;
    }

    const strengthCheck = validatePassStrength(recoveryNewPass);
    if (!strengthCheck.valid) {
      setRecoveryError(strengthCheck.error);
      return;
    }

    // Update password hash database
    const newPassHash = sha256Sync(recoveryNewPass);
    localStorage.setItem('hugo_admin_password_hash_db', newPassHash);

    // Update credentials change history
    const historyLogs = [...accessHistory];
    historyLogs.push(`Senha redefinida via auto-atendimento de e-mail em ${formatHistoryDate()}.`);
    localStorage.setItem('hugo_admin_credentials_history_db', JSON.stringify(historyLogs));
    setAccessHistory(historyLogs);

    setRecoveryMessage('Acesso restaurado com sucesso! Redirecionando para o login...');
    setTimeout(() => {
      setShowRecoveryFlow(false);
      setEmail('');
      setPassword('');
      setLoginError('');
    }, 2500);
  };

  // --- ACCESS CREDENTIALS SETTINGS CARD SAVER ---
  const handleSaveAccessCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setAccessFeedback(null);

    const currentStoredUser = localStorage.getItem('hugo_admin_username_db') || 'drhugo.beauty';
    const currentStoredPassHash = localStorage.getItem('hugo_admin_password_hash_db') || sha256Sync('drhugo123');

    if (!accessCurrentPass) {
      setAccessFeedback({ type: 'crit', msg: 'A senha atual é obrigatória para validar e salvar qualquer alteração.' });
      return;
    }

    if (sha256Sync(accessCurrentPass) !== currentStoredPassHash) {
      setAccessFeedback({ type: 'crit', msg: 'Senha atual incorreta. Alterações rejeitadas por motivos de segurança.' });
      return;
    }

    let finalUser = currentStoredUser;
    let finalPassHash = currentStoredPassHash;
    const historyLogs = [...accessHistory];

    const hasNewUser = accessNewUser.trim() !== '';
    const hasNewPass = accessNewPass !== '';

    if (!hasNewUser && !hasNewPass) {
      setAccessFeedback({ type: 'crit', msg: 'Informe um novo usuário ou digite uma nova senha para aplicar.' });
      return;
    }

    if (hasNewUser) {
      finalUser = accessNewUser.trim();
      historyLogs.push(`Nome de usuário alterado de "${currentStoredUser}" para "${finalUser}" em ${formatHistoryDate()}.`);
    }

    if (hasNewPass) {
      if (accessNewPass !== accessConfirmPass) {
        setAccessFeedback({ type: 'crit', msg: 'A nova senha e a confirmação de senha não coincidem.' });
        return;
      }

      const strengthCheck = validatePassStrength(accessNewPass);
      if (!strengthCheck.valid) {
        setAccessFeedback({ type: 'crit', msg: strengthCheck.error });
        return;
      }

      finalPassHash = sha256Sync(accessNewPass);
      historyLogs.push(`Senha administrativa alterada com sucesso em ${formatHistoryDate()}.`);
    }

    // Save to DB (local storage)
    localStorage.setItem('hugo_admin_username_db', finalUser);
    localStorage.setItem('hugo_admin_password_hash_db', finalPassHash);
    localStorage.setItem('hugo_admin_credentials_history_db', JSON.stringify(historyLogs));
    setAccessHistory(historyLogs);

    // Clear inputs
    setAccessNewUser('');
    setAccessCurrentPass('');
    setAccessNewPass('');
    setAccessConfirmPass('');

    if (hasNewPass) {
      setAccessFeedback({
        type: 'success',
        msg: 'Senha e credenciais redefinidas com sucesso! Por motivos de segurança, você será deslogado em instantes para acessar com as novas credenciais.'
      });
      setTimeout(() => {
        handleLogout();
        setAccessFeedback(null);
      }, 3000);
    } else {
      setAccessFeedback({
        type: 'success',
        msg: 'Configurações de usuário salvas com sucesso! Suas novas credenciais estão prontas para o próximo acesso.'
      });
    }
  };

  // ----- PROCEDURE CRUD HANDLERS -----

  const handleToggleActive = (id: string) => {
    const updated = procedures.map((p) => {
      if (p.id === id) return { ...p, active: !p.active };
      return p;
    });
    onUpdateProcedures(updated);
  };

  const handleStartEdit = (proc: Procedure) => {
    setEditingProc(proc);
    setIsCreating(false);
    setFormName(proc.name);
    setFormCategory(proc.category);
    setFormPrice(proc.price);
    setFormDescription(proc.description);
    setFormIndication(proc.indication);
    setFormImageUrl(proc.imageUrl);
  };

  const handleStartCreate = () => {
    setEditingProc(null);
    setIsCreating(true);
    setFormName('');
    setFormCategory('EXPERIÊNCIAS FACIAIS');
    setFormPrice(150.0);
    setFormDescription('');
    setFormIndication('');
    setFormImageUrl('https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80');
  };

  const handleCancelForm = () => {
    setEditingProc(null);
    setIsCreating(false);
  };

  const handleDeleteProcedure = (id: string) => {
    if (window.confirm('Deseja realmente remover permanentemente este procedimento do catálogo?')) {
      const updated = procedures.filter((p) => p.id !== id);
      onUpdateProcedures(updated);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) {
      alert('Por favor, preencha o Nome e a Descrição do procedimento.');
      return;
    }

    if (isCreating) {
      const newProc: Procedure = {
        id: `custom-${Date.now()}`,
        name: formName.trim(),
        category: formCategory,
        price: formPrice,
        description: formDescription.trim(),
        indication: formIndication.trim() || 'Indicado para tratamentos estéticos premium.',
        imageUrl: formImageUrl.trim() || 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=600&auto=format&fit=crop&q=80',
        active: true,
      };
      onUpdateProcedures([newProc, ...procedures]);
    } else if (editingProc) {
      const updated = procedures.map((p) => {
        if (p.id === editingProc.id) {
          return {
            ...p,
            name: formName.trim(),
            category: formCategory,
            price: formPrice,
            description: formDescription.trim(),
            indication: formIndication.trim(),
            imageUrl: formImageUrl.trim(),
          };
        }
        return p;
      });
      onUpdateProcedures(updated);
    }

    handleCancelForm();
  };

  const handleClearDatabase = () => {
    if (window.confirm('Atenção: isto apagará permanentemente TODOS os profissionais cadastrados, TODOS os agendamentos registrados, o histórico de notificações e todo o catálogo de procedimentos do sistema. Esta ação é irreversível. Deseja prosseguir com a limpeza definitiva da base de dados?')) {
      onUpdateBookings([]);
      onUpdateProfessionals([]);
      onUpdateProcedures([]);

      localStorage.removeItem('hugo_sobral_bookings');
      localStorage.removeItem('hugo_sobral_professionals');
      localStorage.removeItem('hugo_sobral_custom_procedures');

      alert('Base de dados limpa com sucesso! O sistema está agora completamente vazio e pronto para novos cadastros reais.');
      window.location.reload();
    }
  };

  // ----- WHATSAPP NOTIFICATION HELPER -----

  const getWhatsAppMessageText = (booking: Booking, type: 'Criação' | 'Confirmação' | 'Reagendamento' | 'Cancelamento' | 'Conclusão' | 'Lembrete', cancelMotive?: string) => {
    const { clientName, date, time, procedureName } = booking;
    switch (type) {
      case 'Criação':
        return `Olá, ${clientName} 😊\n\nSeu agendamento foi recebido com sucesso.\n\n📅 Data: ${date}\n⏰ Horário: ${time}\n💆 Procedimento: ${procedureName}\n\nEm breve sua solicitação será confirmada pela nossa equipe.`;
      case 'Confirmação':
        return `Olá, ${clientName} 😊\n\nSeu agendamento foi confirmado.\n\n📅 Data: ${date}\n⏰ Horário: ${time}\n💆 Procedimento: ${procedureName}\n\nAguardamos você.`;
      case 'Reagendamento':
        return `Olá, ${clientName} 😊\n\nSeu agendamento foi reagendado.\n\n📅 Nova Data: ${date}\n⏰ Novo Horário: ${time}\n💆 Procedimento: ${procedureName}\n\nCaso tenha dúvidas, entre em contato conosco.`;
      case 'Cancelamento':
        return `Olá, ${clientName}.\n\nInformamos que seu agendamento foi cancelado.\n\nMotivo: ${cancelMotive || 'Necessidade de remanejamento.'}\n\nPara reagendar, entre em contato conosco.`;
      case 'Conclusão':
        return `Olá, ${clientName} 😊\n\nSeu atendimento foi realizado com sucesso.\n\nAgradecemos pela confiança em nossa clínica.`;
      case 'Lembrete':
        return `Olá, ${clientName} 😊\n\nLembramos que seu atendimento está agendado para amanhã.\n\n📅 Data: ${date}\n⏰ Horário: ${time}\n💆 Procedimento: ${procedureName}\n\nAguardamos sua presença!`;
    }
  };

  const dispatchWhatsAppNotification = (
    booking: Booking, 
    type: 'Criação' | 'Confirmação' | 'Reagendamento' | 'Cancelamento' | 'Conclusão' | 'Lembrete', 
    motive?: string,
    openWindow = false
  ) => {
    const text = getWhatsAppMessageText(booking, type, motive);
    
    if (openWindow) {
      let cleanPhone = booking.clientPhone.replace(/\D/g, '');
      if (cleanPhone.length === 11 || cleanPhone.length === 10) {
        cleanPhone = '55' + cleanPhone;
      }
      const url = `https://wa.me/${cleanPhone || '5595981036729'}?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }

    const phoneDigits = booking.clientPhone.replace(/\D/g, '');
    const isInvalidPhone = phoneDigits.length < 8; // Basic length validation

    // Create a delivery history record in the app history logs
    const newLog: BookingMessageLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sentAt: new Date().toLocaleString('pt-BR'),
      type: type === 'Lembrete' ? 'Confirmação' : type,
      status: isInvalidPhone ? 'Falha' : 'Sucesso',
      content: text,
      deliveryStatus: isInvalidPhone ? 'Falhou' : 'Pendente',
      errorMessage: isInvalidPhone ? 'Número do WhatsApp inválido ou incompleto.' : undefined
    };

    // Fire the real background HTTP call to the secure backend WhatsApp API
    if (!isInvalidPhone) {
      fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: booking.clientPhone, text: text })
      })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.success) {
          console.log("[WhatsApp API] Mensagem enviada via Meta WhatsApp Business Cloud API com sucesso:", data);
          // Update message log status to 'Enviado' (since it left the gateway successfully)
          // Also set the deliveryStatus to 'Entregue'
          const currentBookings = JSON.parse(localStorage.getItem('hugo_sobral_bookings') || '[]');
          if (Array.isArray(currentBookings)) {
            const updated = currentBookings.map((b: Booking) => {
              if (b.id === booking.id) {
                const logs = b.history || [];
                const updatedLogs = logs.map((log) => {
                  if (log.id === newLog.id) {
                    return { 
                      ...log, 
                      deliveryStatus: 'Entregue' as const, 
                      status: 'Sucesso' as const,
                      errorMessage: undefined 
                    };
                  }
                  return log;
                });
                return { ...b, history: updatedLogs };
              }
              return b;
            });
            onUpdateBookings(updated);
          }
        } else {
          // Meta API error or token missing
          const errorMsg = data.error || (data.details && JSON.stringify(data.details)) || "Erro desconhecido";
          console.warn("[WhatsApp API] Falha na entrega do WhatsApp real:", errorMsg);
          const currentBookings = JSON.parse(localStorage.getItem('hugo_sobral_bookings') || '[]');
          if (Array.isArray(currentBookings)) {
            const updated = currentBookings.map((b: Booking) => {
              if (b.id === booking.id) {
                const logs = b.history || [];
                const updatedLogs = logs.map((log) => {
                  if (log.id === newLog.id) {
                    return { 
                      ...log, 
                      deliveryStatus: 'Falhou' as const, 
                      status: 'Falha' as const, 
                      errorMessage: `Servidor: ${errorMsg}` 
                    };
                  }
                  return log;
                });
                return { ...b, history: updatedLogs };
              }
              return b;
            });
            onUpdateBookings(updated);
          }
        }
      })
      .catch((err) => {
        console.error("[WhatsApp API] Erro de rede ou servidor ao disparar WhatsApp:", err);
        const currentBookings = JSON.parse(localStorage.getItem('hugo_sobral_bookings') || '[]');
        if (Array.isArray(currentBookings)) {
          const updated = currentBookings.map((b: Booking) => {
            if (b.id === booking.id) {
              const logs = b.history || [];
              const updatedLogs = logs.map((log) => {
                if (log.id === newLog.id) {
                  return { 
                    ...log, 
                    deliveryStatus: 'Falhou' as const, 
                    status: 'Falha' as const, 
                    errorMessage: `Falha de Rede: ${err.message || err}` 
                  };
                }
                return log;
              });
              return { ...b, history: updatedLogs };
            }
            return b;
          });
          onUpdateBookings(updated);
        }
      });
    }

    return {
      ...booking,
      history: [newLog, ...(booking.history || [])]
    };
  };

  // ----- AUTOMATIC BACKGROUND NOTIFICATION SIMULATOR LOOP -----
  React.useEffect(() => {
    const timer = setTimeout(() => {
      let changed = false;
      const updatedList = bookings.map(b => {
        const logs = b.history || [];
        if (logs.length === 0) return b;

        const latestLog = logs[0];
        if (latestLog && latestLog.status === 'Sucesso') {
          if (latestLog.deliveryStatus === 'Pendente') {
            // Transition from Pendente -> Enviado
            const updatedLogs = logs.map((log, idx) => {
              if (idx === 0) {
                return { ...log, deliveryStatus: 'Enviado' as const };
              }
              return log;
            });
            changed = true;
            return { ...b, history: updatedLogs };
          } else if (latestLog.deliveryStatus === 'Enviado') {
            // Transition from Enviado -> Entregue (with a very small 4% failure rate for visual test testing/reenvio UI)
            const isFailure = Math.random() < 0.04;
            const updatedLogs = logs.map((log, idx) => {
              if (idx === 0) {
                if (isFailure) {
                  return { 
                    ...log, 
                    status: 'Falha' as const,
                    deliveryStatus: 'Falhou' as const,
                    errorMessage: 'Falha de entrega: Dispositivo do cliente está offline e sem conexão.'
                  };
                } else {
                  return { ...log, deliveryStatus: 'Entregue' as const };
                }
              }
              return log;
            });
            changed = true;
            return { ...b, history: updatedLogs };
          }
        }
        return b;
      });

      if (changed) {
        onUpdateBookings(updatedList);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [bookings, onUpdateBookings]);

  const handleManualResendNotification = (booking: Booking, log: any) => {
    // Resend with openWindow = true so that they can physically open / dispatch it via WhatsApp
    const finalBooking = dispatchWhatsAppNotification(
      booking,
      log.type as any,
      log.type === 'Cancelamento' ? booking.cancelledReason : undefined,
      true
    );
    const updatedList = bookings.map(b => b.id === booking.id ? finalBooking : b);
    onUpdateBookings(updatedList);
  };

  // ----- BOOKING ACTION ACTUATORS -----

  const handleConfirmBooking = (booking: Booking) => {
    const updatedBooking = {
      ...booking,
      status: 'Confirmado' as const
    };
    
    // Auto trigger WhatsApp and append logs (passed true to physically trigger redirect)
    const finalBooking = dispatchWhatsAppNotification(updatedBooking, 'Confirmação', undefined, true);
    
    const updatedList = bookings.map(b => b.id === booking.id ? finalBooking : b);
    onUpdateBookings(updatedList);
  };

  const handleOpenReschedule = (booking: Booking) => {
    setReschedulingBooking(booking);
    // Parse date DD/MM/YYYY into YYYY-MM-DD
    const dateParts = booking.date.split('/');
    if (dateParts.length === 3) {
      setRescheduleDate(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
    } else {
      setRescheduleDate('2026-06-13');
    }
    setRescheduleTime(booking.time);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingBooking || !rescheduleDate || !rescheduleTime) return;

    // Convert YYYY-MM-DD to DD/MM/YYYY
    const parts = rescheduleDate.split('-');
    const formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;

    const updatedBooking = {
      ...reschedulingBooking,
      date: formattedDate,
      time: rescheduleTime,
      status: 'Confirmado' as const // Re-confirming automatically on reschedule of data
    };

    const finalBooking = dispatchWhatsAppNotification(updatedBooking, 'Reagendamento', undefined, true);

    const updatedList = bookings.map(b => b.id === reschedulingBooking.id ? finalBooking : b);
    onUpdateBookings(updatedList);
    setReschedulingBooking(null);
  };

  const handleOpenCancel = (booking: Booking) => {
    setCancellingBooking(booking);
    setCancelReason('');
  };

  const handleSaveCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancellingBooking || !cancelReason.trim()) return;

    const updatedBooking = {
      ...cancellingBooking,
      status: 'Cancelado' as const,
      cancelledReason: cancelReason.trim()
    };

    const finalBooking = dispatchWhatsAppNotification(updatedBooking, 'Cancelamento', cancelReason.trim(), true);

    const updatedList = bookings.map(b => b.id === cancellingBooking.id ? finalBooking : b);
    onUpdateBookings(updatedList);
    setCancellingBooking(null);
  };

  const handleConcludeBooking = (booking: Booking) => {
    const updatedBooking = {
      ...booking,
      status: 'Concluído' as const,
      completedAt: new Date().toLocaleString('pt-BR')
    };

    const finalBooking = dispatchWhatsAppNotification(updatedBooking, 'Conclusão');

    const updatedList = bookings.map(b => b.id === booking.id ? finalBooking : b);
    onUpdateBookings(updatedList);
  };

  const handleSaveManualBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualClientName.trim() || !manualClientPhone.trim() || !manualProcedureId) {
      alert('Por favor, preencha o Nome, Telefone e selecione o Procedimento.');
      return;
    }

    const matchedProcedure = procedures.find((p) => p.id === manualProcedureId);
    if (!matchedProcedure) {
      alert('Procedimento inválido ou não encontrado.');
      return;
    }

    // Convert date from YYYY-MM-DD to DD/MM/YYYY text
    const dateParts = manualDate.split('-');
    const formattedDate = dateParts.length === 3 
      ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` 
      : manualDate;

    const newBookingId = `b-manual-${Date.now()}`;
    const nowStr = new Date().toLocaleString('pt-BR');

    const newBooking: Booking = {
      id: newBookingId,
      clientName: manualClientName.trim(),
      clientPhone: manualClientPhone.trim(),
      procedureId: matchedProcedure.id,
      procedureName: matchedProcedure.name,
      date: formattedDate,
      time: manualTime,
      professional: manualProfessional,
      status: manualStatus,
      observations: manualObservations.trim() || undefined,
      createdAt: nowStr,
      history: [
        {
          id: `h-manual-${Date.now()}`,
          sentAt: nowStr,
          type: 'Criação',
          status: 'Sucesso',
        },
      ],
    };

    const updatedList = [newBooking, ...bookings];
    onUpdateBookings(updatedList);
    setIsCreatingBooking(false);
    alert(`Agendamento de ${manualClientName} registrado com sucesso no sistema!`);
  };

  const handleOpenEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setEditClientName(booking.clientName);
    setEditClientPhone(booking.clientPhone);
    setEditProcedureId(booking.procedureId || '');
    
    // Convert DD/MM/YYYY text back to YYYY-MM-DD for standard date input elements
    const parts = booking.date.split('/');
    if (parts.length === 3) {
      setEditDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
    } else {
      setEditDate(booking.date);
    }
    
    setEditTime(booking.time);
    setEditProfessional(booking.professional);
    setEditStatus(booking.status);
    setEditObservations(booking.observations || '');
  };

  const handleSaveEditBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBooking) return;
    if (!editClientName.trim() || !editClientPhone.trim() || !editProcedureId) {
      alert('Por favor, preencha o Nome, Telefone e selecione o Procedimento.');
      return;
    }

    const matchedProcedure = procedures.find((p) => p.id === editProcedureId);
    if (!matchedProcedure) {
      alert('Procedimento inválido ou não encontrado.');
      return;
    }

    // Convert date layout from YYYY-MM-DD input to DD/MM/YYYY stored text format
    const dateParts = editDate.split('-');
    const formattedDate = dateParts.length === 3 
      ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` 
      : editDate;

    const statusChanged = editStatus !== editingBooking.status;
    const dateOrTimeChanged = formattedDate !== editingBooking.date || editTime !== editingBooking.time;

    let updatedBooking: Booking = {
      ...editingBooking,
      clientName: editClientName.trim(),
      clientPhone: editClientPhone.trim(),
      procedureId: matchedProcedure.id,
      procedureName: matchedProcedure.name,
      date: formattedDate,
      time: editTime,
      professional: editProfessional,
      status: editStatus,
      observations: editObservations.trim() || undefined,
    };

    if (statusChanged) {
      if (editStatus === 'Confirmado') {
        updatedBooking = dispatchWhatsAppNotification(updatedBooking, 'Confirmação');
      } else if (editStatus === 'Cancelado') {
        updatedBooking = dispatchWhatsAppNotification(updatedBooking, 'Cancelamento', editObservations.trim() || 'Necessidade de remanejamento.');
      } else if (editStatus === 'Concluído') {
        updatedBooking = dispatchWhatsAppNotification(updatedBooking, 'Conclusão');
      }
    } else if (dateOrTimeChanged) {
      updatedBooking = dispatchWhatsAppNotification(updatedBooking, 'Reagendamento');
    }

    const updatedList = bookings.map(b => b.id === editingBooking.id ? updatedBooking : b);
    onUpdateBookings(updatedList);
    setEditingBooking(null);
    alert(`Agendamento de ${editClientName} atualizado com sucesso!`);
  };

  const handleTriggerManualSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messagingBooking) return;

    const finalBooking = dispatchWhatsAppNotification(
      messagingBooking, 
      selectedMsgType, 
      selectedMsgType === 'Cancelamento' ? messagingBooking.cancelledReason : undefined
    );

    const updatedList = bookings.map(b => b.id === messagingBooking.id ? finalBooking : b);
    onUpdateBookings(updatedList);
    setMessagingBooking(null);
  };

  // ----- METRIC COMPUTATIONS FOR THE DASHBOARD -----

  const getKPIs = () => {
    const todayStr = '13/06/2026'; // Fixed system context simulation date
    const safeBookings = bookings || [];
    const todayCount = safeBookings.filter(b => b && b.date === todayStr).length;
    const pendingCount = safeBookings.filter(b => b && b.status === 'Pendente').length;
    const confirmedCount = safeBookings.filter(b => b && b.status === 'Confirmado').length;
    const completedCount = safeBookings.filter(b => b && b.status === 'Concluído').length;
    const cancelledCount = safeBookings.filter(b => b && b.status === 'Cancelado').length;
    const monthCount = safeBookings.filter(b => b && b.date && (b.date.includes('/06/23') || b.date.includes('/06/20') || b.date.includes('/06/2026'))).length; // June 2026 size

    return { todayCount, pendingCount, confirmedCount, completedCount, cancelledCount, monthCount };
  };

  const kpis = getKPIs();

  // ----- APPOINTMENTS FILTERING LOGIC -----

  const filteredBookings = (bookings || []).filter((b) => {
    if (!b) return false;
    // Search match
    const bSearch = (filterSearch || '').toLowerCase();
    
    const clientName = (b.clientName || '').toLowerCase();
    const clientPhone = b.clientPhone || '';
    const procedureName = (b.procedureName || '').toLowerCase();
    const professional = (b.professional || '').toLowerCase();

    const matchesSearch = !filterSearch || 
                          clientName.includes(bSearch) ||
                          clientPhone.includes(bSearch) ||
                          procedureName.includes(bSearch) ||
                          professional.includes(bSearch);
    
    // Status match
    const bStatus = b.status || 'Pendente';
    const matchesStatus = filterStatus === 'Todos' || bStatus === filterStatus;

    // Date match
    let matchesDate = true;
    if (filterDate) {
      const parts = filterDate.split('-');
      if (parts.length === 3) {
        const formattedFilterDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
        matchesDate = b.date === formattedFilterDate;
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const resultado = filteredBookings;
  console.log("Agendamentos encontrados:", resultado);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-luxury-black/60 backdrop-blur-xs" />

      {/* ADMIN DRAWER (Generous wide screen layout) */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 180 }}
        className="relative w-full max-w-4xl h-full bg-luxury-cream border-l border-gold-200/50 shadow-2xl flex flex-col z-10"
      >
        {/* DRAWER HEADER */}
        <div className="p-6 border-b border-gold-150 bg-luxury-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-gold-500 fill-gold-100" />
            <h3 className="font-serif text-lg font-semibold uppercase tracking-wider text-luxury-black">
              Gabinete Administrativo
            </h3>
          </div>
          
          <button
            onClick={onClose}
            className="p-1 px-3 border border-gold-150 text-luxury-gray hover:text-luxury-black hover:bg-gold-50 transition-colors uppercase font-sans text-[10px] tracking-widest cursor-pointer"
          >
            Fechar
          </button>
        </div>

        {/* CONTAINER WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* SECURE ADMINISTRATIVE LOGIN */}
          {!isAuthenticated ? (
            showRecoveryFlow ? (
              <div className="max-w-md mx-auto my-12 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full border border-gold-400 flex items-center justify-center mx-auto bg-luxury-cream">
                    <History className="w-5 h-5 text-gold-500" />
                  </div>
                  <h4 className="font-serif text-xl tracking-tight font-medium text-luxury-black">Recuperação de Credenciais</h4>
                  <p className="font-sans text-xs text-luxury-gray text-center px-4">
                    Serviço de auto-atendimento para redefinir o acesso do administrador principal.
                  </p>
                </div>

                <div className="bg-luxury-white border border-gold-150 p-6 space-y-4 shadow-luxury relative">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
                  
                  {recoveryError && (
                    <div className="p-3 bg-red-50 border-l-2 border-red-500 text-[11px] font-sans text-red-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                      <span>{recoveryError}</span>
                    </div>
                  )}

                  {recoveryMessage && (
                    <div className="p-3 bg-emerald-50 border-l-2 border-emerald-500 text-[11px] font-sans text-emerald-800 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                      <span>{recoveryMessage}</span>
                    </div>
                  )}

                  {/* STEP 1: REQUEST EMAIL */}
                  {recoveryStep === 'request' && (
                    <form onSubmit={handleRequestRecoveryEmail} className="space-y-4">
                      <p className="font-sans text-[11px] text-luxury-gray leading-relaxed">
                        Informe o e-mail administrativo cadastrado para gerar o código de verificação de segurança.
                      </p>
                      
                      <div className="space-y-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-gold-700 block font-semibold">E-mail Cadastrado:</label>
                        <input
                          type="email"
                          required
                          placeholder="Ex: drhugocomercial@gmail.com"
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          className="w-full text-xs font-sans p-3 bg-luxury-cream border border-gold-100 placeholder-luxury-gray/40 focus:outline-none focus:border-gold-300"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-luxury-black hover:bg-gold-500 text-luxury-white text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer font-bold"
                      >
                        Enviar Código de Segurança
                      </button>
                    </form>
                  )}

                  {/* STEP 2: ENTER CODE */}
                  {recoveryStep === 'verification' && (
                    <form onSubmit={handleVerifyToken} className="space-y-4">
                      <div className="p-2.5 bg-amber-50 border-l-2 border-amber-500 text-[11px] font-sans text-amber-850">
                        🔑 <span className="font-bold">CÓDIGO DE RECUPERAÇÃO GERADO:</span>{" "}
                        <span className="font-mono text-xs text-luxury-black px-1.5 py-0.5 bg-white border border-amber-300 font-bold tracking-widest leading-none">{generatedToken}</span>
                      </div>
                      
                      <p className="font-sans text-[11px] text-luxury-gray leading-relaxed">
                        Digite o código de 6 dígitos exibido acima para confirmar sua identidade de segurança do Dr. Hugo.
                      </p>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-gold-700 block font-semibold">Código de Segurança:</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          placeholder="Digite o código"
                          value={enteredToken}
                          onChange={(e) => setEnteredToken(e.target.value)}
                          className="w-full text-xs font-mono p-3 bg-luxury-cream border border-gold-100 text-center tracking-widest font-bold focus:outline-none focus:border-gold-300 text-luxury-black"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-luxury-black hover:bg-gold-500 text-luxury-white text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer font-bold"
                      >
                        Verificar Código
                      </button>
                    </form>
                  )}

                  {/* STEP 3: RESET PASSWORD */}
                  {recoveryStep === 'reset_pass' && (
                    <form onSubmit={handleResetPasswordFromRecovery} className="space-y-4">
                      <p className="font-sans text-[11px] text-luxury-gray leading-relaxed">
                        Identidade validada com sucesso! Defina e confirme sua nova senha de acesso administrativa.
                      </p>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-gold-700 block font-semibold">Nova Senha:</label>
                        <input
                          type="password"
                          required
                          placeholder="Mínimo de 6 dígitos"
                          value={recoveryNewPass}
                          onChange={(e) => setRecoveryNewPass(e.target.value)}
                          className="w-full text-xs font-sans p-3 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-sans text-[10px] uppercase tracking-widest text-gold-700 block font-semibold">Confirmar Nova Senha:</label>
                        <input
                          type="password"
                          required
                          placeholder="Repita a senha digitada"
                          value={recoveryConfirmPass}
                          onChange={(e) => setRecoveryConfirmPass(e.target.value)}
                          className="w-full text-xs font-sans p-3 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-luxury-black hover:bg-gold-500 text-luxury-white text-xs font-sans tracking-widest uppercase transition-colors cursor-pointer font-bold"
                      >
                        Redefinir e Salvar Senha
                      </button>
                    </form>
                  )}

                  {/* FOOTER OF RECOVERY - BACK TO LOGIN */}
                  <div className="pt-3 text-center border-t border-dashed border-gold-150">
                    <button
                      type="button"
                      onClick={() => setShowRecoveryFlow(false)}
                      className="text-[10px] font-sans font-bold uppercase tracking-wider text-gold-700 hover:text-gold-900 transition-colors cursor-pointer"
                    >
                      Voltar ao Login Administrativo
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto my-12 space-y-6">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full border border-gold-400 flex items-center justify-center mx-auto bg-luxury-cream">
                    <Lock className="w-5 h-5 text-gold-500" />
                  </div>
                  <h4 className="font-serif text-xl tracking-tight font-medium text-luxury-black">Acesso de Segurança</h4>
                  <p className="font-sans text-xs text-luxury-gray">
                    Insira as credenciais do Spa Executivo para visualizar os agendamentos e editar tarifas.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="bg-luxury-white border border-gold-150 p-6 space-y-4 shadow-luxury">
                  {loginError && (
                    <div className="p-3 bg-red-50 border-l-2 border-red-500 text-[11px] font-sans text-red-700">
                      {loginError}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <label className="font-sans text-[10px] uppercase tracking-widest text-gold-700 block">Usuário Administrativo:</label>
                    <input
                      type="text"
                      required
                      placeholder="Digite seu usuário ou e-mail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs font-sans p-3 bg-luxury-cream border border-gold-100 placeholder-luxury-gray/50 focus:outline-none focus:border-gold-300"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-sans text-[10px] uppercase tracking-widest text-gold-700 block">Senha de Acesso:</label>
                      <button
                        type="button"
                        onClick={handleForgotPasswordClick}
                        className="text-[9px] font-sans font-bold uppercase text-gold-600 hover:text-gold-850 transition-all cursor-pointer underline"
                      >
                        Esqueci minha senha
                      </button>
                    </div>
                    <input
                      type="password"
                      required
                      placeholder="Digite sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs font-sans p-3 bg-luxury-cream border border-gold-100 placeholder-luxury-gray/50 focus:outline-none focus:border-gold-300"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-luxury-black text-luxury-white text-xs font-sans tracking-widest uppercase hover:bg-gold-500 transition-colors cursor-pointer"
                  >
                    Carregar Gabinete
                  </button>
                </form>
              </div>
            )
          ) : (
            
            /* SECURE AUTHENTICATED WORKSPACE */
            <div className="space-y-6">
              
              {/* TOP HEADER CONTROLS */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-luxury-white p-4 border border-gold-150 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 border border-gold-300/60 rounded-full flex items-center justify-center bg-luxury-cream shrink-0 text-gold-600 font-serif font-bold text-sm">
                    HS
                  </div>
                  <div>
                    <span className="font-sans text-[9px] uppercase tracking-widest text-gold-600 block">Acesso Responsivo:</span>
                    <strong className="font-serif text-sm text-luxury-black block -mt-0.5">Dr. Hugo Sobral (Admin)</strong>
                  </div>
                </div>

                {/* TAB CONTROLS */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('agendamentos')}
                    className={`px-4 py-2 text-[10px] uppercase font-sans tracking-widest transition-all cursor-pointer flex items-center gap-1.5 font-bold border ${
                      activeTab === 'agendamentos'
                        ? 'bg-luxury-black text-white border-luxury-black'
                        : 'bg-transparent text-luxury-gray border-gold-200/60 hover:text-luxury-black hover:border-gold-400'
                    }`}
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Controlar Agendamentos</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('catalogo')}
                    className={`px-4 py-2 text-[10px] uppercase font-sans tracking-widest transition-all cursor-pointer flex items-center gap-1.5 font-bold border ${
                      activeTab === 'catalogo'
                        ? 'bg-luxury-black text-white border-luxury-black'
                        : 'bg-transparent text-luxury-gray border-gold-200/60 hover:text-luxury-black hover:border-gold-400'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Editar Catálogo ({procedures.length})</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('profissionais');
                      setEditingProf(null);
                      setIsCreatingProf(false);
                      resetProfForm();
                    }}
                    className={`px-4 py-2 text-[10px] uppercase font-sans tracking-widest transition-all cursor-pointer flex items-center gap-1.5 font-bold border ${
                      activeTab === 'profissionais'
                        ? 'bg-luxury-black text-white border-luxury-black'
                        : 'bg-transparent text-luxury-gray border-gold-200/60 hover:text-luxury-black hover:border-gold-400'
                    }`}
                  >
                    <User className="w-3.5 h-3.5 text-gold-500" />
                    <span>Profissionais ({professionals.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('acesso')}
                    className={`px-4 py-2 text-[10px] uppercase font-sans tracking-widest transition-all cursor-pointer flex items-center gap-1.5 font-bold border ${
                      activeTab === 'acesso'
                        ? 'bg-luxury-black text-white border-luxury-black'
                        : 'bg-transparent text-luxury-gray border-gold-200/60 hover:text-luxury-black hover:border-gold-400'
                    }`}
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Configurações de Acesso</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-2 border border-red-250 text-red-650 hover:bg-red-50 text-[10px] font-sans uppercase flex items-center justify-center gap-1 cursor-pointer font-bold shrink-0"
                    title="Sair"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* VIEW: AGENDAMENTOS DASHBOARD AND MANAGER */}
              {activeTab === 'agendamentos' && (
                <div className="space-y-6 select-none">
                  
                  {/* KPI DASHBOARD CARDS */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {/* card 1 - Hoje */}
                    {(() => {
                      const isTodayActive = filterDate === '2026-06-13';
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterDate('2026-06-13');
                            setFilterStatus('Todos');
                          }}
                          className={`p-3.5 shadow-sm text-center transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md border duration-200 outline-none rounded-none block w-full ${
                            isTodayActive
                              ? 'bg-gold-50/50 border-gold-450 ring-1 ring-gold-400'
                              : 'bg-luxury-white border-gold-150 hover:border-gold-300'
                          }`}
                        >
                          <span className="font-sans text-[9px] uppercase tracking-wider text-gold-600 block font-semibold">Agendados Hoje</span>
                          <strong className="font-serif text-2xl text-luxury-black block mt-0.5">
                            {kpis.todayCount}
                          </strong>
                          <span className="font-sans text-[8px] text-luxury-gray block mt-0.5">
                            {isTodayActive ? '✨ Filtrado (Hoje)' : '13 de Junho'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* card 2 - Pendentes */}
                    {(() => {
                      const isPendingActive = filterStatus === 'Pendente' && !filterDate;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterDate('');
                            setFilterStatus('Pendente');
                          }}
                          className={`p-3.5 shadow-sm text-center transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md border duration-200 outline-none rounded-none block w-full ${
                            isPendingActive
                              ? 'bg-yellow-50/30 border-yellow-500 ring-1 ring-yellow-400'
                              : 'bg-luxury-white border-yellow-200/80 hover:border-yellow-400/60'
                          }`}
                        >
                          <span className="font-sans text-[9px] uppercase tracking-wider text-yellow-600 block font-semibold">Pendentes</span>
                          <strong className="font-serif text-2xl text-yellow-600 block mt-0.5">
                            {kpis.pendingCount}
                          </strong>
                          <span className="font-sans text-[8px] text-luxury-gray block mt-0.5">
                            {isPendingActive ? '✨ Filtrado (Pendentes)' : 'Aguardam contato'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* card 3 - Confirmados */}
                    {(() => {
                      const isConfirmedActive = filterStatus === 'Confirmado' && !filterDate;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterDate('');
                            setFilterStatus('Confirmado');
                          }}
                          className={`p-3.5 shadow-sm text-center transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md border duration-200 outline-none rounded-none block w-full ${
                            isConfirmedActive
                              ? 'bg-emerald-50/30 border-emerald-500 ring-1 ring-emerald-400'
                              : 'bg-luxury-white border-emerald-100 hover:border-emerald-300'
                          }`}
                        >
                          <span className="font-sans text-[9px] uppercase tracking-wider text-emerald-600 block font-semibold">Confirmados</span>
                          <strong className="font-serif text-2xl text-emerald-600 block mt-0.5">
                            {kpis.confirmedCount}
                          </strong>
                          <span className="font-sans text-[8px] text-luxury-gray block mt-0.5">
                            {isConfirmedActive ? '✨ Filtrado (Confirmados)' : 'Disparados'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* card 4 - Concluídos */}
                    {(() => {
                      const isCompletedActive = filterStatus === 'Concluído' && !filterDate;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterDate('');
                            setFilterStatus('Concluído');
                          }}
                          className={`p-3.5 shadow-sm text-center transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md border duration-200 outline-none rounded-none block w-full ${
                            isCompletedActive
                              ? 'bg-blue-50/30 border-blue-500 ring-1 ring-blue-400'
                              : 'bg-luxury-white border-blue-100 hover:border-blue-300'
                          }`}
                        >
                          <span className="font-sans text-[9px] uppercase tracking-wider text-blue-600 block font-semibold">Concluídos</span>
                          <strong className="font-serif text-2xl text-blue-600 block mt-0.5">
                            {kpis.completedCount}
                          </strong>
                          <span className="font-sans text-[8px] text-luxury-gray block mt-0.5">
                            {isCompletedActive ? '✨ Filtrado (Concluídos)' : 'Atendimentos realizados'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* card 5 - Cancelados */}
                    {(() => {
                      const isCancelledActive = filterStatus === 'Cancelado' && !filterDate;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterDate('');
                            setFilterStatus('Cancelado');
                          }}
                          className={`p-3.5 shadow-sm text-center transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md border duration-200 outline-none rounded-none block w-full ${
                            isCancelledActive
                              ? 'bg-rose-50/30 border-rose-500 ring-1 ring-rose-400'
                              : 'bg-luxury-white border-rose-100 hover:border-rose-300'
                          }`}
                        >
                          <span className="font-sans text-[9px] uppercase tracking-wider text-rose-500 block font-semibold">Cancelados</span>
                          <strong className="font-serif text-2xl text-rose-500 block mt-0.5">
                            {kpis.cancelledCount}
                          </strong>
                          <span className="font-sans text-[8px] text-luxury-gray block mt-0.5">
                            {isCancelledActive ? '✨ Filtrado (Cancelados)' : 'No histórico'}
                          </span>
                        </button>
                      );
                    })()}

                    {/* card 6 - Total do Mês / Todos */}
                    {(() => {
                      const isAllActive = filterStatus === 'Todos' && !filterDate;
                      return (
                        <button
                          type="button"
                          onClick={() => {
                            setFilterDate('');
                            setFilterStatus('Todos');
                          }}
                          className={`p-3.5 shadow-sm text-center col-span-2 md:col-span-1 transition-all cursor-pointer hover:scale-[1.02] hover:shadow-md border duration-200 outline-none rounded-none block w-full ${
                            isAllActive
                              ? 'bg-gold-50/50 border-gold-500 ring-1 ring-gold-400'
                              : 'bg-luxury-white border-gold-300 hover:border-gold-400'
                          }`}
                        >
                          <span className="font-sans text-[9px] uppercase tracking-wider text-gold-700 block font-semibold">Total do Mês</span>
                          <strong className="font-serif text-2xl text-gold-600 block mt-0.5">
                            {kpis.monthCount}
                          </strong>
                          <span className="font-sans text-[8px] text-luxury-gray block mt-0.5">
                            {isAllActive ? '✨ Todos Exibidos' : 'Ver Todos'}
                          </span>
                        </button>
                      );
                    })()}
                  </div>

                  {/* FILTER BAR BAR */}
                  <div className="bg-luxury-white border border-gold-150 p-4 shadow-xs space-y-3">
                    <div className="flex items-center gap-1.5 border-b pb-1.5 border-gold-100">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-gold-600" />
                      <h4 className="font-serif text-[11px] font-bold text-luxury-black uppercase tracking-widest">Filtros Avançados</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      {/* Search client or procedure */}
                      <div className="relative flex items-center">
                        <Search className="w-3.5 h-3.5 text-gold-500 absolute left-3" />
                        <input
                          type="text"
                          placeholder="Buscar cliente, tel ou ritual..."
                          value={filterSearch}
                          onChange={(e) => setFilterSearch(e.target.value)}
                          className="w-full text-xs font-sans pl-8 pr-3 py-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                        />
                      </div>

                      {/* Status Filter Dropdown */}
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[9px] uppercase tracking-widest text-[#a88a53] font-semibold shrink-0">Status:</span>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full text-xs font-sans px-2.5 py-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300 rounded-none"
                        >
                          <option value="Todos">Todos</option>
                          <option value="Pendente">Pendente</option>
                          <option value="Confirmado">Confirmado</option>
                          <option value="Concluído">Concluído</option>
                          <option value="Cancelado">Cancelado</option>
                        </select>
                      </div>

                      {/* Date selection field */}
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-[9px] uppercase tracking-widest text-[#a88a53] font-semibold shrink-0">Data:</span>
                        <input
                          type="date"
                          value={filterDate}
                          onChange={(e) => setFilterDate(e.target.value)}
                          className="w-full text-xs font-sans px-2.5 py-1.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300 select-none h-[38px]"
                        />
                        {filterDate && (
                          <button 
                            onClick={() => setFilterDate('')}
                            className="p-1 border border-transparent text-gray-400 hover:text-red-500 font-bold"
                            title="Limpar Data"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ACTIVE RESERVATIONS ARCHIVE */}
                  <div className="space-y-3.5">
                    {/* Sincronização em Tempo Real & Carga Manual */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-luxury-white border border-gold-250/60 p-3 rounded-md shadow-2xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleManualRefresh}
                          disabled={isRefreshing}
                          className={`p-2 border border-gold-200 text-gold-700 bg-gold-50/20 hover:bg-gold-50 hover:border-gold-350 rounded-sm cursor-pointer disabled:opacity-50 transition-all flex items-center justify-center`}
                          title="Forçar recarga do banco de dados (Sincronização de segurança)"
                        >
                          <RefreshCw className={`w-4 h-4 text-gold-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="flex flex-col">
                          <span className="font-sans text-[9px] uppercase tracking-wider text-gold-600/90 font-bold flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            Conexão em Tempo Real Ativa
                          </span>
                          <span className="font-serif text-xs text-luxury-black font-semibold mt-0.5">
                            {isRefreshing ? (
                              <span className="text-gold-600 animate-pulse">Buscando do banco de dados...</span>
                            ) : (
                              <span>Última atualização: <span className="font-sans text-xs">{lastUpdated.toLocaleTimeString('pt-BR')}</span></span>
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right flex flex-col">
                          <span className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray">Total Carregado</span>
                          <span className="font-serif text-xs text-luxury-black font-bold mt-0.5">
                            {bookings.length} {bookings.length === 1 ? 'agendamento' : 'agendamentos'}
                          </span>
                        </div>

                        <AnimatePresence>
                          {refreshSuccess && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              className="flex items-center gap-1 bg-green-50 border border-green-200 px-3 py-1.5 rounded-sm text-xs text-green-700 font-sans font-medium shadow-2xs"
                            >
                              <Check className="w-3.5 h-3.5 text-green-600 font-bold" />
                              <span>Banco atualizado!</span>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b pb-2 border-gold-100/55">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-serif text-xs font-semibold text-luxury-black mr-2">
                          Resultados encontrados: <span className="text-gold-600 font-bold">{filteredBookings.length}</span>
                        </span>
                        <button
                          onClick={() => {
                            setManualClientName('');
                            setManualClientPhone('');
                            setManualProcedureId(procedures.filter(p => p.active)[0]?.id || '');
                            setManualDate(new Date().toISOString().split('T')[0]);
                            setManualTime('09:00');
                            setManualProfessional(professionals[0]?.name || '');
                            setManualStatus('Confirmado');
                            setManualObservations('');
                            setIsCreatingBooking(true);
                          }}
                          className="px-2.5 py-1.5 border border-gold-300 text-gold-700 bg-gold-50/70 hover:bg-gold-100 hover:border-gold-400 font-sans text-[9px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer font-bold transition-all"
                        >
                          <Plus className="w-3 h-3 text-gold-600" />
                          <span>Novo Agendamento</span>
                        </button>
                        {bookings.length > 0 && (
                          <button
                            onClick={() => {
                              if (window.confirm('Atenção: isto apagará permanentemente TODOS os agendamentos registrados no sistema. Esta ação não poderá ser desfeita. Deseja prosseguir de forma definitiva?')) {
                                onUpdateBookings([]);
                              }
                            }}
                            className="px-2.5 py-1.5 border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 hover:border-red-350 font-sans text-[9px] tracking-widest uppercase flex items-center gap-1.5 cursor-pointer font-bold transition-all"
                          >
                            <Trash2 className="w-3 h-3 text-red-600" />
                            <span>Zerar Todos Agendamentos</span>
                          </button>
                        )}
                      </div>
                      <span className="font-sans text-[8px] text-luxury-gray uppercase tracking-widest">Clique nos botões de ação rápida para modificar</span>
                    </div>

                     {bookings.length === 0 ? (
                       <div className="p-12 text-center bg-luxury-white border border-dashed border-red-200">
                         <AlertCircle className="w-8 h-8 text-red-500 mx-auto opacity-70 mb-2" />
                         <p className="font-serif text-sm text-luxury-black font-semibold">Nenhum agendamento encontrado.</p>
                         <p className="font-sans text-[10px] text-gray-400 mt-1">Aguardando novos agendamentos reais cadastrados pelos clientes.</p>
                       </div>
                     ) : filteredBookings.length === 0 ? (
                       <div className="p-12 text-center bg-luxury-white border border-dashed border-gold-200">
                         <AlertCircle className="w-8 h-8 text-gold-400 mx-auto opacity-70 mb-2" />
                         <p className="font-serif text-sm text-luxury-black">Nenhum agendamento corresponde aos filtros atuais.</p>
                         <p className="font-sans text-[10px] text-gray-400 mt-1">Experimente alterar a data ou limpar o campo de busca.</p>
                       </div>
                     ) : (
                      /* APPOINTMENT RECORDS GRID / LIST */
                      <div className="space-y-3.5">
                        
                        {/* Display Table on Desktop, Cards on Mobile */}
                        <div className="hidden md:block overflow-x-auto bg-luxury-white border border-gold-150 shadow-sm">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-luxury-cream border-b border-gold-150 font-sans text-[9px] uppercase text-gold-700 tracking-widest">
                                <th className="p-3.5">Cliente / Contato</th>
                                <th className="p-3.5">Procedimento</th>
                                <th className="p-3.5">Profissional</th>
                                <th className="p-3.5 text-center">Data e Hora</th>
                                <th className="p-3.5 text-center">Status</th>
                                <th className="p-3.5 text-center">Notificação</th>
                                <th className="p-3.5 text-right">Ações Rápidas</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gold-100">
                              {filteredBookings.map((b) => {
                                const latestLog = b.history?.[0];
                                return (
                                  <tr key={b.id} className="hover:bg-gold-50/15 transition-colors">
                                    {/* Client */}
                                    <td className="p-3.5 font-sans">
                                      <strong className="block text-luxury-black text-[12px]">{b.clientName}</strong>
                                      <span className="text-[10px] text-luxury-gray flex items-center gap-1 mt-0.5">
                                        <Phone className="w-3 h-3 text-[#558253]" />
                                        {b.clientPhone}
                                      </span>
                                      <span className="text-[9px] text-[#a88d59] font-sans block mt-1">
                                        📅 Criado em: {b.createdAt}
                                      </span>
                                    </td>

                                    {/* Procedure */}
                                    <td className="p-3.5 font-serif text-luxury-black font-semibold">
                                      <span>{b.procedureName}</span>
                                      {b.observations && (
                                        <p className="text-[10px] text-stone-500 font-sans font-normal italic mt-1 border-l border-gold-300 pl-1.5" title={b.observations}>
                                          Obs: {b.observations}
                                        </p>
                                      )}
                                    </td>

                                    {/* Professional */}
                                    <td className="p-3.5 font-sans text-stone-500 font-medium">
                                      {b.professional}
                                    </td>

                                    {/* Date & Time */}
                                    <td className="p-3.5 text-center font-sans">
                                      <strong className="block text-gray-800">{b.date}</strong>
                                      <span className="text-[10px] text-gold-600 bg-gold-50 px-1.5 py-0.5 border border-gold-100 inline-block font-semibold mt-1">{b.time}</span>
                                    </td>

                                    {/* Status Badge */}
                                    <td className="p-3.5 text-center align-middle">
                                      <span className={`px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider inline-block rounded-xs ${
                                        b.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                        b.status === 'Cancelado' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                        b.status === 'Concluído' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                        'bg-amber-50 text-amber-700 border border-amber-200'
                                      }`}>
                                        {b.status}
                                      </span>
                                      {b.status === 'Cancelado' && b.cancelledReason && (
                                        <p className="text-[8px] text-red-500 italic mt-1 max-w-[120px] mx-auto line-clamp-1" title={b.cancelledReason}>
                                          Motive: {b.cancelledReason}
                                        </p>
                                      )}
                                    </td>

                                    {/* Notification delivery indicators */}
                                    <td className="p-3.5 text-center align-middle">
                                      {latestLog ? (
                                        <button 
                                          onClick={() => setViewingNotificationBooking(b)}
                                          className="cursor-pointer group flex flex-col items-center justify-center gap-0.5 hover:bg-gold-50/50 p-1 w-full rounded-sm transition-all border border-transparent hover:border-gold-200"
                                          title="Clique para ver o Histórico Completo de Notificações"
                                        >
                                          <span className="text-[8px] font-sans uppercase tracking-wider font-semibold text-gray-505 group-hover:text-gold-700">{latestLog.type}</span>
                                          
                                          {latestLog.deliveryStatus === 'Pendente' && (
                                            <div className="flex items-center gap-1 text-amber-600 text-[10px] font-semibold">
                                              <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                              <span>Pendente</span>
                                            </div>
                                          )}
                                          {latestLog.deliveryStatus === 'Enviado' && (
                                            <div className="flex items-center gap-1 text-sky-600 text-[10px] font-semibold">
                                              <Send className="w-3.5 h-3.5 text-sky-500" />
                                              <span>Enviado</span>
                                            </div>
                                          )}
                                          {latestLog.deliveryStatus === 'Falhou' && (
                                            <div className="flex items-center gap-1 text-rose-600 text-[10px] font-semibold">
                                              <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                                              <span>Falhou</span>
                                            </div>
                                          )}
                                          {(latestLog.deliveryStatus === 'Entregue' || !latestLog.deliveryStatus) && (
                                            <div className="flex items-center gap-1 text-emerald-600 text-[10px] font-semibold">
                                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                              <span>Entregue</span>
                                            </div>
                                          )}
                                          <span className="text-[7px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-sans mt-0.5">Logs 📁</span>
                                        </button>
                                      ) : (
                                        <button 
                                          onClick={() => setViewingNotificationBooking(b)}
                                          className="text-[9px] text-gray-405 italic hover:text-gold-700 cursor-pointer flex items-center gap-1 justify-center mx-auto border border-dashed border-gray-200 hover:border-gold-300 p-1 bg-gray-50/50"
                                        >
                                          <span>Sem histórico</span>
                                        </button>
                                      )}
                                    </td>

                                    {/* Actions */}
                                    <td className="p-3.5 text-right">
                                      <div className="flex items-center justify-end gap-1.5">
                                        {/* Auto Whatsapp reminder manual trigger */}
                                        <button
                                          onClick={() => setMessagingBooking(b)}
                                          className="p-1 px-[7px] border border-green-200 hover:bg-green-50 text-green-700 cursor-pointer rounded-xs"
                                          title="Enviar Mensagem Manual no WhatsApp"
                                        >
                                          <Send className="w-3 h-3 text-green-600" />
                                        </button>

                                        {/* Actions per state */}
                                        {b.status === 'Pendente' && (
                                          <button
                                            onClick={() => handleConfirmBooking(b)}
                                            className="p-1 px-2 bg-emerald-600 text-white hover:bg-emerald-750 text-[10px] font-sans font-bold flex items-center gap-0.5 cursor-pointer rounded-xs"
                                            title="Confirmar Agendamento"
                                          >
                                            <Check className="w-3 h-3" />
                                            <span>Confirmar</span>
                                          </button>
                                        )}

                                        {b.status === 'Confirmado' && (
                                          <button
                                            onClick={() => handleConcludeBooking(b)}
                                            className="p-1 px-2 bg-indigo-600 text-white hover:bg-indigo-750 text-[10px] font-sans font-bold flex items-center gap-0.5 cursor-pointer rounded-xs"
                                            title="Marcar como Concluído"
                                          >
                                            <Check className="w-3 h-3" />
                                            <span>Concluir</span>
                                          </button>
                                        )}

                                        <button
                                          onClick={() => handleOpenEditBooking(b)}
                                          className="p-1.5 border border-gold-300 text-gold-700 hover:bg-gold-50 cursor-pointer rounded-xs"
                                          title="✏️ Editar Agendamento"
                                        >
                                          <Edit2 className="w-3 h-3 text-gold-600" />
                                        </button>

                                        <button
                                          onClick={() => handleOpenReschedule(b)}
                                          className="p-1.5 border border-gold-300 text-gold-700 hover:bg-gold-50 cursor-pointer rounded-xs"
                                          title="✏️ Reagendar Atendimento"
                                        >
                                          <Clock className="w-3 h-3" />
                                        </button>

                                        {b.status !== 'Cancelado' && b.status !== 'Concluído' && (
                                          <button
                                            onClick={() => handleOpenCancel(b)}
                                            className="p-1.5 border border-red-200 text-rose-500 hover:bg-rose-50 cursor-pointer rounded-xs"
                                            title="❌ Cancelar Agendamento"
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        )}
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>

                        {/* Display Mobile Cards */}
                        <div className="md:hidden space-y-3">
                          {filteredBookings.map((b) => {
                            const latestLog = b.history?.[0];
                            return (
                              <div key={b.id} className="bg-luxury-white border border-gold-150 p-4 space-y-3 shadow-xs">
                                <div className="flex items-start justify-between border-b pb-2 border-gold-100">
                                  <div className="space-y-0.5">
                                    <h5 className="font-serif font-bold text-sm text-luxury-black">{b.clientName}</h5>
                                    <p className="font-sans text-[10px] text-luxury-gray flex items-center gap-1">
                                      <Phone className="w-3 h-3 text-[#558253]" />
                                      {b.clientPhone}
                                    </p>
                                  </div>
                                  <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider rounded-xs inline-block ${
                                    b.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    b.status === 'Cancelado' ? 'bg-rose-50 text-rose-600 border border-rose-200' :
                                    b.status === 'Concluído' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    {b.status}
                                  </span>
                                </div>

                                <div className="text-xs space-y-1 bg-luxury-cream p-2.5 border border-gold-100">
                                  <p className="font-serif">
                                    <strong className="text-gold-700">Procedimento:</strong> {b.procedureName}
                                  </p>
                                  <p className="font-sans">
                                    <strong className="text-gold-700">Profissional:</strong> {b.professional}
                                  </p>
                                  <p className="font-sans">
                                    <strong className="text-gold-700 font-semibold text-luxury-black">Previsão:</strong> {b.date} às {b.time}
                                  </p>
                                  <p className="font-sans text-[10.5px]">
                                    <strong className="text-gold-700 font-semibold">Solicitado em:</strong> {b.createdAt}
                                  </p>
                                  {b.observations && (
                                    <p className="font-sans text-stone-600 italic text-[11px] mt-1 bg-[#fcfbfa] p-1 border-l border-gold-300">
                                      <strong>Obs:</strong> {b.observations}
                                    </p>
                                  )}
                                  {b.status === 'Cancelado' && b.cancelledReason && (
                                    <p className="font-sans text-red-500 italic text-[11px] mt-1 bg-red-50/50 p-1 border-l border-red-500">
                                      Motivo Cancelamento: {b.cancelledReason}
                                    </p>
                                  )}
                                </div>

                                {/* mobile log */}
                                {latestLog ? (
                                  <div 
                                    onClick={() => setViewingNotificationBooking(b)}
                                    className={`flex items-center justify-between gap-1.5 text-[10px] font-sans p-2 border cursor-pointer active:scale-[0.99] transition-all rounded-xs ${
                                      latestLog.deliveryStatus === 'Pendente' ? 'bg-amber-50/40 border-amber-200 text-amber-800' :
                                      latestLog.deliveryStatus === 'Enviado' ? 'bg-sky-50/40 border-sky-200 text-sky-800' :
                                      latestLog.deliveryStatus === 'Falhou' ? 'bg-rose-50/45 border-rose-200 text-rose-850' :
                                      'bg-emerald-50/35 border-emerald-100 text-emerald-800'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5 min-w-0">
                                      {latestLog.deliveryStatus === 'Pendente' && <Clock className="w-3.5 h-3.5 shrink-0 animate-pulse text-amber-500" />}
                                      {latestLog.deliveryStatus === 'Enviado' && <Send className="w-3.5 h-3.5 shrink-0 text-sky-500" />}
                                      {latestLog.deliveryStatus === 'Falhou' && <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />}
                                      {(latestLog.deliveryStatus === 'Entregue' || !latestLog.deliveryStatus) && <CheckCircle className="w-3.5 h-3.5 shrink-0 text-emerald-600" />}
                                      <span className="truncate">
                                        Notificação *{latestLog.type}*: <strong>{
                                          latestLog.deliveryStatus === 'Pendente' ? 'Preparando...' :
                                          latestLog.deliveryStatus === 'Enviado' ? 'Enviado' :
                                          latestLog.deliveryStatus === 'Falhou' ? 'Falhou' : 'Entregue'
                                        }</strong> ({latestLog.sentAt})
                                      </span>
                                    </div>
                                    <span className="text-[9px] uppercase tracking-wider text-gold-700 underline font-semibold shrink-0">Logs 📁</span>
                                  </div>
                                ) : (
                                  <button 
                                    onClick={() => setViewingNotificationBooking(b)}
                                    className="w-full text-left text-[10px] text-gray-400 bg-stone-50/60 p-2 border border-stone-200 border-dashed text-center italic cursor-pointer hover:border-gold-300 hover:text-gold-700 transition"
                                  >
                                    Nenhuma notificação enviada. Ver Histórico 📁
                                  </button>
                                )}

                                {/* Card Actions */}
                                <div className="flex flex-wrap items-center gap-1.5 pt-1.5 justify-end">
                                  {/* Auto Whatsapp dispatch */}
                                  <button
                                    onClick={() => setMessagingBooking(b)}
                                    className="p-2 border border-green-200 hover:bg-green-50 text-green-700 text-[10px] uppercase font-sans tracking-widest flex items-center gap-1 cursor-pointer font-bold"
                                  >
                                    <Send className="w-3 h-3" />
                                    <span>Enviar WhatsApp</span>
                                  </button>

                                  {/* Confirm */}
                                  {b.status === 'Pendente' && (
                                    <button
                                      onClick={() => handleConfirmBooking(b)}
                                      className="p-2 bg-emerald-600 text-white text-[10px] uppercase font-sans font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Confirmar</span>
                                    </button>
                                  )}

                                  {/* Conclude */}
                                  {b.status === 'Confirmado' && (
                                    <button
                                      onClick={() => handleConcludeBooking(b)}
                                      className="p-2 bg-indigo-600 text-white text-[10px] uppercase font-sans font-bold flex items-center gap-1 cursor-pointer"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Concluir</span>
                                    </button>
                                  )}

                                  {/* Edit */}
                                  <button
                                    onClick={() => handleOpenEditBooking(b)}
                                    className="p-2 border border-gold-300 text-gold-700 text-[10px] uppercase font-sans font-bold flex items-center gap-1 cursor-pointer"
                                  >
                                    <Edit2 className="w-3 h-3 text-gold-600" />
                                    <span>Editar</span>
                                  </button>

                                  {/* Reschedule */}
                                  <button
                                    onClick={() => handleOpenReschedule(b)}
                                    className="p-2 border border-gold-300 text-gold-700 text-[10px] uppercase font-sans flex items-center gap-1 cursor-pointer"
                                  >
                                    <Clock className="w-3 h-3" />
                                    <span>Reagendar</span>
                                  </button>

                                  {/* Cancel */}
                                  {b.status !== 'Cancelado' && b.status !== 'Concluído' && (
                                    <button
                                      onClick={() => handleOpenCancel(b)}
                                      className="p-2 border border-red-200 text-rose-500 text-[10px] uppercase font-sans flex items-center gap-1 cursor-pointer"
                                    >
                                      <X className="w-3 h-3" />
                                      <span>Cancelar</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* VIEW: CATALOG PROCEDURES EDIT LAYOUT */}
              {activeTab === 'catalogo' && (
                <div className="space-y-6">
                  
                  {/* TOP ACTIONS ROW */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-luxury-white p-4 border border-gold-150">
                    <div className="space-y-0.5">
                      <p className="font-sans text-[10px] uppercase text-gold-680 tracking-wider font-semibold">Tabela tarifária ativa</p>
                      <h4 className="font-serif text-sm font-semibold text-luxury-black">Procedimentos e Taxas Cadastradas</h4>
                    </div>

                    <button
                      onClick={handleStartCreate}
                      className="px-4 py-2.5 bg-luxury-black text-white text-[10px] font-sans tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-semibold shadow-sm"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Procedimento</span>
                    </button>
                  </div>

                  {/* FORM POPUP / OVERLAY (FOR CREATING OR EDITING EXPLICITLY) */}
                  {(isCreating || editingProc) && (
                    <div className="bg-luxury-white border-2 border-gold-300 p-6 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b pb-3 border-gold-100">
                        <h4 className="font-serif text-sm font-bold uppercase text-luxury-black">
                          {isCreating ? 'Adicionar Novo Procedimento' : `Editando: ${editingProc?.name}`}
                        </h4>
                        <button
                          onClick={handleCancelForm}
                          className="p-1 border border-transparent hover:border-gold-100 text-luxury-gray hover:text-luxury-black cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveForm} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <label className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray font-semibold block">Nome do Procedimento *</label>
                            <input
                              type="text"
                              required
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                            />
                          </div>

                          {/* Category */}
                          <div className="space-y-1 col-span-2 sm:col-span-1">
                            <label className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray font-semibold block">Categoria *</label>
                            <select
                              value={formCategory}
                              onChange={(e) => setFormCategory(e.target.value as any)}
                              className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300 rounded-none h-[42px]"
                            >
                              <option value="EXPERIÊNCIAS FACIAIS">FACIAIS</option>
                              <option value="CUIDADOS CORPORAIS">CORPORAIS</option>
                              <option value="PROCEDIMENTOS DE TRATAMENTO">TRATAMENTOS</option>
                            </select>
                          </div>

                          {/* Price */}
                          <div className="space-y-1">
                            <label className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray font-semibold block">Valor de Venda (R$)*</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={formPrice}
                              onChange={(e) => setFormPrice(parseFloat(e.target.value) || 0)}
                              className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                            />
                          </div>

                          {/* Image URL */}
                          <div className="space-y-1">
                            <label className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray font-semibold block">Foto (URL da Imagem)</label>
                            <input
                              type="text"
                              value={formImageUrl}
                              onChange={(e) => setFormImageUrl(e.target.value)}
                              className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-1 col-span-2">
                            <label className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray font-semibold block">Descrição Oficial (No Catálogo) *</label>
                            <textarea
                              rows={3}
                              required
                              value={formDescription}
                              onChange={(e) => setFormDescription(e.target.value)}
                              className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300 resize-none"
                            />
                          </div>

                          {/* Indication */}
                          <div className="space-y-1 col-span-2">
                            <label className="font-sans text-[9px] uppercase tracking-wider text-luxury-gray font-semibold block">Indicação Clínica e Benefícios (No Catálogo)</label>
                            <input
                              type="text"
                              value={formIndication}
                              onChange={(e) => setFormIndication(e.target.value)}
                              className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-300"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <button
                            type="button"
                            onClick={handleCancelForm}
                            className="px-4 py-2 border border-gold-100 hover:bg-neutral-50 text-[10px] font-sans uppercase tracking-widest text-luxury-gray cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-luxury-black text-white text-[10px] font-sans uppercase tracking-widest hover:bg-gold-500 transition-colors flex items-center gap-1.5 cursor-pointer font-bold animate-fade-in"
                          >
                            <Save className="w-3.5 h-3.5 text-gold-250" />
                            <span>Salvar</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* LIST OF CURRENT PROCEDURES FOR ADMIN CRUD */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                      <p className="font-serif text-sm font-semibold text-luxury-black">Procedimentos Cadastrados ({procedures.length})</p>
                      <p className="font-sans text-[8px] text-luxury-gray tracking-widest uppercase mb-0.5">Gerencie os Valores e o Status de Ativo</p>
                    </div>

                    <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                      {procedures.map((proc) => (
                        <div
                          key={proc.id}
                          className={`p-3 bg-luxury-white border flex items-center justify-between gap-4 transition-all ${
                            proc.active ? 'border-gold-100 shadow-xs' : 'border-dashed border-gray-200 bg-white opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-zinc-50 border border-gold-100 overflow-hidden shrink-0">
                              <img src={proc.imageUrl} alt="" className="w-full h-full object-cover font-sans text-[8px]" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className="font-serif text-xs font-bold text-luxury-black line-clamp-1">{proc.name}</h5>
                              <p className="font-sans text-[9px] text-luxury-gray uppercase tracking-widest leading-none block">
                                {proc.category.replace('PROCEDIMENTOS DE ', '')}
                              </p>
                              <p className="font-serif text-xs text-gold-600 font-semibold mt-0.5">
                                R$ {proc.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>

                          {/* Row actions */}
                          <div className="flex items-center gap-2">
                            {/* Toggle visibility */}
                            <button
                              onClick={() => handleToggleActive(proc.id)}
                              className={`p-2 border transition-all cursor-pointer rounded-xs`}
                              title={proc.active ? 'Desativar do catálogo' : 'Ativar no catálogo'}
                            >
                              {proc.active ? (
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <EyeOff className="w-3.5 h-3.5 text-orange-400" />
                              )}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleStartEdit(proc)}
                              className="p-2 border border-gold-100 text-luxury-gray hover:text-gold-500 hover:border-gold-300 transition-colors cursor-pointer rounded-xs"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteProcedure(proc.id)}
                              className="p-2 border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors cursor-pointer rounded-xs"
                              title="Remover"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SYSTEM MAINTENANCE CLEANUP */}
                  <div className="pt-6 border-t border-gold-100 text-right">
                    <button
                      onClick={handleClearDatabase}
                      className="px-4 py-2 border border-dashed border-red-300 text-red-650 rounded-none text-[9px] font-sans uppercase tracking-widest hover:bg-red-50 transition-colors flex items-center gap-1 inline-flex cursor-pointer font-bold"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Limpar Base de Dados</span>
                    </button>
                  </div>

                </div>
              )}

              {/* VIEW: GERENCIAMENTO DE PROFISSIONAIS */}
              {activeTab === 'profissionais' && (
                <div className="space-y-6 animate-fade-in text-left">
                  <div className="bg-luxury-white border border-gold-150 p-6 shadow-luxury relative block">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
                    
                    <div className="border-b pb-3 border-gold-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-sans text-[10px] uppercase text-gold-700 tracking-wider font-semibold">Equipe e Especialistas</p>
                        <h4 className="font-serif text-sm font-semibold text-luxury-black">Gerenciamento de Profissionais</h4>
                      </div>
                      <div className="flex gap-2">
                        {!isCreatingProf && !editingProf && (
                          <button
                            type="button"
                            onClick={() => {
                              resetProfForm();
                              setIsCreatingProf(true);
                            }}
                            className="px-3 py-1.5 bg-luxury-black text-white hover:bg-gold-600 font-sans text-[9px] tracking-widest uppercase flex items-center gap-1 cursor-pointer font-bold transition-all"
                          >
                            <Plus className="w-3.5 h-3.5 mr-0.5 text-gold-300" />
                            <span>Adicionar Profissional</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* FORM: CREATE OR EDIT PROFESSIONAL */}
                    {(isCreatingProf || editingProf) && (
                      <form onSubmit={editingProf ? handleSaveEditProf : handleCreateProfessional} className="mt-5 p-4 bg-luxury-cream border border-gold-100 space-y-4 animate-fade-in block w-full text-left">
                        <div className="flex items-center justify-between border-b border-gold-100 pb-2">
                          <p className="font-serif text-[12px] font-bold text-luxury-black flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-gold-600" />
                            <span>{editingProf ? `Editar Profissional: ${editingProf.name}` : 'Cadastrar Novo Profissional'}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingProf(false);
                              setEditingProf(null);
                            }}
                            className="p-1 hover:bg-gold-100 text-stone-500 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Name */}
                          <div className="space-y-1 col-span-1">
                            <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Nome Completo</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Dra. Juliana Santos"
                              value={profFormName}
                              onChange={(e) => setProfFormName(e.target.value)}
                              className="w-full text-xs font-sans p-2 bg-white border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none text-luxury-black bg-white"
                            />
                          </div>

                          {/* Role */}
                          <div className="space-y-1 col-span-1">
                            <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block font-bold">Especialidade / Cargo</label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Dermatologista Clínico"
                              value={profFormRole}
                              onChange={(e) => setProfFormRole(e.target.value)}
                              className="w-full text-xs font-sans p-2 bg-white border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none text-luxury-black bg-white"
                            />
                          </div>

                          {/* Image URL */}
                          <div className="space-y-1 col-span-1">
                            <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">URL da Foto de Perfil (Opcional)</label>
                            <input
                              type="url"
                              placeholder="https://images.unsplash.com/... (recomenda-se 150x150 facial)"
                              value={profFormImageUrl}
                              onChange={(e) => setProfFormImageUrl(e.target.value)}
                              className="w-full text-xs font-sans p-2 bg-white border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none text-luxury-black bg-white"
                            />
                          </div>

                          {/* Display Order & Active State */}
                          <div className="grid grid-cols-2 gap-4 col-span-1">
                            <div className="space-y-1 col-span-1">
                              <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block font-bold">Ordem de Exibição</label>
                              <input
                                type="number"
                                min={1}
                                required
                                value={profFormOrder}
                                onChange={(e) => setProfFormOrder(Number(e.target.value))}
                                className="w-full text-xs font-sans p-2 bg-white border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none text-luxury-black bg-white"
                              />
                            </div>

                            <div className="space-y-1 col-span-1 flex flex-col justify-end">
                              <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block mb-2 font-bold">Visibilidade</label>
                              <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-sans text-stone-700 font-semibold select-none pb-2">
                                <input
                                  type="checkbox"
                                  checked={profFormActive}
                                  onChange={(e) => setProfFormActive(e.target.checked)}
                                  className="w-4 h-4 accent-gold-600 rounded-none cursor-pointer"
                                />
                                Ativo no Agendamento
                              </label>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-gold-100 pt-3 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingProf(false);
                              setEditingProf(null);
                            }}
                            className="bg-stone-100 text-stone-700 hover:bg-stone-200 font-sans text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-none font-bold cursor-pointer transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="bg-luxury-black text-white hover:bg-gold-600 font-sans text-[9px] tracking-widest uppercase px-4 py-1.5 rounded-none font-bold flex items-center gap-1.5 cursor-pointer transition-all"
                          >
                            <Save className="w-3.5 h-3.5 text-gold-300" />
                            <span>{editingProf ? 'Salvar Alterações' : 'Gravar Profissional'}</span>
                          </button>
                        </div>
                      </form>
                    )}

                    {/* PROFESSIONALS CARDS GRID */}
                    <div className="mt-6 space-y-4 text-left">
                      <p className="font-sans text-[10px] text-luxury-gray uppercase tracking-widest font-bold">Profissionais Cadastrados ({professionals.length})</p>
                      
                      {professionals.length === 0 ? (
                        <div className="p-10 text-center border border-dashed border-gold-200">
                          <AlertCircle className="w-8 h-8 text-gold-400 mx-auto opacity-70 mb-2" />
                          <p className="font-serif text-sm text-luxury-black">Nenhum profissional cadastrado.</p>
                          <p className="font-sans text-[10px] text-gray-400 mt-1">Clique acima em "Adicionar Profissional" para iniciar.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {professionals.slice().sort((a, b) => a.order - b.order).map((prof) => (
                            <div key={prof.id} className={`p-4 border flex gap-3.5 relative hover:border-gold-400 hover:shadow-sm transition-all duration-300 rounded-none text-left ${!prof.active ? 'bg-stone-50 border-stone-200' : 'bg-white border-gold-150'}`}>
                              
                              {/* Thumbnail image */}
                              <div className="w-14 h-14 rounded-full border border-gold-150 bg-luxury-cream overflow-hidden shrink-0 flex items-center justify-center relative">
                                {prof.imageUrl ? (
                                  <img 
                                    src={prof.imageUrl} 
                                    alt={prof.name} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover" 
                                  />
                                ) : (
                                  <User className="w-6 h-6 text-gold-400" />
                                )}
                                <div className="absolute bottom-0 right-0 bg-luxury-black border border-gold-300 text-gold-300 w-4 h-4 flex items-center justify-center text-[8px] font-bold rounded-full select-none" title="Ordem de Exibição">
                                  {prof.order}
                                </div>
                              </div>

                              {/* Details */}
                              <div className="space-y-1 overflow-hidden flex-1 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-center gap-1.5 justify-between">
                                    <h5 className="font-serif text-[13px] font-bold text-luxury-black truncate pr-2" title={prof.name}>{prof.name}</h5>
                                    <span className={`px-1.5 py-0.5 text-[8px] font-sans font-semibold uppercase tracking-wider rounded-xs shrink-0 select-none ${
                                      prof.active ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-stone-100 text-stone-500 border border-stone-200'
                                    }`}>
                                      {prof.active ? 'Ativo' : 'Inativo'}
                                    </span>
                                  </div>
                                  <p className="font-sans text-[10px] text-gold-700/90 font-medium leading-none tracking-wide mt-0.5">{prof.role}</p>
                                </div>
                                
                                {/* Professional Actions Toolbar */}
                                <div className="flex items-center gap-1.5 pt-2 border-t border-gold-100/40 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleProfActive(prof.id)}
                                    className={`px-1.5 py-1 text-[8px] font-sans uppercase tracking-widest font-bold border rounded-xs cursor-pointer transition-colors ${
                                      prof.active 
                                        ? 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100' 
                                        : 'bg-emerald-50/75 text-emerald-700 border-emerald-200 hover:bg-emerald-100/50'
                                    }`}
                                  >
                                    {prof.active ? 'Desativar' : 'Ativar'}
                                  </button>
                                  
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditProf(prof)}
                                    className="p-1 px-[5px] border border-gold-100 text-stone-500 hover:text-gold-500 hover:border-gold-300 transition-colors cursor-pointer rounded-xs"
                                    title="Editar Profissional"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteProf(prof.id, prof.name)}
                                    className="p-1 px-[5px] border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer rounded-xs"
                                    title="Remover Profissional"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW: CONFIGURAÇÕES DE ACESSO */}
              {activeTab === 'acesso' && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* CREDENTIALS CARD */}
                  <div className="bg-luxury-white border border-gold-150 p-6 shadow-luxury relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300" />
                    
                    <div className="border-b pb-3 border-gold-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-sans text-[10px] uppercase text-gold-700 tracking-wider font-semibold">Configurações de Segurança</p>
                        <h4 className="font-serif text-sm font-semibold text-luxury-black">Configurações de Acesso Administrativo</h4>
                      </div>
                      <Lock className="w-5 h-5 text-gold-500 shrink-0" />
                    </div>

                    {accessFeedback && (
                      <div className={`p-4 text-xs font-sans border-l-2 mt-4 select-none ${
                        accessFeedback.type === 'success'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                          : 'bg-rose-50 border-rose-500 text-rose-850'
                      }`}>
                        <div className="flex items-start gap-2.5">
                          {accessFeedback.type === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-bold block shrink-0">{accessFeedback.type === 'success' ? 'Sucesso' : 'Atenção'}</span>
                            <span className="block mt-0.5 leading-relaxed">{accessFeedback.msg}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <form onSubmit={handleSaveAccessCredentials} className="mt-6 space-y-4 font-sans select-none">
                      
                      {/* USERNAME PAIR (Current and New User) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1 bg-luxury-cream/30 p-3 border border-gold-100/50">
                          <label className="text-[10px] uppercase tracking-widest text-gold-700 block font-bold">Usuário Atual do Gabinete:</label>
                          <input
                            type="text"
                            readOnly
                            value={localStorage.getItem('hugo_admin_username_db') || 'drhugo.beauty'}
                            className="w-full text-xs p-2.5 bg-luxury-cream/80 border border-gold-100 text-luxury-black/60 focus:outline-none select-none cursor-not-allowed font-medium"
                          />
                          <p className="text-[9px] text-luxury-gray leading-tight">Credencial ativa para este portal.</p>
                        </div>

                        <div className="space-y-1 p-3 border border-dashed border-gold-150/80 bg-luxury-white/50">
                          <label className="text-[10px] uppercase tracking-widest text-gold-700 block font-bold">Novo Nome de Usuário (Opcional):</label>
                          <input
                            type="text"
                            placeholder="Digite o novo usuário"
                            value={accessNewUser}
                            onChange={(e) => setAccessNewUser(e.target.value)}
                            className="w-full text-xs p-2.5 bg-luxury-cream/35 border border-gold-100 text-luxury-black focus:outline-none focus:border-gold-300"
                          />
                          <p className="text-[9px] text-luxury-gray leading-tight">Se preenchido, altera o login padrão.</p>
                        </div>
                      </div>

                      {/* CURRENT PASSWORD AND SECURITY KEY FOR VALIDATING CHANGES */}
                      <div className="p-4 bg-gold-50/20 border-l-2 border-gold-300 space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-widest text-gold-700 block font-bold">Senha de Acesso Atual *</label>
                          <input
                            type="password"
                            required
                            placeholder="Valide sua identidade informando sua senha atual"
                            value={accessCurrentPass}
                            onChange={(e) => setAccessCurrentPass(e.target.value)}
                            className="w-full text-xs p-2.5 bg-luxury-white border border-gold-150 text-luxury-black focus:outline-none focus:border-gold-400"
                          />
                          <p className="text-[9px] text-gold-800 font-bold">Obrigatória para aplicar qualquer alteração.</p>
                        </div>
                      </div>

                      {/* ALTER PASSWORD COLLAPSE FORM BOX */}
                      <div className="border border-gold-150 p-4 space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-gold-100">
                          <div>
                            <strong className="text-xs text-luxury-black font-semibold font-serif uppercase tracking-wider block">Alterar Senha Administrativa</strong>
                            <span className="text-[9px] text-luxury-gray block">Marque para redefinir as credenciais de segurança</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                            className="px-3 py-1.5 border border-gold-200 text-[9px] uppercase font-sans tracking-widest text-gold-700 hover:bg-gold-50 cursor-pointer font-bold select-none"
                          >
                            {showPasswordFields ? "Ocultar Formulário" : "Definir Nova Senha"}
                          </button>
                        </div>

                        {showPasswordFields && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest text-gold-700 block font-semibold">Nova Senha de Acesso:</label>
                              <input
                                type="password"
                                placeholder="Digite a nova senha desejada"
                                value={accessNewPass}
                                onChange={(e) => setAccessNewPass(e.target.value)}
                                className="w-full text-xs p-2.5 bg-luxury-cream/10 border border-gold-100 text-luxury-black focus:outline-none focus:border-gold-300"
                              />
                              <p className="text-[9px] text-luxury-gray">Mínimo 6 caracteres, letras e números.</p>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-widest text-gold-700 block font-semibold">Confirmar Nova Senha:</label>
                              <input
                                type="password"
                                placeholder="Repita a nova senha desejada"
                                value={accessConfirmPass}
                                onChange={(e) => setAccessConfirmPass(e.target.value)}
                                className="w-full text-xs p-2.5 bg-luxury-cream/10 border border-gold-100 text-luxury-black focus:outline-none focus:border-gold-300"
                              />
                              <p className="text-[9px] text-luxury-gray">Precisará corresponder exatamente.</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SUBMIT ROW */}
                      <div className="pt-2 flex justify-end">
                        <button
                          type="submit"
                          className="px-8 py-3 bg-luxury-black hover:bg-gold-500 text-white uppercase text-[10px] font-sans font-bold tracking-widest transition-all cursor-pointer shadow-md select-none"
                        >
                          Salvar Credenciais
                        </button>
                      </div>

                    </form>

                  </div>

                  {/* CREDENTIAL SERVICE HISTORY */}
                  <div className="bg-luxury-white border border-gold-150 p-6 shadow-luxury">
                    <div className="border-b pb-2.5 border-gold-100 flex items-center gap-2">
                      <History className="w-4 h-4 text-gold-500 shrink-0" />
                      <h4 className="font-serif text-xs font-bold uppercase text-luxury-black">Histórico de Alterações</h4>
                    </div>

                    <div className="mt-4 space-y-3 max-h-[180px] overflow-y-auto pr-1">
                      {accessHistory && accessHistory.slice().reverse().map((log, i) => (
                        <div key={i} className="text-[11px] font-sans text-luxury-gray border-l-2 border-gold-200 pl-3 py-1 bg-luxury-cream/20">
                          <p className="text-luxury-black font-semibold">{log}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SYSTEM MAINTENANCE CLEANUP CARD */}
                  <div className="bg-luxury-white border border-red-200 p-6 shadow-luxury relative text-left">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />
                    
                    <div className="border-b pb-3 border-gold-100 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-sans text-[10px] uppercase text-red-600 tracking-wider font-semibold">Manutenção do Sistema</p>
                        <h4 className="font-serif text-sm font-semibold text-luxury-black">Limpeza da Base de Dados</h4>
                      </div>
                      <Database className="w-5 h-5 text-red-500 shrink-0" />
                    </div>

                    <div className="mt-4 space-y-2">
                      <p className="font-sans text-xs text-luxury-gray leading-relaxed">
                        Esta operação apagará instantaneamente todos os profissionais, todos os agendamentos, o catálogo completo de procedimentos e os logs de notificações.
                      </p>
                      <p className="font-sans text-xs text-red-700 font-bold bg-red-50/50 p-2.5 border-l-2 border-red-500">
                        O sistema ficará inteiramente limpo e vazio, aguardando novos cadastros reais dos clientes e administradores.
                      </p>
                    </div>

                    <div className="mt-5 flex justify-end">
                      <button
                        type="button"
                        onClick={handleClearDatabase}
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white uppercase text-[10px] font-sans font-bold tracking-widest transition-all cursor-pointer shadow-sm font-bold"
                      >
                        Limpar Base de Dados
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      </motion.div>

      {/* ----- REAGENDAR MODAL WINDOW ----- */}
      <AnimatePresence>
        {reschedulingBooking && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-luxury-black/50" onClick={() => setReschedulingBooking(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-luxury-white border border-gold-300 p-6 max-w-sm w-full shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                <h4 className="font-serif text-sm font-bold uppercase text-luxury-black">Reagendar Atendimento</h4>
                <button onClick={() => setReschedulingBooking(null)} className="p-1 hover:bg-gold-50 cursor-pointer">
                  <X className="w-4 h-4 text-luxury-gray" />
                </button>
              </div>

              <form onSubmit={handleSaveReschedule} className="space-y-4 mt-4">
                <p className="font-sans text-xs text-luxury-gray">
                  Reagendando consulta de <strong>{reschedulingBooking.clientName}</strong>. Nova data e hora do atendimento:
                </p>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-700">Selecione Nova Data *</label>
                  <input
                    type="date"
                    required
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-400 select-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-700">Selecione Novo Horário *</label>
                  <select
                    required
                    value={rescheduleTime}
                    onChange={(e) => setRescheduleTime(e.target.value)}
                    className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-400 rounded-none h-[38px]"
                  >
                    {AVAILABLE_HOURS.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setReschedulingBooking(null)}
                    className="px-4 py-2 border border-gold-100 uppercase text-[9px] font-sans tracking-widest text-[#555] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-luxury-black text-white uppercase text-[9px] font-sans font-bold tracking-widest hover:bg-gold-500 cursor-pointer"
                  >
                    Confirmar & Notificar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----- CANCELAMETO MOTIVE MODAL ----- */}
      <AnimatePresence>
        {cancellingBooking && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-luxury-black/50" onClick={() => setCancellingBooking(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-luxury-white border border-gold-300 p-6 max-w-sm w-full shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                <h4 className="font-serif text-sm font-bold uppercase text-red-700">Cancelar Agendamento</h4>
                <button onClick={() => setCancellingBooking(null)} className="p-1 hover:bg-gold-50 cursor-pointer">
                  <X className="w-4 h-4 text-luxury-gray" />
                </button>
              </div>

              <form onSubmit={handleSaveCancel} className="space-y-4 mt-4">
                <p className="font-sans text-xs text-luxury-gray">
                  Por favor, digite o motivo do cancelamento do agendamento de <strong>{cancellingBooking.clientName}</strong>:
                </p>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-700">Motivo do Cancelamento *</label>
                  <textarea
                    required
                    placeholder="Ex: Instabilidade de agenda, imprevisto de saúde do cliente..."
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full text-xs font-sans p-2.5 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-red-400 resize-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setCancellingBooking(null)}
                    className="px-4 py-2 border border-gold-100 uppercase text-[9px] font-sans tracking-widest text-[#555] cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-650 text-white uppercase text-[9px] font-sans font-bold tracking-widest hover:bg-red-750 cursor-pointer"
                  >
                    Confirmar Cancelamento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----- MANUAL MESSAGE SELECTOR MODAL ----- */}
      <AnimatePresence>
        {messagingBooking && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-luxury-black/50" onClick={() => setMessagingBooking(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-luxury-white border border-gold-300 p-6 max-w-md w-full shadow-2xl z-10"
            >
              <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                <h4 className="font-serif text-sm font-bold uppercase text-luxury-black">Enviar Canal WhatsApp</h4>
                <button onClick={() => setMessagingBooking(null)} className="p-1 hover:bg-gold-50 cursor-pointer">
                  <X className="w-4 h-4 text-luxury-gray" />
                </button>
              </div>

              <form onSubmit={handleTriggerManualSend} className="space-y-4 mt-4">
                <div className="p-3 bg-luxury-cream border border-gold-100 text-xs text-luxury-black font-sans">
                  <p><strong>Destinatário:</strong> {messagingBooking.clientName}</p>
                  <p className="mt-1"><strong>WhatsApp:</strong> {messagingBooking.clientPhone}</p>
                </div>

                <div className="space-y-1">
                  <label className="font-sans text-[10px] uppercase tracking-widest font-semibold text-gold-700">Selecione o Modelo de Mensagem</label>
                  <select
                    value={selectedMsgType}
                    onChange={(e) => setSelectedMsgType(e.target.value as any)}
                    className="w-full text-xs font-sans p-2.5 bg-white border border-gold-150 focus:outline-none focus:border-gold-300 rounded-none h-[40px]"
                  >
                    <option value="Lembrete">Lembrete de Consulta (24 horas antes) 📅</option>
                    <option value="Criação">Confirmação de Solicitação de Reserva (Recebida) ✨</option>
                    <option value="Confirmação">Confirmação de Agendamento Oficial ✅</option>
                    <option value="Reagendamento">Notificação do Reagendamento Realizado ✏️</option>
                    <option value="Cancelamento">Aviso de Cancelamento da Reserva ❌</option>
                    <option value="Conclusão">Agradecimento do Atendimento Concluído 🥇</option>
                  </select>
                </div>

                {/* Preview block of the chosen translation text */}
                <div className="space-y-1">
                  <span className="font-sans text-[9px] uppercase tracking-wider text-light-gray font-semibold block">Visualização do Conteúdo:</span>
                  <div className="bg-[#f2efe9]/45 border border-dashed border-gold-200 p-3.5 text-[11px] font-sans text-gray-700 whitespace-pre-wrap max-h-[160px] overflow-y-auto">
                    {getWhatsAppMessageText(
                      messagingBooking, 
                      selectedMsgType, 
                      selectedMsgType === 'Cancelamento' ? messagingBooking.cancelledReason : undefined
                    )}
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setMessagingBooking(null)}
                    className="px-4 py-2 border border-gold-100 uppercase text-[9px] font-sans tracking-widest text-[#555] cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-green-600 text-white uppercase text-[9px] font-sans font-bold tracking-widest hover:bg-green-700 flex items-center gap-1 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enviar Agora</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----- MANUAL BOOKING FORM MODAL WINDOW ----- */}
      <AnimatePresence>
        {isCreatingBooking && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-luxury-black/50" onClick={() => setIsCreatingBooking(false)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-luxury-white border border-gold-300 p-5 max-w-sm w-full shadow-2xl z-10 my-4"
            >
              <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                <div className="flex items-center gap-2">
                  <Plus className="w-4 h-4 text-gold-500" />
                  <h4 className="font-serif text-xs font-bold uppercase text-luxury-black">Novo Agendamento</h4>
                </div>
                <button onClick={() => setIsCreatingBooking(false)} className="p-1 hover:bg-gold-50 cursor-pointer">
                  <X className="w-4 h-4 text-luxury-gray" />
                </button>
              </div>

              <form onSubmit={handleSaveManualBooking} className="space-y-2 mt-3">
                {/* Client Name */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto de Alencar"
                    value={manualClientName}
                    onChange={(e) => setManualClientName(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 text-luxury-black"
                  />
                </div>

                {/* Client Phone */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 92991223344"
                    value={manualClientPhone}
                    onChange={(e) => setManualClientPhone(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 text-luxury-black"
                  />
                </div>

                {/* Procedure Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Procedimento *</label>
                  <select
                    required
                    value={manualProcedureId}
                    onChange={(e) => setManualProcedureId(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    <option value="" disabled>Selecione um procedimento...</option>
                    {procedures.filter(p => p.active).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Data *</label>
                  <input
                    type="date"
                    required
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 text-luxury-black"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Horário *</label>
                  <select
                    required
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    {AVAILABLE_HOURS.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                {/* Professional Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Profissional Preferencial</label>
                  <select
                    required
                    value={manualProfessional}
                    onChange={(e) => setManualProfessional(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    {professionals.filter(p => p.active).sort((a, b) => a.order - b.order).map(prof => (
                      <option key={prof.id} value={prof.name}>{prof.name}</option>
                    ))}
                  </select>
                </div>

                {/* Initial Status selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Status Inicial</label>
                  <select
                    required
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as any)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    <option value="Confirmado">Confirmado ✅</option>
                    <option value="Pendente">Pendente ⏳</option>
                    <option value="Concluído">Concluído 🥇</option>
                  </select>
                </div>

                {/* Observations Text Area (Espaço para observações!) */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Observações / Notas do Atendimento</label>
                  <textarea
                    placeholder="Ex: Cliente prefere água gelada, restrição a aromas florais, etc."
                    rows={2}
                    value={manualObservations}
                    onChange={(e) => setManualObservations(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-400 resize-none text-luxury-black"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreatingBooking(false)}
                    className="px-4 py-2 border border-gold-100 uppercase text-[9px] font-sans tracking-widest text-[#555] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-luxury-black text-white hover:bg-gold-500 uppercase text-[9px] font-sans font-bold tracking-widest transition-all cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----- EDIT BOOKING FORM MODAL WINDOW ----- */}
      <AnimatePresence>
        {editingBooking && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-luxury-black/50" onClick={() => setEditingBooking(null)} />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-luxury-white border border-gold-300 p-5 max-w-sm w-full shadow-2xl z-10 my-4"
            >
              <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                <div className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4 text-gold-500" />
                  <h4 className="font-serif text-xs font-bold uppercase text-luxury-black">Editar Agendamento</h4>
                </div>
                <button onClick={() => setEditingBooking(null)} className="p-1 hover:bg-gold-50 cursor-pointer">
                  <X className="w-4 h-4 text-luxury-gray" />
                </button>
              </div>

              <form onSubmit={handleSaveEditBooking} className="space-y-2 mt-3">
                {/* Client Name */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Nome do Cliente *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto de Alencar"
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 text-luxury-black"
                  />
                </div>

                {/* Client Phone */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: 92991223344"
                    value={editClientPhone}
                    onChange={(e) => setEditClientPhone(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 text-luxury-black"
                  />
                </div>

                {/* Procedure Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Procedimento *</label>
                  <select
                    required
                    value={editProcedureId}
                    onChange={(e) => setEditProcedureId(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    <option value="" disabled>Selecione um procedimento...</option>
                    {procedures.filter(p => p.active || p.id === editProcedureId).map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} - R$ {p.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Data *</label>
                  <input
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 text-luxury-black"
                  />
                </div>

                {/* Time Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Horário *</label>
                  <select
                    required
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    {AVAILABLE_HOURS.map(hour => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>

                {/* Professional Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Profissional Preferencial</label>
                  <select
                    required
                    value={editProfessional}
                    onChange={(e) => setEditProfessional(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    {professionals.sort((a, b) => a.order - b.order).map(prof => (
                      <option key={prof.id} value={prof.name}>{prof.name}</option>
                    ))}
                  </select>
                </div>

                {/* Status Selection */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Status</label>
                  <select
                    required
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as any)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-450 rounded-none h-[34px] text-luxury-black"
                  >
                    <option value="Confirmado">Confirmado ✅</option>
                    <option value="Pendente">Pendente ⏳</option>
                    <option value="Concluído">Concluído 🥇</option>
                    <option value="Cancelado">Cancelado ❌</option>
                  </select>
                </div>

                {/* Observations Text Area */}
                <div className="space-y-0.5">
                  <label className="font-sans text-[9px] uppercase tracking-widest font-semibold text-gold-700 block">Observações / Notas do Atendimento</label>
                  <textarea
                    placeholder="Ex: Cliente prefere água gelada, restrição a aromas florais, etc."
                    rows={2}
                    value={editObservations}
                    onChange={(e) => setEditObservations(e.target.value)}
                    className="w-full text-xs font-sans p-2 bg-luxury-cream border border-gold-100 focus:outline-none focus:border-gold-400 resize-none text-luxury-black"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingBooking(null)}
                    className="px-4 py-2 border border-gold-100 uppercase text-[9px] font-sans tracking-widest text-[#555] cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-luxury-black text-white hover:bg-gold-500 uppercase text-[9px] font-sans font-bold tracking-widest transition-all cursor-pointer"
                  >
                    Atualizar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ----- NOTIFICATION HISTORY MODAL WINDOW ----- */}
      <AnimatePresence>
        {viewingNotificationBooking && (() => {
          const b = bookings.find(item => item.id === viewingNotificationBooking.id) || viewingNotificationBooking;
          const logs = b.history || [];
          return (
            <div className="fixed inset-0 z-55 flex items-center justify-center p-4 overflow-y-auto">
              <div className="absolute inset-0 bg-luxury-black/60" onClick={() => setViewingNotificationBooking(null)} />
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="relative bg-luxury-white border border-gold-300 p-5 max-w-md w-full shadow-2xl z-10 my-4"
              >
                <div className="flex items-center justify-between border-b pb-2 border-gold-100">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gold-500" />
                    <h4 className="font-serif text-xs font-bold uppercase text-luxury-black">Histórico de Notificações</h4>
                  </div>
                  <button onClick={() => setViewingNotificationBooking(null)} className="p-1 hover:bg-gold-50 cursor-pointer">
                    <X className="w-4 h-4 text-luxury-gray" />
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {/* Client Mini-Profile */}
                  <div className="bg-luxury-cream p-3 border border-gold-100/60 text-xs">
                    <p className="font-serif font-bold text-luxury-black text-sm">{b.clientName}</p>
                    <p className="font-sans text-[11px] text-[#444] flex items-center gap-1.5 mt-1">
                      <Phone className="w-3 h-3 text-[#558253]" /> {b.clientPhone}
                    </p>
                    <p className="font-sans text-[11px] text-gray-500 mt-0.5">
                      <strong>Serviço:</strong> {b.procedureName} • {b.date} às {b.time}
                    </p>
                  </div>

                  {/* Logs Container */}
                  <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
                    {logs.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 italic font-sans text-xs">
                        Nenhuma mensagem automática ou manual foi registrada.
                      </div>
                    ) : (
                      logs.map((log) => (
                        <div key={log.id} className="p-2.5 border border-gold-100 bg-[#fbf9f6] space-y-1.5 rounded-sm">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-luxury-black flex items-center gap-1 bg-gold-50 px-1.5 py-0.5 border border-gold-150 rounded-xs">
                              {log.type}
                            </span>
                            <span className="text-gray-400 font-mono text-[9px]">{log.sentAt}</span>
                          </div>

                          {/* Raw text quote */}
                          <div className="bg-white/80 border border-stone-200 p-2 font-mono text-[9.5px] text-stone-700 whitespace-pre-wrap leading-tight shadow-xs select-all rounded-xs">
                            {log.content}
                          </div>

                          {/* Delivery status and quick actions */}
                          <div className="flex items-center justify-between pt-1 border-t border-dashed border-stone-200">
                            <div className="flex items-center gap-1">
                              {log.deliveryStatus === 'Pendente' && (
                                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded-xs">
                                  <Clock className="w-3 h-3 text-amber-500 animate-pulse" />
                                  <span>Pendente</span>
                                </div>
                              )}
                              {log.deliveryStatus === 'Enviado' && (
                                <div className="flex items-center gap-1.5 text-sky-600 font-bold text-[10px] bg-sky-50 px-1.5 py-0.5 rounded-xs">
                                  <Send className="w-3 h-3 text-sky-500" />
                                  <span>Enviado</span>
                                </div>
                              )}
                              {log.deliveryStatus === 'Falhou' && (
                                <div className="flex flex-col gap-0.5">
                                  <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] bg-rose-50 px-1.5 py-0.5 rounded-xs">
                                    <AlertCircle className="w-3 h-3 text-rose-500" />
                                    <span>Falhou</span>
                                  </div>
                                  {log.errorMessage && (
                                    <span className="text-[8px] text-rose-500 font-sans leading-tight mt-0.5 max-w-[160px]">{log.errorMessage}</span>
                                  )}
                                </div>
                              )}
                              {(log.deliveryStatus === 'Entregue' || !log.deliveryStatus) && (
                                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded-xs">
                                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                                  <span>Entregue</span>
                                </div>
                              )}
                            </div>

                            {/* Resend button */}
                            <button
                              onClick={() => handleManualResendNotification(b, log)}
                              className="px-2 py-1 text-[8.5px] font-sans font-bold bg-[#fbf9f6] text-gold-800 border border-gold-300 hover:bg-gold-50 active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1 uppercase tracking-wider rounded-xs"
                              title="Reenviar esta mesma mensagem via WhatsApp Web"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                              <span>Reenviar</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Manual On-Demand Testing Panel */}
                  <div className="border-t border-gold-155 pt-2.5 space-y-2">
                    <p className="font-sans text-[9px] uppercase tracking-wider font-bold text-luxury-black">Ações Manuais: Disparar Templates</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          const updated = dispatchWhatsAppNotification(b, 'Confirmação', undefined, true);
                          onUpdateBookings(bookings.map(item => item.id === b.id ? updated : item));
                        }}
                        className="px-1.5 py-1.5 font-sans font-bold text-[8px] uppercase bg-green-50 text-green-850 border border-green-200 hover:bg-green-100 cursor-pointer text-center text-ellipsis overflow-hidden"
                      >
                        Confirmação ✅
                      </button>
                      <button
                        onClick={() => {
                          const updated = dispatchWhatsAppNotification(b, 'Reagendamento', undefined, true);
                          onUpdateBookings(bookings.map(item => item.id === b.id ? updated : item));
                        }}
                        className="px-1.5 py-1.5 font-sans font-bold text-[8px] uppercase bg-green-50 text-green-850 border border-green-200 hover:bg-green-100 cursor-pointer text-center text-ellipsis overflow-hidden"
                      >
                        Reagendamento 📅
                      </button>
                      <button
                        onClick={() => {
                          const updated = dispatchWhatsAppNotification(b, 'Cancelamento', b.cancelledReason || 'Solicitado pelo cliente.', true);
                          onUpdateBookings(bookings.map(item => item.id === b.id ? updated : item));
                        }}
                        className="px-1.5 py-1.5 font-sans font-bold text-[8px] uppercase bg-green-50 text-green-850 border border-green-200 hover:bg-green-100 cursor-pointer text-center text-ellipsis overflow-hidden"
                      >
                        Cancelamento ❌
                      </button>
                      <button
                        onClick={() => {
                          const updated = dispatchWhatsAppNotification(b, 'Conclusão', undefined, true);
                          onUpdateBookings(bookings.map(item => item.id === b.id ? updated : item));
                        }}
                        className="px-1.5 py-1.5 font-sans font-bold text-[8px] uppercase bg-green-50 text-green-850 border border-green-200 hover:bg-green-100 cursor-pointer text-center text-ellipsis overflow-hidden"
                      >
                        Conclusão 🥇
                      </button>
                    </div>
                  </div>

                  <div className="pt-1.5 flex justify-end">
                    <button
                      onClick={() => setViewingNotificationBooking(null)}
                      className="px-4 py-2 bg-luxury-black text-white hover:bg-gold-500 uppercase text-[9px] font-sans tracking-widest font-bold cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

    </div>
  );
}
