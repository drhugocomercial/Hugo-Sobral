import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Configuration loaded from the backend provisioned environment
const firebaseConfig = {
  apiKey: "AIzaSyAV7C4FklP02cFou3YMxAgq-bPbxkyYvEo",
  authDomain: "temporal-keep-2rr5c.firebaseapp.com",
  projectId: "temporal-keep-2rr5c",
  storageBucket: "temporal-keep-2rr5c.firebasestorage.app",
  messagingSenderId: "132086957110",
  appId: "1:132086957110:web:39defe2335ae525b300497"
};

const app = initializeApp(firebaseConfig);

// Create the db instance. Note: Since the databaseId is custom for AI Studio, 
// we must supply it to the getFirestore helper.
export const db = getFirestore(app, "ai-studio-0ac5ed5d-8ce7-458e-a98f-69242d8ae00a");

// Validate connection to Firestore
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firebase Init] Conexão com Firestore validada com sucesso.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("[Firebase Init] O cliente está offline. Verifique a configuração do Firebase.");
    } else {
      console.warn("[Firebase Init] Teste de carregamento inicial do Firestore:", error);
    }
  }
}

testConnection();
