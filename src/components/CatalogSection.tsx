/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, Sparkles, Filter, Info, ChevronRight, HelpCircle } from 'lucide-react';
import { Procedure } from '../types';
import { getDirectGoogleDriveUrl } from '../utils';

type CategoryFilter = string;

interface CatalogSectionProps {
  procedures: Procedure[];
  onSelectProcedure: (procedure: Procedure) => void;
  onBookProcedure: (procedure: Procedure) => void;
  selectedCategory: CategoryFilter;
  setSelectedCategory: (category: CategoryFilter) => void;
}

export default function CatalogSection({
  procedures,
  onSelectProcedure,
  onBookProcedure,
  selectedCategory,
  setSelectedCategory,
}: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = useMemo(() => {
    // Get unique categories from active procedures
    const uniqueCats = Array.from(
      new Set(
        procedures
          .filter((p) => p.active)
          .map((p) => p.category)
      )
    ).filter(Boolean);

    const baseCategories = [
      { label: 'Exibir Todos', value: 'ALL', desc: 'A coleção completa de rituais de bem-estar.' },
    ];

    // Map unique categories to dynamic menu items with descriptions
    const dynamicCategories = uniqueCats.map((cat) => {
      let desc = 'Serviços personalizados de alta gama para o seu bem-estar.';
      if (cat === 'EXPERIÊNCIAS FACIAIS') {
        desc = 'Revitalização cutânea, hidratação profunda e assepsia fotônica.';
      } else if (cat === 'CUIDADOS CORPORAIS') {
        desc = 'Rituais manuais e liberação para reestabelecer o bem-estar físico.';
      } else if (cat === 'PROCEDIMENTOS DE TRATAMENTO') {
        desc = 'Protocolos de renovação intensiva por peeling ecológico ou dermo-indução.';
      }

      let label = cat;
      if (cat === 'EXPERIÊNCIAS FACIAIS') label = 'Experiências Faciais';
      else if (cat === 'CUIDADOS CORPORAIS') label = 'Cuidados Corporais';
      else if (cat === 'PROCEDIMENTOS DE TRATAMENTO') label = 'Procedimentos de Tratamento';
      else {
        // Beautify any user category (e.g. UPPERCASE to Capital Case)
        label = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
      }

      return {
        label,
        value: cat,
        desc,
      };
    });

    return [...baseCategories, ...dynamicCategories];
  }, [procedures]);

  // Filters procedures by search query, selected category, and active status
  const filteredProcedures = useMemo(() => {
    return procedures.filter((proc) => {
      if (!proc.active) return false;
      
      const matchesSearch =
        proc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proc.indication.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'ALL' || proc.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [procedures, searchQuery, selectedCategory]);

  return (
    <section id="catalogo" className="py-24 bg-luxury-white relative transition-all">
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute left-[15%] top-0 bottom-0 w-px bg-luxury-black" />
        <div className="absolute right-[15%] top-0 bottom-0 w-px bg-luxury-black" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* SECTION HEADER AND INTRODUCTION */}
        <div className="text-center space-y-6 max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 justify-center">
            <span className="w-2.5 h-px bg-gold-400" />
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500 font-semibold">
              Rituais e Cuidados de Alta Gama
            </span>
            <span className="w-2.5 h-px bg-gold-400" />
          </div>
          <h2 className="font-serif text-3xl md:text-5xl text-luxury-black tracking-tight leading-tight">
            Nossos Serviços <br />e <span className="italic font-normal text-gold-500">Experiências Estéticas</span>
          </h2>
          <p className="font-sans text-sm text-luxury-gray font-light max-w-2xl mx-auto leading-relaxed">
            Selecione uma categoria específica ou use nossa busca em tempo real para encontrar os tratamentos mais adequados ao seu perfil e às suas necessidades de hoje.
          </p>
        </div>

        {/* SEARCH AND FILTER INTERFACE (The Premium Look) */}
        <div className="bg-luxury-cream border border-gold-100 p-6 md:p-8 mb-16 shadow-luxury max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
            {/* SEARCH BOX */}
            <div className="w-full lg:w-72 relative group flex items-center justify-between pb-1.5 bg-transparent border-b border-luxury-black transition-colors focus-within:border-gold-500 shrink-0">
              <input
                id="catalog-search-input"
                type="text"
                placeholder="Buscar procedimento..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none text-xs font-sans text-luxury-black placeholder-luxury-gray/55 focus:outline-none tracking-wider py-1.5"
              />
              <Search className="w-4 h-4 text-luxury-black group-hover:text-gold-400 transition-colors shrink-0" />
            </div>

            {/* CATEGORY SELECTOR */}
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center lg:justify-end gap-2.5 w-full">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        setSelectedCategory(cat.value);
                        // Clear search query to show all items under that category by default
                        setSearchQuery('');
                      }}
                      className={`px-3.5 py-1.5 text-[11px] font-sans tracking-widest uppercase transition-all duration-300 select-none cursor-pointer text-center ring-offset-luxury-cream focus:outline-none focus:ring-1 focus:ring-gold-400 ${
                        isSelected
                          ? 'bg-luxury-black text-luxury-white border border-luxury-black font-semibold shadow-sm'
                          : 'bg-white text-luxury-gray border border-gold-200/60 hover:text-luxury-black hover:border-gold-400 hover:bg-gold-50/20 font-semibold'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Description of active filter */}
          <div className="mt-6 pt-4 border-t border-gold-100/40 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 select-none text-[11px]">
            <div className="flex items-center gap-1.5 shrink-0">
              <Filter className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span className="font-sans text-[10px] text-gold-500 uppercase tracking-widest font-semibold">
                Filtrado por:
              </span>
              <span className="font-sans text-luxury-black font-bold uppercase tracking-wider">
                {categories.find((c) => c.value === selectedCategory)?.label}
              </span>
            </div>
            {categories.find((c) => c.value === selectedCategory)?.desc && (
              <>
                <span className="hidden sm:inline text-gold-300 text-xs">•</span>
                <span className="font-sans text-luxury-gray italic leading-normal">
                  {categories.find((c) => c.value === selectedCategory)?.desc}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Categorized Procedures Grid */}
        <div className="min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {procedures.length === 0 ? (
              <div className="text-center py-20 bg-luxury-cream border border-gold-100 max-w-lg mx-auto">
                <Sparkles className="w-12 h-12 text-gold-300 mx-auto mb-4 animate-pulse" />
                <h3 className="font-serif text-lg text-luxury-black font-semibold mb-2">Nenhum procedimento cadastrado</h3>
                <p className="font-sans text-xs text-luxury-gray max-w-sm mx-auto leading-relaxed">
                  Nossos rituais estéticos exclusivos estão sendo planejados pela nossa equipe. Em breve você poderá agendar tratamentos extraordinários diretamente por aqui.
                </p>
              </div>
            ) : filteredProcedures.length > 0 ? (
              <motion.div
                layout
                id="catalog-items-grid"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              >
                {filteredProcedures.map((proc) => (
                  <motion.div
                    layout
                    key={proc.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-luxury-cream/40 border border-gold-100 p-6 shadow-luxury hover:shadow-luxury-hover hover:border-gold-400 hover:bg-luxury-white transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Visual Card Top */}
                    <div className="space-y-4">
                      {/* Image Frame with Overlay */}
                      <div className="relative aspect-16/10 bg-gold-50 overflow-hidden border border-gold-100">
                        <img
                          src={getDirectGoogleDriveUrl(proc.imageUrl)}
                          alt={proc.name}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Elegant floating price badge */}
                        <div className="absolute top-3.5 right-3.5 bg-luxury-white/95 backdrop-blur-md px-3.5 py-1.5 border border-gold-200 font-serif text-xs font-semibold text-gold-500 italic tracking-wide">
                          R$ {proc.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                        {/* Quick category identifier */}
                        <div className="absolute bottom-3 left-3.5 bg-luxury-black/75 px-2 py-0.5 font-sans text-[8px] font-semibold text-luxury-white uppercase tracking-widest">
                          {proc.category === 'EXPERIÊNCIAS FACIAIS' ? 'FACIAL' : proc.category === 'CUIDADOS CORPORAIS' ? 'CORPORAL' : proc.category === 'PROCEDIMENTOS DE TRATAMENTO' ? 'TRATAMENTO' : proc.category.split(' ')[0]}
                        </div>
                      </div>

                      {/* Info & Content */}
                      <div className="space-y-2">
                        <div className="flex items-start justify-between min-h-[48px]">
                          <h3 className="font-serif text-lg font-medium text-luxury-black group-hover:text-gold-500 transition-colors line-clamp-2 leading-tight">
                            {proc.name}
                          </h3>
                        </div>
                        
                        <p className="font-sans text-xs text-luxury-gray/95 font-light leading-relaxed line-clamp-3 min-h-[54px]">
                          {proc.description}
                        </p>

                        <div className="pt-2 border-t border-gold-100/50 flex items-start gap-1.5 min-h-[44px]">
                          <Info className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />
                          <p className="font-sans text-[10px] text-gold-600 leading-normal line-clamp-2 italic">
                            <span className="font-sans uppercase font-bold text-[9px] tracking-wider not-italic mr-1 text-gold-700">Indicação:</span>
                            {proc.indication}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex items-center gap-3 pt-5 border-t border-gold-100/60 mt-4">
                      <button
                        onClick={() => onSelectProcedure(proc)}
                        className="flex-1 px-3 py-2.5 bg-transparent border border-gold-200 text-luxury-gray text-[10px] font-sans tracking-widest uppercase hover:text-luxury-black hover:border-luxury-black hover:bg-gold-50/50 transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-gold-400" />
                        <span>Detalhes</span>
                      </button>

                      <button
                        onClick={() => onBookProcedure(proc)}
                        className="flex-1 px-3 py-2.5 bg-luxury-black text-luxury-white text-[10px] font-sans tracking-widest uppercase border border-luxury-black hover:bg-gold-400 hover:border-gold-400 transition-all text-center flex items-center justify-center gap-1 cursor-pointer font-medium"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-gold-200" />
                        <span>Agendar</span>
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-luxury-cream border border-gold-100 max-w-lg mx-auto">
                <HelpCircle className="w-12 h-12 text-gold-300 mx-auto mb-4" />
                <h3 className="font-serif text-lg text-luxury-black font-semibold mb-2">Tratamento não localizado</h3>
                <p className="font-sans text-xs text-luxury-gray max-w-sm mx-auto leading-relaxed">
                  Não encontramos nenhum ritual estético correspondente ao termo "{searchQuery}". Experimente usar sinônimos ou limpar os filtros.
                </p>
                <button
                  id="catalog-reset-search-btn"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                  }}
                  className="mt-6 px-5 py-2.5 bg-luxury-black text-luxury-white text-[10px] font-sans tracking-widest uppercase border border-luxury-black hover:bg-transparent hover:text-luxury-black transition-colors"
                >
                  Limpar Filtros
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
