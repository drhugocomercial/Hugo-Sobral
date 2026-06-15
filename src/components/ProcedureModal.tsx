/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageSquare, Calendar, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Procedure } from '../types';

interface ProcedureModalProps {
  procedure: Procedure | null;
  onClose: () => void;
  onBook: (procedure: Procedure) => void;
}

export default function ProcedureModal({ procedure, onClose, onBook }: ProcedureModalProps) {
  // Prevent system body scroll when modal is open
  useEffect(() => {
    if (procedure) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [procedure]);

  if (!procedure) return null;

  // Generates the specific inquiry WhatsApp prefilled link
  const getWhatsAppInquiryUrl = (procName: string) => {
    const text = `Olá Dr. Hugo!\n\nTenho interesse em saber mais sobre o procedimento:\n\n*${procName.toUpperCase()}*\n\nPoderia me passar mais informações?`;
    return `https://wa.me/5595981036729?text=${encodeURIComponent(text)}`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
        {/* BACKDROP */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-luxury-black/60 backdrop-blur-sm"
        />

        {/* MODAL CONTENT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl bg-luxury-white border border-gold-200/60 shadow-2xl overflow-hidden z-10 flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close button inside modal frame */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2.5 bg-luxury-white/90 backdrop-blur-md rounded-full text-luxury-black hover:text-gold-500 border border-gold-100 transition-colors focus:outline-none"
            aria-label="Minimizar detalhes"
          >
            <X className="w-5 h-5" />
          </button>

          {/* LEFT: IMAGE COLUMN with premium cover look */}
          <div className="w-full md:w-1/2 relative bg-gold-50 min-h-[250px] md:min-h-full">
            <img
              src={procedure.imageUrl}
              alt={procedure.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-luxury-black/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Visual branding stamp */}
            <div className="absolute bottom-6 left-6 text-luxury-white hidden md:block select-none">
              <span className="font-sans text-[8px] uppercase tracking-[0.3em] font-semibold text-gold-200">
                HUGO SOBRAL • SPA EXECUTIVO
              </span>
              <p className="font-serif text-lg italic mt-1 text-gold-100">
                A excelência de se cuidar.
              </p>
            </div>
          </div>

          {/* RIGHT: TEXT DETAIL COLUMN */}
          <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              {/* Category Tag */}
              <div className="flex items-center gap-2">
                <span className="h-px w-4 bg-gold-400" />
                <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-gold-500 font-semibold">
                  {procedure.category}
                </span>
              </div>

              {/* Procedure Title */}
              <h3 className="font-serif text-2xl md:text-3xl text-luxury-black font-semibold tracking-tight leading-tight">
                {procedure.name}
              </h3>

              {/* Price display with beautiful visual box */}
              <div className="bg-gold-50/50 border-l-2 border-gold-400 p-4 flex items-center justify-between">
                <div>
                  <span className="font-sans text-[9px] uppercase tracking-wider text-gold-600 block">
                    Valor de Investimento
                  </span>
                  <span className="font-serif text-2xl font-bold text-luxury-black">
                    R$ {procedure.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="bg-luxury-black text-luxury-white rounded-full p-2">
                  <ShieldCheck className="w-5 h-5 text-gold-200" />
                </div>
              </div>

              {/* Rich description */}
              <div className="space-y-2">
                <span className="font-sans text-[10px] uppercase tracking-wider text-luxury-gray/95 font-semibold block">
                  Descrição detalhada:
                </span>
                <p className="font-sans text-xs md:text-sm text-luxury-gray leading-relaxed font-light">
                  {procedure.description}
                </p>
              </div>

              {/* Indications box */}
              <div className="space-y-2 bg-luxury-cream p-4 border border-gold-100">
                <span className="font-sans text-[10px] uppercase tracking-widest text-gold-600 font-semibold block flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Indicação e Benefícios
                </span>
                <p className="font-sans text-xs text-luxury-black/90 leading-relaxed font-light italic">
                  "{procedure.indication}"
                </p>
              </div>
            </div>

            {/* Direct execution actions */}
            <div className="space-y-3 pt-8 mt-8 border-t border-gold-100 flex flex-col sm:flex-row gap-3">
              <a
                href={getWhatsAppInquiryUrl(procedure.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-5 py-3.5 bg-neutral-100 text-luxury-black text-[11px] font-sans tracking-widest uppercase hover:bg-neutral-200 transition-all text-center flex items-center justify-center gap-2 border border-transparent font-medium"
              >
                <MessageSquare className="w-4 h-4 text-green-600" />
                <span>Quero Saber Mais</span>
              </a>

              <button
                onClick={() => {
                  onClose();
                  onBook(procedure);
                }}
                className="flex-grow-[1.5] px-5 py-3.5 bg-luxury-black text-luxury-white text-[11px] font-sans tracking-widest uppercase hover:bg-gold-500 hover:text-luxury-white hover:border-gold-500 transition-all text-center flex items-center justify-center gap-2 border border-luxury-black font-semibold cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-gold-200" />
                <span>Agendar Avaliação</span>
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
