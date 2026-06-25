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
import AdminPanel, { sha256Sync } from './components/AdminPanel';
import { ErrorBoundary } from './components/ErrorBoundary';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import Footer from './components/Footer';
import { Procedure, Booking, Professional } from './types';
import { INITIAL_PROCEDURES } from './data';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

import { db } from './lib/firebase';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  writeBatch, 
  getDocs,
  getDoc
} from 'firebase/firestore';

export default function App() {
  // Real-time synced states from Firestore with LocalStorage static fallback for instant initial load
  const [procedures, setProcedures] = useState<Procedure[]>(() => {
    const saved = localStorage.getItem('hugo_sobral_custom_procedures');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Falha ao parsear procedimentos salvos.', e);
      }
    }
    return INITIAL_PROCEDURES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('hugo_sobral_bookings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Falha ao parsear agendamentos salvos.', e);
      }
    }
    return [];
  });

  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    const saved = localStorage.getItem('hugo_sobral_professionals');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Falha ao parsear profissionais.', e);
      }
    }
    return [];
  });

  // Seeding and Migrating functions to upload existing REST JSON/localStorage data into Firestore if Firestore is empty
  const migrateExistingDataToFirestore = async () => {
    try {
      console.log("[Migration] Iniciando verificação de dados para migração para o Firestore...");

      // 1. Migrate Procedures if collection is empty
      const proceduresSnap = await getDocs(collection(db, 'procedures'));
      if (proceduresSnap.empty) {
        console.log("[Migration] Coleção de 'procedures' vazia no Firestore. Migrando dados...");
        let existingProcs = INITIAL_PROCEDURES;
        try {
          const res = await fetch('/api/procedures');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              existingProcs = data;
              console.log("[Migration] Procedimentos existentes encontrados no servidor.");
            }
          }
        } catch (e) {
          console.error("[Migration] Erro ao carregar procedimentos para migração:", e);
        }
        
        const batch = writeBatch(db);
        existingProcs.forEach(proc => {
          batch.set(doc(db, 'procedures', proc.id), proc);
        });
        await batch.commit();
        console.log(`[Migration] Sincronizados com sucesso ${existingProcs.length} procedimentos.`);
      }

      // 2. Migrate Professionals if collection is empty
      const professionalsSnap = await getDocs(collection(db, 'professionals'));
      if (professionalsSnap.empty) {
        console.log("[Migration] Coleção de 'professionals' vazia no Firestore. Migrando dados...");
        let existingProfs: Professional[] = [];
        try {
          const res = await fetch('/api/professionals');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              existingProfs = data;
              console.log("[Migration] Profissionais existentes encontrados no servidor.");
            }
          }
        } catch (e) {}

        if (existingProfs.length === 0) {
          const saved = localStorage.getItem('hugo_sobral_professionals');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) existingProfs = parsed;
            } catch (e) {}
          }
        }

        if (existingProfs.length > 0) {
          const batch = writeBatch(db);
          existingProfs.forEach(prof => {
            batch.set(doc(db, 'professionals', prof.id), prof);
          });
          await batch.commit();
          console.log(`[Migration] Sincronizados com sucesso ${existingProfs.length} profissionais.`);
        }
      }

      // 3. Migrate Bookings if collection is empty
      const bookingsSnap = await getDocs(collection(db, 'bookings'));
      if (bookingsSnap.empty) {
        console.log("[Migration] Coleção de 'bookings' vazia no Firestore. Migrando dados...");
        let existingBookings: Booking[] = [];
        try {
          const res = await fetch('/api/bookings');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              existingBookings = data;
              console.log("[Migration] Agendamentos existentes encontrados no servidor.");
            }
          }
        } catch (e) {}

        if (existingBookings.length === 0) {
          const saved = localStorage.getItem('hugo_sobral_bookings');
          if (saved) {
            try {
              const parsed = JSON.parse(saved);
              if (Array.isArray(parsed) && parsed.length > 0) existingBookings = parsed;
            } catch (e) {}
          }
        }

        if (existingBookings.length > 0) {
          const batch = writeBatch(db);
          existingBookings.forEach(b => {
            batch.set(doc(db, 'bookings', b.id), b);
          });
          await batch.commit();
          console.log(`[Migration] Sincronizados com sucesso ${existingBookings.length} agendamentos.`);
        }
      }

      // 4. Migrate settings/admin credentials if doesn't exist
      const adminRef = doc(db, 'settings', 'admin');
      const adminSnap = await getDoc(adminRef);
      if (!adminSnap.exists()) {
        const storedUser = localStorage.getItem('hugo_admin_username_db') || 'drhugo.beauty';
        const storedHash = localStorage.getItem('hugo_admin_password_hash_db') || sha256Sync('drhugo123');
        const storedEmail = localStorage.getItem('hugo_admin_email_db') || 'drhugocomercial@gmail.com';
        let storedHistory = ["Sistema instalado: Credenciais administrativas padrão geradas em 13/06/2026."];
        const h = localStorage.getItem('hugo_admin_credentials_history_db');
        if (h) {
          try {
            storedHistory = JSON.parse(h);
          } catch (e) {}
        }

        await setDoc(adminRef, {
          username: storedUser,
          password_hash: storedHash,
          email: storedEmail,
          history: storedHistory
        });
        console.log("[Migration] Configurações administrativas migradas com sucesso.");
      }
    } catch (err) {
      console.error("[Migration] Erro geral durante migração de dados:", err);
    }
  };

  // Real-time subscription to Firestore database
  useEffect(() => {
    // Fire off non-blocking data migration
    migrateExistingDataToFirestore();

    // 1. Listen to Bookings Collection
    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      const list: Booking[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Booking);
      });
      // Sort ascending based on creation date
      list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      
      setBookings(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(list)) {
          localStorage.setItem('hugo_sobral_bookings', JSON.stringify(list));
          return list;
        }
        return prev;
      });
    }, (error) => {
      console.error("[Firestore Errors] Erro ao sincronizar agendamentos:", error);
    });

    // 2. Listen to Professionals Collection
    const unsubProfessionals = onSnapshot(collection(db, 'professionals'), (snapshot) => {
      const list: Professional[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Professional);
      });
      // Sort by UI ordering sequence
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      
      setProfessionals(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(list)) {
          localStorage.setItem('hugo_sobral_professionals', JSON.stringify(list));
          return list;
        }
        return prev;
      });
    }, (error) => {
      console.error("[Firestore Errors] Erro ao sincronizar profissionais:", error);
    });

    // 3. Listen to Procedures Collection
    const unsubProcedures = onSnapshot(collection(db, 'procedures'), (snapshot) => {
      const list: Procedure[] = [];
      snapshot.forEach(docSnap => {
        list.push(docSnap.data() as Procedure);
      });
      
      setProcedures(prev => {
        if (JSON.stringify(prev) !== JSON.stringify(list)) {
          localStorage.setItem('hugo_sobral_custom_procedures', JSON.stringify(list));
          return list;
        }
        return prev;
      });
    }, (error) => {
      console.error("[Firestore Errors] Erro ao sincronizar procedimentos:", error);
    });

    // 4. Listen to Admin Settings
    const unsubSettings = onSnapshot(doc(db, 'settings', 'admin'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        localStorage.setItem('hugo_admin_username_db', data.username || 'drhugo.beauty');
        localStorage.setItem('hugo_admin_password_hash_db', data.password_hash || sha256Sync('drhugo123'));
        localStorage.setItem('hugo_admin_email_db', data.email || 'drhugocomercial@gmail.com');
        localStorage.setItem('hugo_admin_credentials_history_db', JSON.stringify(data.history || []));
      }
    }, (error) => {
      console.error("[Firestore Errors] Erro ao sincronizar configurações:", error);
    });

    return () => {
      unsubBookings();
      unsubProfessionals();
      unsubProcedures();
      unsubSettings();
    };
  }, []);

  // Multi-tab local storage fallback sync (redundant but helpful)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hugo_sobral_bookings' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setBookings(parsed);
          }
        } catch (err) {
          console.error(err);
        }
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Helper to deep clean undefined fields to prevent Firestore serialization errors
  const cleanUndefined = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    const cleaned: any = Array.isArray(obj) ? [] : {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        if (value !== undefined) {
          cleaned[key] = cleanUndefined(value);
        }
      }
    }
    return cleaned;
  };

  // Unified writer synchronization logic helper
  const syncArrayToFirestore = async <T extends { id: string }>(
    colName: string, 
    incomingArray: T[]
  ) => {
    try {
      const q = collection(db, colName);
      const snapshot = await getDocs(q);
      const existingIds = new Set(snapshot.docs.map(doc => doc.id));
      const incomingIds = new Set(incomingArray.map(item => item.id));
      
      const batch = writeBatch(db);
      
      // Upsert modified or added items
      incomingArray.forEach(item => {
        const docRef = doc(db, colName, item.id);
        batch.set(docRef, cleanUndefined(item));
      });
      
      // Calculate deletions
      const idsToDelete: string[] = [];
      existingIds.forEach(id => {
        if (!incomingIds.has(id)) {
          idsToDelete.push(id);
        }
      });

      const docsToDeleteCount = idsToDelete.length;

      // 1. Bloqueio de segurança: Se incomingArray.length === 0, não executar batch.delete()
      if (incomingArray.length === 0) {
        console.warn(`[Firestore Sync Warning] Bloqueio de segurança ativado: incomingArray está vazio para a coleção '${colName}'. Abortando qualquer operação de exclusão em massa.`);
      } else if (docsToDeleteCount > 0) {
        // 3. Log obrigatório: Registrar quantos documentos serão deletados antes do commit
        console.log(`[Firestore Sync Log] ATENÇÃO: Preparando a exclusão de ${docsToDeleteCount} documentos na coleção '${colName}' antes do commit. IDs das exclusões pendentes:`, idsToDelete);

        // 4. Confirmação: Qualquer exclusão em lote deve exigir confirmação explícita
        const confirmed = window.confirm(
          `ALERTA DE SEGURANÇA - EXCLUSÃO EM LOTE:\n\n` +
          `A sincronização com o estado local identificou que ${docsToDeleteCount} documento(s) serão DELETADOS permanentemente da coleção '${colName}' no Firestore:\n` +
          `IDs afetados: ${idsToDelete.join(', ')}\n\n` +
          `Deseja realmente prosseguir com estas exclusões no Firestore?`
        );

        if (!confirmed) {
          console.warn(`[Firestore Sync Warning] Exclusão em lote de ${docsToDeleteCount} documentos cancelada pelo usuário. Operação de exclusão abortada de forma segura.`);
          return;
        }

        // Add deletes if confirmed
        idsToDelete.forEach(id => {
          const docRef = doc(db, colName, id);
          batch.delete(docRef);
        });
      }
      
      await batch.commit();
      console.log(`[Firestore Sync] Coleção '${colName}' sincronizada com sucesso. (Adicionados/Modificados: ${incomingArray.length}, Deletados: ${incomingArray.length === 0 ? 0 : docsToDeleteCount})`);
    } catch (err) {
      console.error(`[Firestore Sync] Erro ao sincronizar coleção '${colName}':`, err);
    }
  };

  // State handlers to bubble modifications instantly into Firestore
  const handleUpdateProcedures = (updated: Procedure[], skipFirestoreSync: boolean = false) => {
    setProcedures(updated);
    localStorage.setItem('hugo_sobral_custom_procedures', JSON.stringify(updated));
    if (!skipFirestoreSync) {
      syncArrayToFirestore('procedures', updated);
    }
  };

  const handleUpdateBookings = (updated: Booking[], skipFirestoreSync: boolean = false) => {
    setBookings(updated);
    localStorage.setItem('hugo_sobral_bookings', JSON.stringify(updated));
    if (!skipFirestoreSync) {
      syncArrayToFirestore('bookings', updated);
    }
  };

  const handleUpdateProfessionals = (updated: Professional[], skipFirestoreSync: boolean = false) => {
    setProfessionals(updated);
    localStorage.setItem('hugo_sobral_professionals', JSON.stringify(updated));
    if (!skipFirestoreSync) {
      syncArrayToFirestore('professionals', updated);
    }
  };

  // Modal / Form Management States
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [preselectedForBooking, setPreselectedForBooking] = useState<Procedure | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const handleCategorySelect = (category: string) => {
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

      let categoryToSelect: string | null = null;
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
