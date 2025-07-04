// populate-test.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCXLNHdAeb9BLhwnHngYrjAcAILluLh6mU",
  authDomain: "kudosdb-6cf6c.firebaseapp.com",
  projectId: "kudosdb-6cf6c",
  storageBucket: "kudosdb-6cf6c.firebasestorage.app",
  messagingSenderId: "753377450282",
  appId: "1:753377450282:web:2e9d899fd79f817f9ee653",
  measurementId: "G-0N2R35VX7F"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firebase inicializado correctamente');
console.log('DB:', db);

const messages = [
  {
    remitente: 'U001',
    destinatario: 'BOT',
    mensaje: 'Hola, bot!',
  },
  {
    remitente: 'U002',
    destinatario: 'BOT',
    mensaje: '¿Qué puedo hacer hoy?',
  },
  {
    remitente: 'U003',
    destinatario: 'U001',
    mensaje: '¿Tenés un minuto para charlar?',
  },
  {
    remitente: 'BOT',
    destinatario: 'U002',
    mensaje: 'Podés ver tus tareas pendientes con /tareas',
  },
  {
    remitente: 'U001',
    destinatario: 'BOT',
    mensaje: 'Gracias 🙏',
  },
];

(async () => {
    try {
      for (const msg of messages) {
        await addDoc(collection(db, 'messages'), {
          ...msg,
          timestamp: Timestamp.now()
        });
        await addDoc(collection(db, 'workspace'), {
          ...msg,
          timestamp: Timestamp.now()
        });
        await addDoc(collection(db, 'users'), {
          ...msg,
          timestamp: Timestamp.now()
        });
        console.log(`✅ Mensaje de ${msg.remitente} guardado`);
      }
      console.log('🎉 Base de datos poblada con mensajes de prueba.');
    } catch (err) {
      console.error('Error al poblar la base:', err);
    }
  })();