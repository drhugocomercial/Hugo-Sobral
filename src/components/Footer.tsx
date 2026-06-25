/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, MessageCircle, MapPin, Compass, ShieldCheck, Clock } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
  onBookClick: () => void;
  onCategorySelect?: (category: string) => void;
}

export default function Footer({ onAdminClick, onBookClick, onCategorySelect }: FooterProps) {
  const currentYear = 2026; // Match system date metadata

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    if (onCategorySelect) {
      if (href === '#experiencias-faciais') {
        onCategorySelect('EXPERIÊNCIAS FACIAIS');
        return;
      }
      if (href === '#cuidados-corporais') {
        onCategorySelect('CUIDADOS CORPORAIS');
        return;
      }
      if (href === '#tratamentos') {
        onCategorySelect('PROCEDIMENTOS DE TRATAMENTO');
        return;
      }
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer id="contato" className="bg-luxury-black text-luxury-white pt-20 pb-12 border-t border-gold-900/30 relative select-none">
      {/* Decorative Golden Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 pb-16 border-b border-luxury-charcoal/80">
        
        {/* COLUMN 1: BRAND LOGO & INTRO */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative w-36 h-10 flex items-center justify-center bg-transparent overflow-hidden p-0.5">
              <img
                src="https://lh3.googleusercontent.com/d/1dlxQqVFJxJF9Cc5K9qXv2ViEseP-zI7C"
                alt="Hugo Sobral Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <p className="font-sans text-[11px] text-gray-400/80 leading-relaxed font-light">
            Um refúgio de sofisticação e relaxamento integrado em Manaus. Concedemos privacidade, comodidade e excelentes protocolos estéticos para executivos e profissionais exigentes.
          </p>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-gray-400">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="leading-tight">Manaus, Amazonas - AM <br /><span className="text-[10px] text-gray-500 font-light">Atendimento clínico reservado</span></span>
            </div>
          </div>
        </div>

        {/* COLUMN 2: PREMIUM QUICK LINKS */}
        <div className="md:col-span-4 space-y-5">
          <h4 className="font-serif text-xs font-semibold tracking-widest text-gold-400 uppercase">
            Menu Rápido
          </h4>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <li>
              <a
                href="#inicio"
                onClick={(e) => handleNavClick(e, '#inicio')}
                className="font-sans text-xs text-gray-450 hover:text-gold-300 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-gold-500/60" />
                <span>Início</span>
              </a>
            </li>
            <li>
              <a
                href="#experiencias-faciais"
                onClick={(e) => handleNavClick(e, '#experiencias-faciais')}
                className="font-sans text-xs text-gray-450 hover:text-gold-300 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-gold-500/60" />
                <span>Exp. Faciais</span>
              </a>
            </li>
            <li>
              <a
                href="#cuidados-corporais"
                onClick={(e) => handleNavClick(e, '#cuidados-corporais')}
                className="font-sans text-xs text-gray-450 hover:text-gold-300 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-gold-500/60" />
                <span>Cuid. Corporais</span>
              </a>
            </li>
            <li>
              <a
                href="#tratamentos"
                onClick={(e) => handleNavClick(e, '#tratamentos')}
                className="font-sans text-xs text-gray-450 hover:text-gold-300 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-gold-500/60" />
                <span>Proced. de Tratamento</span>
              </a>
            </li>
            <li>
              <a
                href="#contato"
                onClick={(e) => handleNavClick(e, '#contato')}
                className="font-sans text-xs text-gray-450 hover:text-gold-300 transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5 text-gold-500/60" />
                <span>Contato</span>
              </a>
            </li>
            <li>
              <button
                onClick={onBookClick}
                className="font-sans text-xs text-gray-450 hover:text-gold-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left focus:outline-none"
              >
                <Compass className="w-3.5 h-3.5 text-gold-500/60" />
                <span>Agendar Atendimento</span>
              </button>
            </li>
          </ul>
        </div>

        {/* COLUMN 3: CONTACT CHANNELS */}
        <div className="md:col-span-4 space-y-5">
          <h4 className="font-serif text-xs font-semibold tracking-widest text-gold-400 uppercase">
            Canais de Atendimento
          </h4>
          
          <div className="space-y-3.5">
            <a
              href="https://wa.me/5595981036729"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-luxury-charcoal/50 border border-gold-900/25 rounded-none hover:border-gold-500/40 transition-colors group"
            >
              <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="font-sans text-[8px] text-gray-500 uppercase tracking-widest block leading-none">WhatsApp Oficial</span>
                <span className="font-sans text-xs text-gray-300 font-semibold group-hover:text-gold-200">+55 95 98103-6729</span>
              </div>
            </a>

            <a
              href="https://instagram.com/drhugo.beauty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-luxury-charcoal/50 border border-gold-900/25 rounded-none hover:border-gold-500/40 transition-colors group"
            >
              <Instagram className="w-5 h-5 text-pink-400 shrink-0" />
              <div>
                <span className="font-sans text-[8px] text-gray-500 uppercase tracking-widest block leading-none">Instagram Oficial</span>
                <span className="font-sans text-xs text-gray-300 font-semibold group-hover:text-gold-200">@drhugo.beauty</span>
              </div>
            </a>
          </div>

          <div className="text-right">
            <button
              onClick={onAdminClick}
              className="text-[9px] font-sans tracking-[0.2em] text-gold-500 hover:text-luxury-white uppercase transition-colors"
            >
              Área Administrativa • Lock Screen
            </button>
          </div>
        </div>

      </div>

      {/* COPYRIGHT STAMP */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-sans text-gray-500 tracking-wider">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
          <span>© {currentYear} HUGO SOBRAL ESTÉTICA & SPA EXECUTIVO. Todos os direitos reservados.</span>
        </div>
        <div className="flex gap-4">
          <span>Manaus/AM</span>
          <span>•</span>
          <span>Premium Digital Experience</span>
        </div>
      </div>
    </footer>
  );
}
