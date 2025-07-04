const db = require('../firebase'); // tu archivo firebase.js
const { collection, addDoc, Timestamp } = require('firebase/firestore');

const mensajes = [
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
    for (const msg of mensajes) {
      await addDoc(collection(db, 'mensajes'), {
        ...msg,
        timestamp: Timestamp.now()
      });
      console.log(`✅ Mensaje de ${msg.remitente} guardado`);
    }
    console.log('🎉 Base de datos poblada con mensajes de prueba.');
  } catch (err) {
    console.error('❌ Error al poblar la base:', err);
  }
})();