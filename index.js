const { App } = require("@slack/bolt");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const registerCommands = require("./src/registerCommands");
const http = require('http'); // AGREGAR ESTO
require("dotenv").config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Initialize Slack app
const appInstance = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  parseMode: "full",
});

// Register all commands
registerCommands({ instance: appInstance, db });

// AGREGAR ESTE SERVIDOR HTTP PARA FLY.IO
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

(async () => {
  await appInstance.start();
  console.log("⚡️ Kudos Bot is running!");
  console.log(`🔥 Firebase connected to project: ${firebaseConfig.projectId}`);
  
  // AGREGAR ESTO - INICIAR EL SERVIDOR HTTP
  const port = process.env.PORT || 3000;
  server.listen(port, '0.0.0.0', () => {
    console.log(`🌐 Health check server listening on 0.0.0.0:${port}`);
  });
})();