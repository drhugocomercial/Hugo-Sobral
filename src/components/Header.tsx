/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, Landmark, Compass, Calendar, Sparkles, Lock } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  onBookClick: () => void;
  activeSection: string;
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function Header({
  onAdminClick,
  onBookClick,
  activeSection,
  selectedCategory,
  onCategorySelect,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Início', href: '#inicio' },
    { name: 'Catálogo', href: '#catalogo' },
    { name: 'Contato', href: '#contato' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);

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

    const targetElement = document.querySelector(href);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-luxury-white/90 backdrop-blur-md py-4 border-b border-gold-100 shadow-luxury'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between lg:justify-center lg:gap-14 w-full">
        {/* LOGO SVG AND BRAND SIGNATURE */}
        <a
          id="brand-logo-link"
          href="#inicio"
          onClick={(e) => handleNavClick(e, '#inicio')}
          className="flex items-center gap-3 group focus:outline-none shrink-0"
          aria-label="Hugo Sobral Estética & Spa Executivo"
        >
          <div className="relative w-64 h-20 sm:w-80 sm:h-24 md:w-96 md:h-28 flex items-center justify-center bg-transparent overflow-hidden transition-all duration-500 p-1">
            <img
              src="https://lh3.googleusercontent.com/d/1dlxQqVFJxJF9Cc5K9qXv2ViEseP-zI7C"
              alt="Hugo Sobral Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
            />
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {menuItems.map((item) => {
              const isActive = activeSection === item.href.replace('#', '') || (item.href === '#catalogo' && activeSection === 'catalogo');
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative font-sans text-[11px] tracking-[0.2em] uppercase transition-all duration-300 pb-1.5 after:content-[""] after:absolute after:bottom-0 after:left-0 after:h-px after:bg-gold-400 after:transition-all after:duration-300 ${
                      isActive
                        ? 'text-gold-500 after:w-full'
                        : 'text-luxury-gray hover:text-luxury-black after:w-0 hover:after:w-full'
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="h-4 w-px bg-gold-200 mx-1" />

          {/* Painel de Controle */}
          <button
            id="header-admin-trigger"
            onClick={onAdminClick}
            className="font-sans text-[11px] tracking-widest text-gold-400 hover:text-luxury-black uppercase transition-colors mr-2"
            title="Painel de Controle"
          >
            Painel
          </button>

          <button
            id="book-now-header-btn"
            onClick={onBookClick}
            className="px-6 py-2.5 bg-luxury-black text-luxury-white text-xs font-sans tracking-widest uppercase border border-luxury-black hover:bg-transparent hover:text-luxury-black transition-all duration-300 focus:outline-none"
          >
            Agendar
          </button>
        </nav>

        {/* MOBILE MENU TOGGLE */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            id="header-mobile-book-btn"
            onClick={onBookClick}
            className="px-4 py-2 bg-luxury-black text-luxury-white text-[10px] font-sans tracking-widest uppercase hover:bg-gold-500 transition-colors"
          >
            Agendar
          </button>
          
          <button
            id="mobile-drawer-toggle"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-luxury-black hover:text-gold-500 transition-colors focus:outline-none"
            aria-label="Abrir menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-x-0 bottom-0 top-[73px] bg-luxury-white z-40 lg:hidden flex flex-col justify-between transition-all duration-500 ease-in-out border-t border-gold-100 ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[100%] opacity-0'
        }`}
      >
        <div className="p-8 space-y-6 overflow-y-auto">
          <ul className="space-y-5">
            {menuItems.map((item, idx) => {
              let isActive = activeSection === item.href.replace('#', '');
              if (activeSection === 'catalogo') {
                if (item.href === '#experiencias-faciais' && selectedCategory === 'EXPERIÊNCIAS FACIAIS') isActive = true;
                if (item.href === '#cuidados-corporais' && selectedCategory === 'CUIDADOS CORPORAIS') isActive = true;
                if (item.href === '#tratamentos' && selectedCategory === 'PROCEDIMENTOS DE TRATAMENTO') isActive = true;
              }
              return (
                <li
                  key={item.name}
                  className="transition-all duration-500"
                  style={{ transitionDelay: `${idx * 75}ms` }}
                >
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block font-serif text-xl py-2.5 tracking-wide border-b border-dashed border-gold-100/40 ${
                      isActive ? 'text-gold-500 font-semibold' : 'text-luxury-black hover:text-gold-500'
                    }`}
                  >
                    {item.name}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-8 bg-luxury-cream border-t border-gold-100/60 text-center space-y-5">
          <div className="flex justify-center gap-4 text-xs font-sans text-gold-500 tracking-[0.2em] uppercase font-semibold">
            <span>Manaus/AM</span>
            <span>•</span>
            <span>+55 95 98103-6729</span>
          </div>
          
          <button
            id="mobile-admin-access-btn"
            onClick={() => {
              setIsOpen(false);
              onAdminClick();
            }}
            className="w-full inline-flex items-center gap-2.5 justify-center px-4 py-3 bg-white border border-gold-300 text-gold-600 hover:text-gold-700 hover:bg-gold-50 text-[11px] font-sans uppercase tracking-[0.2em] transition-all font-medium shadow-xs hover:shadow"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Gabinete Administrativo</span>
          </button>
        </div>
      </div>
    </header>
  );
}
