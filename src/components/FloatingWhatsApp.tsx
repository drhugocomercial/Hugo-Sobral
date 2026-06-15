/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp() {
  const whatsappUrl = "https://wa.me/5595981036729?text=Ol%C3%A1%20Dr.%20Hugo!%20Gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20os%20procedimentos%20est%C3%A9ticos.";

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 bg-luxury-white text-gold-500 border border-gold-300 hover:bg-luxury-black hover:text-luxury-white hover:border-luxury-black active:scale-95 transition-all flex items-center justify-center shadow-xl relative rounded-none group"
        aria-label="Falar com Dr. Hugo Sobral no WhatsApp"
      >
        <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
        
        {/* Soft elegant tooltip */}
        <span className="absolute right-16 bg-luxury-white text-luxury-black font-sans text-[10px] uppercase font-semibold tracking-widest px-3 py-1.5 border border-gold-200 shadow-sm opacity-0 scale-95 origin-right group-hover:opacity-100 group-hover:scale-100 transition-all pointer-events-none min-w-max">
          Fale Conosco
        </span>
      </a>
    </div>
  );
}
