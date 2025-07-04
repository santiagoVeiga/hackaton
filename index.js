const { App } = require("@slack/bolt");
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const registerCommands = require("./src/registerCommands");
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
  // port: process.env.PORT || 3000,
});

// Register all commands
registerCommands({ instance: appInstance, db });

(async () => {
  // const port = process.env.PORT || 3000;
  await appInstance.start();
  console.log("⚡️ Kudos Bot is running!");
  console.log(`🔥 Firebase connected to project: ${firebaseConfig.projectId}`);
})();
