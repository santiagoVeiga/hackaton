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


// Para un bot de kudos, aquí hay ejemplos más específicos:
const kudosMessages = [
  {
    workspace: 'W001',
    user: 'U001',
    message: '@U002 gracias por tu ayuda con el proyecto!',
    timestamp: Timestamp.now()
  },
  {
    workspace: 'W001',
    user: 'U003',
    message: '@U001 excelente presentación hoy 🌟',
    timestamp: Timestamp.now()
  },
  {
    workspace: 'W001',
    user: 'BOT',
    message: '🎉 U001 ha recibido un kudo de U003',
    timestamp: Timestamp.now()
  }
];

// Función principal
(async () => {
  try {
    console.log('Iniciando carga de datos...\n');
    console.log('\n🌟 Cargando kudos...');
    // Cargar kudos
    for (const kudo of kudosMessages) {
      const docRef = await addDoc(collection(db, 'messages'), kudo);
      console.log(`✅ Kudo de ${kudo.user} guardado con ID: ${docRef.id}`);
    }
    console.log('\n🎉 Base de datos poblada exitosamente!');
    console.log(`Total de documentos creados: ${ kudosMessages.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error al poblar la base:', err);
    console.error('Detalles del error:', err.message);
    process.exit(1);
  }
})();