/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeHero from './components/HomeHero';
import CatalogSection from './components/CatalogSection';
import ProcedureModal from './components/ProcedureModal';
import BookingWizard from './components/BookingWizard';
import AdminPanel from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import { Procedure, Booking, Professional } from './types';
import { INITIAL_PROCEDURES } from './data';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  // Load and persist procedures state
  const [procedures, setProcedures] = useState<Procedure[]>(() => {
    const saved = localStorage.getItem('hugo_sobral_custom_procedures');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Falha ao parsear procedimentos salvos. Revertendo para vazio.', e);
      }
    }
    return INITIAL_PROCEDURES;
  });

  // Load and persist bookings state
  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hugo_sobral_bookings');
    let loaded: Booking[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          loaded = parsed;
        }
      } catch (e) {
        console.error('Falha ao parsear agendamentos salvos. Revertendo para vazio.', e);
      }
    }
    console.log("Agendamentos encontrados:", loaded);
    return loaded;
  });

  // Load and persist professionals state
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    const saved = localStorage.getItem('hugo_sobral_professionals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Falha ao parsear profissionais. Revertendo para vazio.', e);
      }
    }
    return [];
  });

  // Sync state data from Server Backend on Mount
  useEffect(() => {
    async function fetchServerData() {
      try {
        const resBookings = await fetch('/api/bookings');
        if (resBookings.ok) {
          const data = await resBookings.json();
          if (Array.isArray(data)) {
            setBookings(data);
            localStorage.setItem('hugo_sobral_bookings', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('[Server Sync] Erro carregando agendamentos:', err);
      }

      try {
        const resProfs = await fetch('/api/professionals');
        if (resProfs.ok) {
          const data = await resProfs.json();
          if (Array.isArray(data)) {
            setProfessionals(data);
            localStorage.setItem('hugo_sobral_professionals', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('[Server Sync] Erro carregando profissionais:', err);
      }

      try {
        const resProcs = await fetch('/api/procedures');
        if (resProcs.ok) {
          const data = await resProcs.json();
          if (Array.isArray(data) && data.length > 0) {
            setProcedures(data);
            localStorage.setItem('hugo_sobral_custom_procedures', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('[Server Sync] Erro carregando procedimentos:', err);
      }
    }

    fetchServerData();
  }, []);

  // Poll server for live real-time auto-sync to handle new bookings/confirmations/etc.
  useEffect(() => {
    async function pollServerData() {
      try {
        const resBookings = await fetch('/api/bookings');
        if (resBookings.ok) {
          const data = await resBookings.json();
          if (Array.isArray(data)) {
            setBookings((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(data)) {
                return data;
              }
              return prev;
            });
            localStorage.setItem('hugo_sobral_bookings', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('[Server Poll] Erro carregando agendamentos:', err);
      }

      try {
        const resProfs = await fetch('/api/professionals');
        if (resProfs.ok) {
          const data = await resProfs.json();
          if (Array.isArray(data)) {
            setProfessionals((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(data)) {
                return data;
              }
              return prev;
            });
            localStorage.setItem('hugo_sobral_professionals', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('[Server Poll] Erro carregando profissionais:', err);
      }

      try {
        const resProcs = await fetch('/api/procedures');
        if (resProcs.ok) {
          const data = await resProcs.json();
          if (Array.isArray(data) && data.length > 0) {
            setProcedures((prev) => {
              if (JSON.stringify(prev) !== JSON.stringify(data)) {
                return data;
              }
              return prev;
            });
            localStorage.setItem('hugo_sobral_custom_procedures', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error('[Server Poll] Erro carregando procedimentos:', err);
      }
    }

    const intervalId = setInterval(pollServerData, 3000); // Poll every 3 seconds
    return () => clearInterval(intervalId);
  }, []);

  // Keep state in sync across different tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hugo_sobral_bookings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBookings(parsed);
            console.log("Agendamentos encontrados (Sync):", parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save procedures to localStorage & server whenever they change
  const handleUpdateProcedures = (updated: Procedure[]) => {
    setProcedures(updated);
    localStorage.setItem('hugo_sobral_custom_procedures', JSON.stringify(updated));
    fetch('/api/procedures', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ procedures: updated })
    }).catch(err => console.error('[Server Sync] Erro salvando procedimentos:', err));
  };

  // Save bookings to localStorage & server whenever they change
  const handleUpdateBookings = (updated: Booking[]) => {
    console.log("Agendamento salvo:", updated);
    setBookings(updated);
    localStorage.setItem('hugo_sobral_bookings', JSON.stringify(updated));
    fetch('/api/bookings', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookings: updated })
    }).catch(err => console.error('[Server Sync] Erro salvando agendamentos:', err));
  };

  const handleUpdateProfessionals = (updated: Professional[]) => {
    setProfessionals(updated);
    localStorage.setItem('hugo_sobral_professionals', JSON.stringify(updated));
    fetch('/api/professionals', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ professionals: updated })
    }).catch(err => console.error('[Server Sync] Erro salvando profissionais:', err));
  };

  // Modal / Form Management States
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [preselectedForBooking, setPreselectedForBooking] = useState<Procedure | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'EXPERIÊNCIAS FACIAIS' | 'CUIDADOS CORPORAIS' | 'PROCEDIMENTOS DE TRATAMENTO'>('ALL');

  const handleCategorySelect = (category: 'EXPERIÊNCIAS FACIAIS' | 'CUIDADOS CORPORAIS' | 'PROCEDIMENTOS DE TRATAMENTO') => {
    setSelectedCategory(category);
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Track page scroll to dynamically update active header highlights
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150;
      const sections = ['inicio', 'catalogo', 'contato'];

      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intercept category hash clicks to scroll and set filter inside CatalogSection
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (!hash) return;

      let categoryToSelect: 'EXPERIÊNCIAS FACIAIS' | 'CUIDADOS CORPORAIS' | 'PROCEDIMENTOS DE TRATAMENTO' | null = null;
      if (hash === '#experiencias-faciais') {
        categoryToSelect = 'EXPERIÊNCIAS FACIAIS';
      } else if (hash === '#cuidados-corporais') {
        categoryToSelect = 'CUIDADOS CORPORAIS';
      } else if (hash === '#tratamentos') {
        categoryToSelect = 'PROCEDIMENTOS DE TRATAMENTO';
      }

      if (categoryToSelect) {
        setSelectedCategory(categoryToSelect);
      }

      const catalogoEl = document.getElementById('catalogo');
      if (catalogoEl) {
        catalogoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    // Run once on mount in case the page loaded with a hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleOpenBooking = (proc: Procedure | null) => {
    setPreselectedForBooking(proc);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-luxury-cream text-luxury-black font-sans relative flex flex-col justify-between">
      {/* GLOBAL BACKGROUND METRICS */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] z-0">
        <div className="w-full h-full bg-[radial-gradient(#b58253_1.5px,transparent_1.5px)] [background-size:24px_24px]" />
      </div>

      {/* HEADER NAVIGATION */}
      <Header
        activeSection={activeSection}
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
        onAdminClick={() => setIsAdminOpen(true)}
        onBookClick={() => handleOpenBooking(null)}
      />

      <main className="flex-1 relative z-10">
        {/* HERO BRAND CARDS & sobre O SPA */}
        <HomeHero
          onViewServices={() => {
            const el = document.getElementById('catalogo');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          onBookClick={() => handleOpenBooking(null)}
        />

        {/* INTERACTIVE PROCEDURAL CATALOG */}
        <div id="catalogo">
          <CatalogSection
            procedures={procedures}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProcedure={(p) => setSelectedProcedure(p)}
            onBookProcedure={(p) => handleOpenBooking(p)}
          />
        </div>

        {/* LUXURIOUS EDITORIAL INTERIM BLOCK */}
        <section className="py-24 bg-luxury-cream border-t border-gold-150/50 relative overflow-hidden select-none">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-6 relative z-10">
            <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold-500 font-semibold block">
              Dr. Hugo Sobral Estética
            </span>
            <p className="font-serif text-2xl md:text-3.5xl text-luxury-black italic leading-normal font-light">
              "A beleza verdadeira floresce quando combinamos as melhores técnicas científicas com o respectivo respeito à individualidade de cada pele."
            </p>
            <div className="w-12 h-[2px] bg-gold-400 mx-auto" />
            <p className="font-sans text-xs text-luxury-gray uppercase tracking-widest font-semibold">
              Manaus - AM • Brasil
            </p>
          </div>
          {/* Decorative faint golden badge */}
          <div className="absolute right-[-60px] bottom-[-60px] w-48 h-48 border border-gold-300/20 rounded-full flex items-center justify-center">
            <div className="w-36 h-36 border border-dashed border-gold-300/10 rounded-full" />
          </div>
        </section>
      </main>

      {/* PREMIUM FOOTER */}
      <Footer
        onAdminClick={() => setIsAdminOpen(true)}
        onBookClick={() => handleOpenBooking(null)}
        onCategorySelect={handleCategorySelect}
      />

      {/* DISCRETE WhatsApp FLOTANTE */}
      <FloatingWhatsApp />

      {/* DETAIL OVERLAY SCREEN */}
      <ProcedureModal
        procedure={selectedProcedure}
        onClose={() => setSelectedProcedure(null)}
        onBook={(p) => handleOpenBooking(p)}
      />

      {/* CHRONOS SCHEDULING DISPATCHER */}
      <ErrorBoundary
        fallbackTitle="Falha ao Carregar o Fluxo de Agendamento"
        fallbackMessage="Ocorreu um erro ao carregar o agendamento eletrônico. Isso pode acontecer devido a inconsistências de dados temporários no navegador. Por favor, redefina os dados ou tente novamente."
      >
        <BookingWizard
          procedures={procedures}
          preselectedProcedure={preselectedForBooking}
          bookings={bookings}
          onUpdateBookings={handleUpdateBookings}
          professionals={professionals}
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setPreselectedForBooking(null);
          }}
        />
      </ErrorBoundary>

      {/* CONTROLE ADMINISTRATIVO CABINET */}
      <ErrorBoundary 
        fallbackTitle="Falha ao Carregar o Painel" 
        fallbackMessage="Ocorreu um erro catastrófico ao carregar o painel administrativo. Isso pode ocorrer por conta de dados inconsistentes inseridos no navegador ou cache corrompido. Clique no botão abaixo para restaurar as configurações padrão de forma segura."
      >
        <AdminPanel
          procedures={procedures}
          onUpdateProcedures={handleUpdateProcedures}
          bookings={bookings}
          onUpdateBookings={handleUpdateBookings}
          professionals={professionals}
          onUpdateProfessionals={handleUpdateProfessionals}
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
        />
      </ErrorBoundary>
    </div>
  );
}
