const { App } = require("@slack/bolt");
const { parseUserIdsFromMentions } = require("./utils/parse-mentions");
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, Timestamp } = require('firebase/firestore');
require("dotenv").config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Initialize Slack app
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.APP_TOKEN,
  parseMode: "full",
});

app.command("/kudos", async ({ ack, respond, command, client }) => {
  try {
    await ack();

    const text = command.text.trim();
    const args = text.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    const { status, error, userIds } = parseUserIdsFromMentions(args);

    const quotedMessage = args.find(
      (arg) => arg.startsWith('"') && arg.endsWith('"'),
    );

    const invalidNumberOfArgs = args.length > 2 || args.length < 2;
    const noMention = status !== 200 && error?.msg === "malformed";
    const noQuotedMessage = !quotedMessage;

    if (invalidNumberOfArgs || noMention || noQuotedMessage) {
      respond({
        text: 'command /kudos usage: `/kudos @user "message"`',
        response_type: "ephemeral",
      });

      return;
    }

    const message = quotedMessage?.slice(1, -1);

    const recipientId = userIds[0];
    const recipientInfo = await client.users.info({
      user: recipientId
    });

    try {
      const kudoData = {
        workspace: command.team_id,
        workspaceName: command.team_domain,
        recipient: {
          id: recipientId,
          name: recipientInfo.user.real_name || recipientInfo.user.name,
          username: recipientInfo.user.name
        },
        message: message,
        timestamp: Timestamp.now(),
      };

      const docRef = await addDoc(collection(db, 'messages'), kudoData);
      console.log("Kudo saved with ID: ", docRef.id);

      // Format user ids so that slack creates the mention
      const mentions = userIds.map((id) => `<@${id}>`);

    } catch (firebaseError) {
      console.error("Error saving to Firebase:", firebaseError);
      
      // Still send the kudos even if Firebase fails
      const mentions = userIds.map((id) => `<@${id}>`);
      await respond({
        text: `${mentions.join(", ")} ${message}`,
        response_type: "in_channel",
      });
    }

  } catch (error) {
    console.error("Error in /kudos command:", error);

    await respond({
      text: "Something went wrong processing your command.",
      response_type: "ephemeral",
    });
  }
});

(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log("⚡️ Kudos Bot is running!");
  console.log(`🔥 Firebase connected to project: ${firebaseConfig.projectId}`);
})();