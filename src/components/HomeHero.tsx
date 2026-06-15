/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Instagram, MessageCircle, Calendar } from 'lucide-react';

interface HomeHeroProps {
  onViewServices: () => void;
  onBookClick: () => void;
}

export default function HomeHero({ onViewServices, onBookClick }: HomeHeroProps) {
  const whatsappUrl = "https://wa.me/5595981036729";
  const instagramUrl = "https://instagram.com/drhugo.beauty";

  return (
    <section id="inicio" className="relative pt-32 pb-24 md:py-36 bg-luxury-cream overflow-hidden">
      {/* Editorial Decorative Grids */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute left-[8%] top-0 bottom-0 w-px bg-gold-200/50" />
        <div className="absolute right-[8%] top-0 bottom-0 w-px bg-gold-200/50" />
        <div className="absolute top-[25%] left-0 right-0 h-px bg-gold-200/50" />
        <div id="circulo-decorativo" className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] border border-gold-300/30 rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center relative z-10">
        
        {/* TEXT COLUMN */}
        <div className="lg:col-span-7 space-y-8 select-none">
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.1 }}
              className="font-serif text-4xl md:text-6xl text-luxury-black tracking-tight leading-[1.1]"
            >
              Hugo Sobral <br />
              <span className="text-gold-500 italic font-normal">Estética & Spa</span> <br />
              Executivo
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="max-w-xl font-sans text-sm md:text-base text-luxury-gray leading-relaxed font-light"
            >
              Excelência estética, bem-estar e exclusividade em uma experiência criada para elevar sua autoestima e realçar sua melhor versão.
            </motion.p>
          </div>

          {/* EDITORIAL CALLS TO ACTION */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="flex flex-wrap gap-4 items-center"
          >
            <button
              id="hero-services-btn"
              onClick={onViewServices}
              className="px-8 py-4 bg-luxury-black text-luxury-white text-[10px] font-sans tracking-[0.25em] uppercase border border-luxury-black hover:bg-gold-500 hover:border-gold-500 transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-sm font-semibold"
            >
              <span>Ver Serviços</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              id="hero-book-btn"
              onClick={onBookClick}
              className="px-8 py-4 bg-transparent text-luxury-black text-[10px] font-sans tracking-[0.25em] uppercase border border-gold-400 hover:border-luxury-black hover:bg-luxury-black hover:text-luxury-white transition-all duration-300 cursor-pointer font-semibold"
            >
              Agendar Atendimento
            </button>
          </motion.div>

          {/* SOCIAL LINKS ROW ON THE HERO */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.7 }}
            className="flex items-center gap-6 pt-4 border-t border-gold-100 max-w-sm"
          >
            <span className="font-sans text-[10px] uppercase tracking-widest text-gold-400">Redes Sociais:</span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-luxury-gray hover:text-green-600 transition-colors flex items-center gap-1.5 font-sans text-xs tracking-wider"
            >
              <MessageCircle className="w-4.5 h-4.5" />
              <span>WhatsApp</span>
            </a>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-luxury-gray hover:text-pink-600 transition-colors flex items-center gap-1.5 font-sans text-xs tracking-wider"
            >
              <Instagram className="w-4.5 h-4.5" />
              <span>Instagram</span>
            </a>
          </motion.div>
        </div>

        {/* IMAGE COVER COLUMN - HIGH FASHION LOOK */}
        <div className="lg:col-span-5 relative mt-8 lg:mt-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="relative"
          >
            {/* Elegant floating photo frames representing editorial spa layout */}
            <div className="relative aspect-3/4 w-full bg-gold-50 border border-gold-200 overflow-hidden shadow-luxury">
              <img
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"
                alt="Hugo Sobral Premium Spa"
                className="w-full h-full object-cover grayscale-25 contrast-105 hover:scale-105 transition-transform duration-1000"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-luxury-black/30 via-transparent to-transparent pointer-events-none" />
              {/* Elegant floating location card */}
              <div className="absolute bottom-6 left-6 right-6 bg-luxury-white/95 backdrop-blur-md p-5 border border-gold-100 shadow-sm flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-serif text-sm font-semibold text-luxury-black uppercase tracking-wide">Manaus, AM</p>
                  <p className="font-sans text-[9px] text-luxury-gray tracking-widest uppercase">Estética de Elite Nacional</p>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-gold-400 animate-pulse" />
              </div>
            </div>

            {/* Accent Absolute Floating Elements */}
            <div id="gold-accent-dot" className="absolute -top-4 -right-4 w-12 h-12 border-t border-r border-gold-400/80 pointer-events-none" />
            <div id="gold-accent-dot-2" className="absolute -bottom-4 -left-4 w-12 h-12 border-b border-l border-gold-400/80 pointer-events-none" />
          </motion.div>
        </div>
      </div>

      {/* HISTORIC VISION SECTION ("Sobre o Spa", "Missão", "Visão") */}
      <div className="bg-luxury-white border-y border-gold-100 mt-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-col-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 space-y-4">
            <span id="corporate-about-tag" className="font-sans text-[10px] uppercase tracking-[0.25em] text-gold-500 font-semibold block">
              Sobre o Spa Executivo
            </span>
            <h2 id="corporate-about-title" className="font-serif text-2xl md:text-3xl text-luxury-black tracking-tight font-medium">
              A Arte de Esculpir <br />e Revitalizar
            </h2>
            <div className="w-16 h-0.5 bg-gold-300" />
          </div>

          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3 bg-luxury-cream/55 p-6 border border-gold-100">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold-500 font-semibold block">
                Nossa Missão
              </span>
              <p className="font-sans text-sm text-luxury-gray leading-relaxed font-light">
                Elevar a autoestima de nossos clientes através de excelência em estética personalizada, aliando inovação científica com terapias sensoriais de luxo discreto.
              </p>
            </div>

            <div className="space-y-3 bg-luxury-cream/55 p-6 border border-gold-100">
              <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-gold-500 font-semibold block">
                Nossa Visão
              </span>
              <p className="font-sans text-sm text-luxury-gray leading-relaxed font-light">
                Ser o ecossistema de referência nacional em atendimento e tratamentos estéticos executivos de alta performance, prezando por exclusividade e personalização.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
