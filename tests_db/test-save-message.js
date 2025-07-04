const db = require('../firebase');
const { collection, addDoc, Timestamp } = require('firebase/firestore');

(async () => {
  try {
    const data = {
      remitente: 'U123',
      destinatario: 'U456',
      mensaje: 'Hola, ¿cómo estás?',
      timestamp: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, 'mensajes'), data);
    console.log('✅ Mensaje guardado con ID:', docRef.id);
  } catch (err) {
    console.error('❌ Error al guardar mensaje:', err);
  }
})();