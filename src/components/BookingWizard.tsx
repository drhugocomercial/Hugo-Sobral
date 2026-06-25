/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar as CalendarIcon, Clock, Sparkles, Check, ChevronLeft, ChevronRight, User, Phone, Briefcase, FileText, CheckCircle2 } from 'lucide-react';
import { Procedure, Booking, Professional, BookingMessageLog } from '../types';
import { AVAILABLE_HOURS } from '../data';
import { getDirectGoogleDriveUrl } from '../utils';

interface BookingWizardProps {
  procedures: Procedure[];
  preselectedProcedure: Procedure | null;
  bookings: Booking[];
  onUpdateBookings: (newBookings: Booking[]) => void;
  professionals: Professional[];
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingWizard({ 
  procedures, 
  preselectedProcedure, 
  bookings, 
  onUpdateBookings, 
  professionals,
  isOpen, 
  onClose 
}: BookingWizardProps) {
  // Booking Form States
  const [selectedProcedures, setSelectedProcedures] = useState<Procedure[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedProfessional, setSelectedProfessional] = useState('');
  
  // Date & Time states
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5)); // June 2026 as per local metadata
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Success indicator
  const [isSuccess, setIsSuccess] = useState(false);

  // Sync inputs / presets
  useEffect(() => {
    console.log("BookingWizard: Syncing inputs. isOpen =", isOpen, "preselectedProcedure =", preselectedProcedure, "professionals =", professionals);
    if (isOpen) {
      setIsSuccess(false);
      setClientName('');
      setClientPhone('');
      setSelectedDate(null);
      setSelectedTime(null);
      
      // Auto select professional safely
      const safeProfs = Array.isArray(professionals) ? professionals : [];
      const activeProfs = safeProfs.filter(p => p && p.active).sort((a, b) => (a.order || 0) - (b.order || 0));
      setSelectedProfessional(activeProfs[0]?.name || '');

      // Handle preset
      if (preselectedProcedure) {
        setSelectedProcedures([preselectedProcedure]);
      } else {
        setSelectedProcedures([]);
      }
    }
  }, [isOpen, preselectedProcedure, professionals]);

  // Prevent scroll when wizard is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  console.log("BookingWizard: rendering active content. procedures =", procedures, "selectedProcedures =", selectedProcedures);

  const activeProcedures = (Array.isArray(procedures) ? procedures : []).filter(p => p && p.active);

  // Manage procedure selection
  const handleToggleProcedure = (proc: Procedure) => {
    setSelectedProcedures(prev => {
      const isSelected = prev.some(p => p.id === proc.id);
      if (isSelected) {
        return prev.filter(p => p.id !== proc.id);
      } else {
        return [...prev, proc];
      }
    });
  };

  // Generate calendar days
  const daysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const isPastDate = (date: Date) => {
    const today = new Date(2026, 5, 12); // Simulated system date
    const compareDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return compareDate < today;
  };

  const isToday = (date: Date) => {
    const today = new Date(2026, 5, 12);
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  };

  const formatDateString = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const totalInvestment = (selectedProcedures || []).reduce((acc, curr) => acc + (curr?.price || 0), 0);

  // Submit Handler
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProcedures.length === 0) {
      alert('Por favor, selecione pelo menos um procedimento.');
      return;
    }
    if (!clientName.trim() || !clientPhone.trim()) {
      alert('Por favor, preencha seu nome e celular WhatsApp.');
      return;
    }
    if (!selectedProfessional) {
      alert('Por favor, selecione o profissional de preferência.');
      return;
    }
    if (!selectedDate) {
      alert('Por favor, selecione a data do agendamento.');
      return;
    }
    if (!selectedTime) {
      alert('Por favor, selecione o horário do agendamento.');
      return;
    }

    const formattedDate = formatDateString(selectedDate);
    const newBookingId = `b-${Date.now()}`;
    const nowStr = new Date().toLocaleString('pt-BR');

    // Combine procedure details
    const procedureIdsConcat = selectedProcedures.map(p => p.id).join(', ');
    const procedureNamesConcat = selectedProcedures.map(p => p.name).join(', ');

    // Create a history logs record
    const creationLog: BookingMessageLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      sentAt: nowStr,
      type: 'Criação',
      status: 'Sucesso',
      content: `Agendamento inicial criado com status Pendente para o cliente ${clientName.trim()}.`,
      deliveryStatus: 'Entregue'
    };

    // Construct the standard Booking with status 'Pendente'
    const newBooking: Booking = {
      id: newBookingId,
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      procedureId: procedureIdsConcat,
      procedureName: procedureNamesConcat,
      date: formattedDate,
      time: selectedTime,
      professional: selectedProfessional,
      status: 'Pendente',
      createdAt: nowStr,
      history: [creationLog]
    };

    console.log("Agendamento salvo:", newBooking);

    // Save automatically to persistent array state via onUpdateBookings
    const updatedBookings = [newBooking, ...bookings];
    onUpdateBookings(updatedBookings);

    // Trigger state success block
    setIsSuccess(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-luxury-black/60 backdrop-blur-xs"
        />

        {/* WIZARD CARD */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 10 }}
          className="relative w-full max-w-4xl bg-luxury-white border border-gold-200/60 shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-gold-100 flex items-center justify-between bg-luxury-cream">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500 animate-pulse" />
              <span className="font-serif text-sm tracking-wider font-semibold text-luxury-black uppercase">
                Solicitação de Agendamento Online
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-2.5 text-luxury-gray hover:text-luxury-black transition-colors border border-gold-100 hover:bg-gold-50 cursor-pointer"
              aria-label="Minimizar agendamento"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="overflow-y-auto flex-1 bg-luxury-white relative p-6">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                /* SUCCESS SCREEN - INLINE SUCCESS MESSAGE AS REQUESTED */
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-6 max-w-lg mx-auto"
                >
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 shadow-md">
                    <CheckCircle2 className="w-14 h-14" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="font-serif text-xl font-bold text-luxury-black">Solicitação Recebida!</h3>
                    <p className="font-sans text-xs text-stone-600 leading-relaxed font-semibold">
                      "Seu agendamento foi recebido com sucesso e aguarda confirmação da clínica."
                    </p>
                  </div>

                  <div className="w-full bg-luxury-cream border border-gold-150 p-4.5 text-left text-xs divide-y divide-gold-100 font-sans space-y-1.5 rounded-none">
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500 font-medium">Cliente:</span>
                      <span className="text-luxury-black font-semibold">{clientName}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500 font-medium">Procedimento(s):</span>
                      <span className="text-luxury-black font-semibold truncate max-w-[200px]" title={selectedProcedures.map(p => p.name).join(', ')}>
                        {selectedProcedures.map(p => p.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500 font-medium">Profissional:</span>
                      <span className="text-luxury-black font-semibold">{selectedProfessional}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500 font-medium">Data e Horário:</span>
                      <span className="text-luxury-black font-semibold">
                        {selectedDate ? formatDateString(selectedDate) : ''} às {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 pt-2 font-serif font-bold text-sm text-gold-700">
                      <span>Total:</span>
                      <span>R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-stone-500 italic max-w-sm">
                    Não é necessária nenhuma ação adicional. Nossa equipe analisará e notificará você diretamente no seu WhatsApp informado.
                  </p>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-8 py-3 bg-luxury-black text-white hover:bg-gold-600 transition-all font-sans text-xs font-bold uppercase tracking-widest cursor-pointer border border-luxury-black hover:border-gold-600"
                  >
                    Concluir e Fechar
                  </button>
                </motion.div>
              ) : (
                /* TWO COLUMN BENTO AGENDAMENTO DESIGN */
                <form id="agendamento-form" onSubmit={handleBookingSubmit} className="space-y-6 text-left">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT COLUMN: PROCEDURES, CONTACT AND PROFESSIONAL */}
                    <div className="lg:col-span-6 space-y-5">
                      
                      {/* SECTION 1: PROCEDURES */}
                      <div className="bg-luxury-cream border border-gold-150 p-4.5 shadow-xs relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-400" />
                        <h4 className="font-serif text-xs font-bold uppercase text-luxury-black flex items-center gap-2 tracking-wider mb-3">
                          <span className="bg-gold-500 text-white text-[9px] font-sans w-4 h-4 rounded-full flex items-center justify-center">1</span>
                          <span>Ritual Estético desejado</span>
                        </h4>

                        <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
                          {activeProcedures.map((proc) => {
                            const isSelected = selectedProcedures.some(p => p.id === proc.id);
                            return (
                              <button
                                key={proc.id}
                                type="button"
                                onClick={() => handleToggleProcedure(proc)}
                                className={`w-full p-2.5 border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                                  isSelected
                                    ? 'border-gold-500 bg-gold-100/30'
                                    : 'border-gold-100 bg-white hover:border-gold-300'
                                }`}
                              >
                                <div className="space-y-0.5 pr-2 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`w-3.5 h-3.5 border flex items-center justify-center text-white shrink-0 rounded-xs transition-colors ${
                                      isSelected ? 'bg-gold-500 border-gold-500' : 'border-stone-300 bg-white'
                                    }`}>
                                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                                    </span>
                                    <p className="font-serif text-xs font-bold text-luxury-black leading-snug">
                                      {proc.name}
                                    </p>
                                  </div>
                                  <p className="font-sans text-[9px] text-luxury-gray leading-tight pl-5 truncate">
                                    {proc.category} • {proc.description.substring(0, 60)}...
                                  </p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-serif text-[11px] text-gold-600 font-bold block">
                                    R$ {proc.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                        
                        {selectedProcedures.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-gold-200/50 flex justify-between items-center text-xs">
                            <span className="font-sans text-[10px] uppercase text-stone-500 select-none">Selecionado {selectedProcedures.length} item(s):</span>
                            <span className="font-serif font-bold text-gold-700">R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        )}
                      </div>

                      {/* SECTION 2: CLIENT DATA */}
                      <div className="bg-luxury-cream border border-gold-150 p-4.5 shadow-xs relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-400" />
                        <h4 className="font-serif text-xs font-bold uppercase text-luxury-black flex items-center gap-2 tracking-wider mb-3">
                          <span className="bg-gold-500 text-white text-[9px] font-sans w-4 h-4 rounded-full flex items-center justify-center">2</span>
                          <span>Suas Informações</span>
                        </h4>

                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="font-sans text-[9px] uppercase tracking-widest text-gold-700 font-bold flex items-center gap-1 leading-none">
                              <User className="w-3 h-3 text-gold-500" />
                              <span>Seu Nome Completo *</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="Ex: Roberto de Alencar"
                              value={clientName}
                              onChange={(e) => setClientName(e.target.value)}
                              className="w-full text-xs font-sans p-2 bg-white border border-gold-150 focus:outline-none focus:border-gold-400 rounded-none h-[36px]"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="font-sans text-[9px] uppercase tracking-widest text-gold-700 font-bold flex items-center gap-1 leading-none">
                              <Phone className="w-3 h-3 text-gold-500" />
                              <span>WhatsApp para Notificações *</span>
                            </label>
                            <input
                              type="tel"
                              required
                              placeholder="Ex: 92991223344"
                              value={clientPhone}
                              onChange={(e) => setClientPhone(e.target.value)}
                              className="w-full text-xs font-sans p-2 bg-white border border-gold-150 focus:outline-none focus:border-gold-400 rounded-none h-[36px]"
                            />
                            <p className="font-sans text-[8px] text-stone-500 italic mt-0.5 leading-none">
                              Informe apenas números (com DDD). Você receberá o andamento da aprovação no WhatsApp.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* SECTION 3: PREFERRED PROFESSIONAL */}
                      <div className="bg-luxury-cream border border-gold-150 p-4.5 shadow-xs relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-400" />
                        <h4 className="font-serif text-xs font-bold uppercase text-luxury-black flex items-center gap-2 tracking-wider mb-2.5">
                          <span className="bg-gold-500 text-white text-[9px] font-sans w-4 h-4 rounded-full flex items-center justify-center">3</span>
                          <span>Escolha o Profissional</span>
                        </h4>

                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                           {(!Array.isArray(professionals) || professionals.filter(p => p && p.active).length === 0) ? (
                             <p className="font-sans text-xs text-luxury-gray italic py-4 col-span-2 text-center select-none">
                               Nenhum profissional cadastrado.
                             </p>
                           ) : (
                             professionals.filter(p => p && p.active).sort((a, b) => (a.order || 0) - (b.order || 0)).map((prof) => {
                               const isSelected = selectedProfessional === prof.name;
                               return (
                                 <button
                                   key={prof.id}
                                   type="button"
                                   onClick={() => setSelectedProfessional(prof.name)}
                                   className={`p-2 border text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
                                     isSelected
                                       ? 'bg-luxury-black text-white border-luxury-black shadow-sm'
                                       : 'bg-white text-luxury-black border-gold-150 hover:bg-gold-50/20'
                                   }`}
                                 >
                                   <div className="flex items-center gap-2 max-w-[85%]">
                                     <div className="w-7 h-7 rounded-full bg-stone-100 border border-gold-200 overflow-hidden shrink-0 flex items-center justify-center">
                                       {prof.imageUrl ? (
                                         <img 
                                           src={getDirectGoogleDriveUrl(prof.imageUrl)} 
                                           alt={prof.name} 
                                           className="w-full h-full object-cover" 
                                           referrerPolicy="no-referrer"
                                         />
                                       ) : (
                                         <User className="w-4 h-4 text-gold-400" />
                                       )}
                                     </div>
                                     <div className="overflow-hidden">
                                       <p className="font-sans text-[11px] font-bold leading-tight truncate">{prof.name}</p>
                                       <p className={`font-sans text-[8px] tracking-wide uppercase leading-none mt-0.5 truncate ${isSelected ? 'text-gold-200' : 'text-gold-600'}`}>
                                         {prof.role}
                                       </p>
                                     </div>
                                   </div>
                                   {isSelected && <Check className="w-3 h-3 text-gold-400 shrink-0" />}
                                 </button>
                               );
                             })
                           )}
                         </div>
                      </div>

                    </div>

                    {/* RIGHT COLUMN: DATA E HORARIO */}
                    <div className="lg:col-span-6 space-y-5">
                      
                      {/* SECTION 4: DATE & HOURS PICKERS */}
                      <div className="bg-luxury-cream border border-gold-150 p-4.5 shadow-xs relative">
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gold-400" />
                        
                        <div className="flex items-center justify-between border-b border-gold-150 pb-2 mb-3">
                          <h4 className="font-serif text-xs font-bold uppercase text-luxury-black flex items-center gap-2 tracking-wider">
                            <span className="bg-gold-500 text-white text-[9px] font-sans w-4 h-4 rounded-full flex items-center justify-center">4</span>
                            <span>Escolha Data e Horário</span>
                          </h4>
                          
                          {/* Calendar Controls */}
                          <div className="flex items-center gap-1 shrink-0 select-none">
                            <button
                              type="button"
                              onClick={prevMonth}
                              className="p-1 border border-gold-150 hover:bg-gold-50 text-luxury-black cursor-pointer bg-white"
                              title="Mês Anterior"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <span className="font-serif text-[10px] font-bold uppercase text-gold-700 tracking-wider w-[80px] text-center shrink-0">
                              {currentMonth.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                            </span>
                            <button
                              type="button"
                              onClick={nextMonth}
                              className="p-1 border border-gold-150 hover:bg-gold-50 text-luxury-black cursor-pointer bg-white"
                              title="Próximo Mês"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Beautiful Calendar Matrix */}
                        <div className="bg-white border border-gold-100 p-2.5">
                          <div className="grid grid-cols-7 gap-1 text-center font-sans text-[8px] uppercase font-bold text-luxury-black tracking-widest pb-1 border-b border-gold-100/50">
                            <div>Dom</div>
                            <div>Seg</div>
                            <div>Ter</div>
                            <div>Qua</div>
                            <div>Qui</div>
                            <div>Sex</div>
                            <div>Sáb</div>
                          </div>

                          <div className="grid grid-cols-7 gap-1 mt-1.5 font-sans">
                            {daysInMonth().map((day, idx) => {
                              if (!day) return <div key={`empty-${idx}`} />;
                              
                              const past = isPastDate(day);
                              const currentSelected = selectedDate && 
                                day.getDate() === selectedDate.getDate() &&
                                day.getMonth() === selectedDate.getMonth() &&
                                day.getFullYear() === selectedDate.getFullYear();
                              
                              const systemToday = isToday(day);

                              return (
                                <button
                                  key={day.toISOString()}
                                  type="button"
                                  disabled={past}
                                  onClick={() => setSelectedDate(day)}
                                  className={`aspect-square w-full rounded-none flex flex-col items-center justify-center text-[10.5px] transition-all relative ${
                                    past
                                      ? 'text-gray-300 cursor-not-allowed bg-transparent'
                                      : currentSelected
                                      ? 'bg-luxury-black text-white font-semibold'
                                      : 'text-stone-850 hover:bg-gold-100/40 hover:text-luxury-black border border-transparent cursor-pointer bg-stone-50'
                                  }`}
                                >
                                  <span>{day.getDate()}</span>
                                  {systemToday && !currentSelected && (
                                    <span className="absolute bottom-0.5 w-1 h-1 bg-gold-400 rounded-full" />
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Selected Date indicator */}
                        {selectedDate && (
                          <p className="font-sans text-[10px] text-stone-700 font-medium mt-2">
                            Dia Escolhido: <strong className="text-gold-700">{formatDateString(selectedDate)}</strong>
                          </p>
                        )}

                        {/* Hour Slots Selector */}
                        <div className="mt-3.5">
                          <label className="font-sans text-[9px] uppercase tracking-widest text-gold-700 font-bold block mb-1">
                            Disponibilidade de Horários
                          </label>
                          
                          <div className="grid grid-cols-4 gap-1.5">
                            {AVAILABLE_HOURS.map((hour) => {
                              const isSelected = selectedTime === hour;
                              return (
                                <button
                                  key={hour}
                                  type="button"
                                  onClick={() => setSelectedTime(hour)}
                                  className={`py-1.5 border font-sans text-[10.5px] tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1 focus:outline-none ${
                                    isSelected
                                      ? 'bg-luxury-black text-luxury-white border-luxury-black font-semibold'
                                      : 'border-gold-150 text-luxury-black bg-white hover:border-gold-300'
                                  }`}
                                >
                                  <Clock className={`w-3 h-3 ${isSelected ? 'text-gold-200' : 'text-gold-400'}`} />
                                  <span>{hour}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* SUMMARY BLOCK IN FORM */}
                      <div className="bg-stone-50 border border-gold-150 p-4 relative">
                        <div className="flex justify-between items-center text-xs pb-2 border-b border-gold-200/40">
                          <span className="font-sans text-stone-500 font-semibold uppercase text-[9px] tracking-wider">Procedimentos:</span>
                          <span className="font-sans font-bold text-luxury-black truncate max-w-[200px]" title={selectedProcedures.map(p => p.name).join(', ') || 'Nenhum'}>
                            {selectedProcedures.length > 0 ? selectedProcedures.map(p => p.name).join(', ') : 'Nenhum ritual selecionado'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-1.5 border-b border-gold-200/40">
                          <span className="font-sans text-stone-500 font-semibold uppercase text-[9px] tracking-wider">Profissional:</span>
                          <span className="font-sans font-bold text-luxury-black">
                            {selectedProfessional || 'Nenhum'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs py-1.5">
                          <span className="font-sans text-stone-500 font-semibold uppercase text-[9px] tracking-wider">Data/Horário:</span>
                          <span className="font-sans font-bold text-luxury-black">
                            {selectedDate ? formatDateString(selectedDate) : '--/--/----'} às {selectedTime || '--:--'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center font-serif text-sm font-bold text-gold-700 pt-2 border-t border-gold-250/30">
                          <span className="text-stone-700">VALOR DO INVESTIMENTO:</span>
                          <span>R$ {totalInvestment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Submission triggers */}
                  <div className="border-t border-gold-100/50 pt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-stone-600 hover:text-luxury-black transition-colors font-sans text-[10px] uppercase font-bold tracking-widest"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={
                        selectedProcedures.length === 0 ||
                        !clientName.trim() ||
                        !clientPhone.trim() ||
                        !selectedProfessional ||
                        !selectedDate ||
                        !selectedTime
                      }
                      className="px-8 py-3 bg-luxury-black text-white hover:bg-gold-500 font-sans text-[10px] font-bold tracking-widest uppercase transition-all select-none disabled:opacity-35 disabled:hover:bg-luxury-black disabled:cursor-not-allowed cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 justify-center">
                        <Check className="w-4 h-4 text-gold-300" />
                        <span>Confirmar Agendamento</span>
                      </div>
                    </button>
                  </div>

                </form>
              )}
            </AnimatePresence>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
