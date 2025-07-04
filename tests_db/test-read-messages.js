const db = require("../firebase");
const { collection, getDocs } = require("firebase/firestore");

(async () => {
  try {
    const snapshot = await getDocs(collection(db, "mensajes"));
    snapshot.forEach((doc) => {
      console.log(`📨 Mensaje ${doc.id}:`, doc.data());
    });
  } catch (err) {
    console.error("❌ Error al leer mensajes:", err);
  }
})();
