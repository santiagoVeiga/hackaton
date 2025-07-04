const db = require("../firebase");
const { collection, addDoc, getDocs } = require("firebase/firestore");

(async () => {
  try {
    // Agregar un documento de prueba
    const docRef = await addDoc(collection(db, "pruebas"), {
      mensaje: "Hola Firebase desde Node.js 👋",
      fecha: new Date(),
    });

    console.log("✅ Documento guardado con ID:", docRef.id);

    // Leer todos los documentos de la colección
    const snapshot = await getDocs(collection(db, "pruebas"));
    snapshot.forEach((doc) => {
      console.log(`📄 ${doc.id}:`, doc.data());
    });

    console.log("✅ Lectura completa");
  } catch (err) {
    console.error("❌ Error al probar Firebase:", err);
  }
})();
